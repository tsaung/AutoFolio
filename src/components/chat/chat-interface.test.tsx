import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { ChatInterface } from "./chat-interface";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useChat } from "@ai-sdk/react";

// Mock the module top-level
vi.mock("@ai-sdk/react", () => ({
  useChat: vi.fn(),
}));

describe("ChatInterface", () => {
  const mockSendMessage = vi.fn();

  // Default return value helper
  const defaultChatReturn = {
    messages: [],
    sendMessage: mockSendMessage,
    status: "ready",
  };

  const mockProfile = {
    id: "123",
    name: "Test User",
    profession: "Developer",
    field: "Tech",
    experience: 5,
    welcome_message: "Welcome!",
    chat_welcome_message: "Welcome!",
    professional_summary: "Summary",
    avatar_url: null,
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock implementation before each test
    vi.mocked(useChat).mockReturnValue(defaultChatReturn as any);

    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("renders welcome screen initially", async () => {
    // The "Welcome!" message is animated in via AIOrb with a 600ms delay
    render(<ChatInterface profile={mockProfile} />);
    
    // findByText automatically waits and retries for default timeout (1000ms)
    // We add a safety margin with a custom timeout of 2000ms
    expect(await screen.findByText("Welcome!", {}, { timeout: 2000 })).toBeInTheDocument();
  });

  it("renders suggested prompts", () => {
    render(<ChatInterface profile={mockProfile} />);
    expect(
      screen.getByText("Tell me about your experience"),
    ).toBeInTheDocument();
  });

  it("clicking a prompt triggers sendMessage", async () => {
    render(<ChatInterface profile={mockProfile} />);
    const experiencePrompt = screen.getByText("Tell me about your experience");

    fireEvent.click(experiencePrompt);

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        text: "Tell me about your experience",
      });
    });
  });

  it("typing and sending a message calls sendMessage", async () => {
    render(<ChatInterface profile={mockProfile} />);
    const input = screen.getByPlaceholderText("Ask Test anything...");
    const sendButton = screen.getByRole("button", { name: "Send message" });

    fireEvent.change(input, { target: { value: "Hello AI" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith({ text: "Hello AI" });
    });
  });

  it("disables input when streaming", () => {
    // Override mock for this test
    vi.mocked(useChat).mockReturnValue({
      ...defaultChatReturn,
      status: "streaming",
    } as any);

    render(<ChatInterface profile={mockProfile} />);

    const sendButton = screen.getByRole("button", { name: "Send message" });
    expect(sendButton).toBeDisabled();
  });

  it("renders typing indicator when streaming", () => {
    vi.mocked(useChat).mockReturnValue({
      ...defaultChatReturn,
      status: "streaming",
    } as any);

    const { container } = render(<ChatInterface profile={mockProfile} />);
    // Check for the bouncing dots
    const dots = container.getElementsByClassName("animate-bounce");
    expect(dots.length).toBe(3);
  });
});
