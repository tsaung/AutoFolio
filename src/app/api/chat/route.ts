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

  // 1. Fetch the selected model from DB (using Service Role to bypass RLS)
  const { data, error } = await adminClient
    .from("system_settings")
    .select("value")
    .eq("key", "ai_model_config")
    .single();

  let modelId = "google/gemini-3-flash-preview"; // Default fallback

  if (data?.value?.modelId) {
    modelId = data.value.modelId;
  } else if (error) {
    console.warn(
      "Failed to fetch AI model config, using default:",
      error.message,
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

  const modelMessages = [...(await convertToModelMessages(messages))];
  // 2. Call the AI provider
  const result = streamText({
    model: openrouter.chat(modelId),
    messages: modelMessages,
    system: `You are ${profile?.name || "the user"}'s Portfolio Assistant. You are a helpful assistant that answers questions about their work and experience.
    
    ${profileContext}
    `,
  });

  // 3. Stream the response to the client
  return result.toUIMessageStreamResponse();
}
