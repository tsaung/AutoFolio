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
  const defaultChatProps = {
    messages: [],
    input: "",
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
    professional_summary: "Summary",
    avatar_url: null,
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock implementation before each test
    vi.mocked(useChat).mockReturnValue(defaultChatProps as any);

    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("renders welcome screen initially", () => {
    render(<ChatInterface profile={mockProfile} />);
    expect(screen.getByText("Welcome!")).toBeInTheDocument();
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
    const input = screen.getByPlaceholderText("Type your message...");
    const sendButton = screen.getByTestId("submit-button");

    fireEvent.change(input, { target: { value: "Hello AI" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        text: "Hello AI",
      });
    });
  });

  it("disables input when streaming", () => {
    // Override mock for this test
    vi.mocked(useChat).mockReturnValue({
      ...defaultChatProps,
      status: "streaming",
    } as any);

    render(<ChatInterface profile={mockProfile} />);

    const sendButton = screen.getByTestId("submit-button");
    expect(sendButton).toBeDisabled();
  });

  it("renders profile name and profession in header when profile is provided", () => {
    render(<ChatInterface profile={mockProfile} />);

    const header = screen.getByRole("banner");

    // Check within the header specifically
    expect(
      within(header).getByRole("heading", { name: "Test User" }),
    ).toBeInTheDocument();

    expect(
      within(header).queryByRole("heading", { name: "BotFolio" }),
    ).not.toBeInTheDocument();
  });

  it("renders professionally/YOE in hero but NOT name (since it is in header)", () => {
    render(<ChatInterface profile={mockProfile} />);

    // Name is in header, should NOT be in main hero content (which is not the banner)
    const main = screen.queryByRole("main") || document.body;
    // We expect the name to be in the header (banner)
    const header = screen.getByRole("banner");
    expect(within(header).getByText("Test User")).toBeInTheDocument();

    // In the hero body, we expect Profession only (YOE removed)
    expect(screen.getByText(/Developer/)).toBeInTheDocument();
    expect(screen.queryByText(/5\+ YOE/)).not.toBeInTheDocument();
  });

  it("renders BotFolio branding in header when no profile is provided", () => {
    render(<ChatInterface profile={null} />);
    expect(
      screen.getByRole("heading", { name: "BotFolio" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Test User")).not.toBeInTheDocument();
  });
});
