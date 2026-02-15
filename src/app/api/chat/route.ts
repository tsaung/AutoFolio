import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, convertToModelMessages } from "ai";
import { adminClient } from "@/lib/db/admin";
import { embedQuery } from "@/lib/rag/embedder";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

/**
 * Retrieve relevant knowledge chunks for a given query via vector similarity search.
 */
async function retrieveContext(
  query: string,
  topK: number = 5,
): Promise<string> {
  if (!query.trim()) return "";

  try {
    const queryEmbedding = await embedQuery(query);

    // Use pgvector cosine similarity (<=> operator) via RPC
    const { data: chunks, error } = await adminClient.rpc(
      "match_knowledge_chunks",
      {
        query_embedding: JSON.stringify(queryEmbedding),
        match_count: topK,
        match_threshold: 0.3,
      },
    );

    if (error || !chunks || chunks.length === 0) {
      if (error) {
        console.warn("[RAG] Retrieval error:", error.message);
      }
      return "";
    }

    const contextParts = chunks.map(
      (chunk: { content: string }, i: number) =>
        `[Source ${i + 1}]\n${chunk.content}`,
    );

    return contextParts.join("\n\n");
  } catch (error) {
    console.warn("[RAG] Retrieval failed, continuing without context:", error);
    return "";
  }
}

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
    ? [
        `Name: ${profile.name ?? "Unknown"}`,
        `Profession: ${profile.profession ?? "Unknown"}`,
        `Years of Experience: ${profile.experience ?? "Unknown"}`,
        `Field: ${profile.field ?? "Unknown"}`,
        `Professional Summary: ${profile.professional_summary ?? "Not available."}`,
      ].join("\n")
    : "";

  // 3. RAG Retrieval — find relevant knowledge chunks for the user's latest message
  const latestUserMsg = [...messages]
    .reverse()
    .find((m: { role: string }) => m.role === "user");

  let queryText = "";
  if (latestUserMsg?.parts) {
    queryText = latestUserMsg.parts
      .filter((p: { type: string }) => p.type === "text")
      .map((p: { text: string }) => p.text)
      .join(" ");
  }

  const ragContext = queryText.trim() ? await retrieveContext(queryText) : "";

  // 4. Resolve the system prompt
  let resolvedSystemPrompt: string;

  if (systemPrompt) {
    resolvedSystemPrompt = systemPrompt
      .replace(/\{name\}/g, profile?.name ?? "the user")
      .replace(/\{profession\}/g, profile?.profession ?? "a professional")
      .replace(/\{experience\}/g, profile?.experience?.toString() ?? "several")
      .replace(/\{field\}/g, profile?.field ?? "their field");
  } else {
    resolvedSystemPrompt = `You are ${profile?.name ?? "the user"}'s Portfolio Assistant. You are a helpful assistant that answers questions about their work and experience.`;
  }

  // Append profile context
  if (profileContext) {
    resolvedSystemPrompt += `\n\n## Profile\n${profileContext}`;
  }

  // Append RAG context
  if (ragContext) {
    resolvedSystemPrompt += `\n\n## Relevant Knowledge\nUse the following information to answer the user's question. If the information doesn't contain the answer, say so honestly.\n\n${ragContext}`;
  }

  const modelMessages = [...(await convertToModelMessages(messages))];

  // 5. Call the AI provider
  const result = streamText({
    model: openrouter.chat(modelId),
    messages: modelMessages,
    system: resolvedSystemPrompt,
  });

  // 6. Stream the response to the client
  return result.toUIMessageStreamResponse();
}
