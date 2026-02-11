import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChatInterface } from './chat-interface'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useChat } from '@ai-sdk/react'

// Mock the module top-level
vi.mock('@ai-sdk/react', () => ({
    useChat: vi.fn(),
}))

describe('ChatInterface', () => {
    const mockSendMessage = vi.fn()

    // Default return value helper
    const defaultChatProps = {
        messages: [],
        input: '',
        sendMessage: mockSendMessage,
        status: 'ready',
    }

    beforeEach(() => {
        vi.clearAllMocks()
        // Reset the mock implementation before each test
        vi.mocked(useChat).mockReturnValue(defaultChatProps as any)

        // Mock scrollIntoView
        window.HTMLElement.prototype.scrollIntoView = vi.fn()
    })

    it('renders welcome screen initially', () => {
        render(<ChatInterface />)
        expect(screen.getByText('Welcome!')).toBeInTheDocument()
    })

    it('renders suggested prompts', () => {
        render(<ChatInterface />)
        expect(screen.getByText('Tell me about your experience')).toBeInTheDocument()
    })

    it('clicking a prompt triggers sendMessage', async () => {
        render(<ChatInterface />)
        const experiencePrompt = screen.getByText('Tell me about your experience')

        fireEvent.click(experiencePrompt)

        await waitFor(() => {
            expect(mockSendMessage).toHaveBeenCalledWith({
                text: 'Tell me about your experience',
            })
        })
    })

    it('typing and sending a message calls sendMessage', async () => {
        render(<ChatInterface />)
        const input = screen.getByPlaceholderText('Type your message...')
        const sendButton = screen.getByTestId('submit-button')

        fireEvent.change(input, { target: { value: 'Hello AI' } })
        fireEvent.click(sendButton)

        await waitFor(() => {
            expect(mockSendMessage).toHaveBeenCalledWith({
                text: 'Hello AI',
            })
        })
    })

    it('disables input when streaming', () => {
        // Override mock for this test
        vi.mocked(useChat).mockReturnValue({
            ...defaultChatProps,
            status: 'streaming',
        } as any)

        render(<ChatInterface />)

        const sendButton = screen.getByTestId('submit-button')
        expect(sendButton).toBeDisabled()
    })
})
