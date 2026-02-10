import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText } from 'ai'
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

  let modelId = 'openai/gpt-4o-mini' // Default fallback

  if (data?.value?.modelId) {
    modelId = data.value.modelId
  } else if (error) {
    console.warn('Failed to fetch AI model config, using default:', error.message)
  }

  // 2. Call the AI provider
  const result = streamText({
    model: openrouter.chat(modelId),
    messages,
    system: 'You are a helpful portfolio assistant. You are chatting with a visitor on the portfolio site.',
  })

  return result.toTextStreamResponse()
}
