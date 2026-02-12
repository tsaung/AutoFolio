import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText, convertToModelMessages } from 'ai'
import { adminClient } from '@/lib/db/admin'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(req: Request) {
  const { messages } = await req.json()

  // 1. Fetch the selected model from DB (using Service Role to bypass RLS)
  const { data, error } = await adminClient
    .from('system_settings')
    .select('value')
    .eq('key', 'ai_model_config')
    .single()

  let modelId = 'google/gemini-3-flash-preview' // Default fallback

  if (data?.value?.modelId) {
    modelId = data.value.modelId
  } else if (error) {
    console.warn('Failed to fetch AI model config, using default:', error.message)
  }

  const modelMessages = [...await convertToModelMessages(messages)];
  // 2. Call the AI provider
  const result = streamText({
    model: openrouter.chat(modelId),
    messages: modelMessages,
    system: "You are Thant Sin's Portfolio Assistant. You are a helpful assistant that answers questions about Thant Sin's work and experience.",
  })

  // 3. Stream the response to the client
  return result.toUIMessageStreamResponse();
}
