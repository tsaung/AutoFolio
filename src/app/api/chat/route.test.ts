import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from './route'
import { streamText } from 'ai'
import { adminClient } from '@/lib/db/admin'

// Define references to access mocks in tests
const { mockFrom, mockSelect, mockEq, mockSingle } = vi.hoisted(() => {
    const mockSingle = vi.fn()
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })
    return { mockFrom, mockSelect, mockEq, mockSingle }
})

// Mock Supabase admin client
vi.mock('@/lib/db/admin', () => ({
    adminClient: {
        from: mockFrom,
    },
}))

vi.mock('@openrouter/ai-sdk-provider', () => ({
    createOpenRouter: vi.fn().mockReturnValue({
        chat: vi.fn().mockReturnValue({ id: 'mock-model', provider: 'openrouter' }),
    }),
}))

// Mock the AI SDK and provider
vi.mock('ai', () => ({
    streamText: vi.fn().mockImplementation((args) => {
        return {
            toUIMessageStreamResponse: vi.fn().mockReturnValue(new Response('Mock Stream')),
        }
    }),
    convertToModelMessages: vi.fn().mockImplementation((messages) => messages),
    pipeUIMessageStreamToResponse: vi.fn(),
}))

describe('POST /api/chat', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Reset chain return values if needed, but they are constant functions here so just clear calls
        mockFrom.mockReturnValue({ select: mockSelect })
        mockSelect.mockReturnValue({ eq: mockEq })
        mockEq.mockReturnValue({ single: mockSingle })
    })

    it('should use the default model gemini-3-flash-preview when no config is found', async () => {
        // Mock Supabase returning no data (error/null)
        mockSingle.mockResolvedValue({ data: null, error: { message: 'Not found' } })

        const req = {
            json: vi.fn().mockResolvedValue({ messages: [{ role: 'user', content: 'Hello' }] }),
        } as unknown as Request

        await POST(req)

        expect(streamText).toHaveBeenCalledWith(expect.objectContaining({
            model: expect.anything(),
            system: "You are Thant Sin's Portfolio Assistant. You are a helpful assistant that answers questions about Thant Sin's work and experience.",
        }))
    })

    it('should use the configured model from DB if available', async () => {
        // Mock Supabase returning a config
        mockSingle.mockResolvedValue({
            data: { value: { modelId: 'openai/gpt-4o' } },
            error: null
        })

        const req = {
            json: vi.fn().mockResolvedValue({ messages: [{ role: 'user', content: 'Hello' }] }),
        } as unknown as Request

        await POST(req)

        // Verify streamText was called
        expect(streamText).toHaveBeenCalled()
    })
})
