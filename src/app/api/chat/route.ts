import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, convertToModelMessages } from "ai";
import { adminClient } from "@/lib/db/admin";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  // 1. Fetch the bot config from the bot_configs table (public_agent)
  const { data: botConfig, error: configError } = await adminClient
    .from("bot_configs")
    .select("*")
    .eq("type", "public_agent")
    .limit(1)
    .single();

  let modelId = "google/gemini-2.0-flash-001"; // Default fallback
  let systemPrompt = "";

  if (botConfig) {
    modelId = botConfig.model || modelId;
    systemPrompt = botConfig.system_prompt || "";
  } else if (configError) {
    console.warn(
      "Failed to fetch bot config, using defaults:",
      configError.message,
    );
  }

  // 2. Fetch User Profile for Context
  const { data: profile } = await adminClient
    .from("profiles")
    .select("*")
    .limit(1)
    .single();

  const profileContext = profile
    ? `
  Here is the professional summary of the person you are assisting:
  ${profile.professional_summary || "Not available."}

  Name: ${profile.name || "Unknown"}
  Profession: ${profile.profession || "Unknown"}
  years of experience: ${profile.experience || "Unknown"}
  `
    : "";

  // 3. Resolve the system prompt — use configured prompt with placeholder interpolation, or fall back to a default
  let resolvedSystemPrompt: string;

  if (systemPrompt) {
    resolvedSystemPrompt = systemPrompt
      .replace(/\{name\}/g, profile?.name || "the user")
      .replace(/\{profession\}/g, profile?.profession || "a professional")
      .replace(/\{experience\}/g, profile?.experience?.toString() || "several")
      .replace(/\{field\}/g, profile?.field || "their field");

    // Append profile context for additional grounding
    resolvedSystemPrompt += `\n\n${profileContext}`;
  } else {
    resolvedSystemPrompt = `You are ${profile?.name || "the user"}'s Portfolio Assistant. You are a helpful assistant that answers questions about their work and experience.
    
    ${profileContext}
    `;
  }

  const modelMessages = [...(await convertToModelMessages(messages))];

  // 4. Call the AI provider
  const result = streamText({
    model: openrouter.chat(modelId),
    messages: modelMessages,
    system: resolvedSystemPrompt,
  });

  // 5. Stream the response to the client
  return result.toUIMessageStreamResponse();
}
