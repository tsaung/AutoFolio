import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FloatingChat } from "../floating-chat";
import { describe, it, expect, vi } from "vitest";

// Mock ChatInterface as it has complex dependencies
vi.mock("@/components/chat/chat-interface", () => ({
  ChatInterface: () => <div data-testid="chat-interface">Chat Interface</div>,
}));

// Mock Sheet components to simplify testing
vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children, open, onOpenChange }: any) => (
    <div data-testid="sheet" data-state={open ? "open" : "closed"}>
      <button data-testid="test-open-btn" onClick={() => onOpenChange(true)}>
        Open
      </button>
      {open && <button onClick={() => onOpenChange(false)}>Close</button>}
      {children}
    </div>
  ),
  SheetTrigger: ({ children, asChild }: any) => (
    <button data-testid="sheet-trigger">{children}</button>
  ),
  SheetContent: ({ children, side }: any) => (
    <div data-testid="sheet-content" data-side={side}>
      {children}
    </div>
  ),
  SheetHeader: ({ children }: any) => <div>{children}</div>,
  SheetTitle: ({ children }: any) => <div>{children}</div>,
}));

describe("FloatingChat", () => {
  const mockProfile: any = { id: "1", name: "Test User" };
  const mockBotConfig: any = { id: "1", model: "gpt-4" };

  it("renders the floating button", () => {
    render(<FloatingChat profile={mockProfile} botConfig={mockBotConfig} />);
    expect(screen.getByTestId("sheet-trigger")).toBeDefined();
  });

  it("renders sheet content with side='bottom'", () => {
    render(<FloatingChat profile={mockProfile} botConfig={mockBotConfig} />);
    const content = screen.getByTestId("sheet-content");
    expect(content.getAttribute("data-side")).toBe("bottom");
  });

  it("renders chat interface inside sheet content when opened", async () => {
    render(<FloatingChat profile={mockProfile} botConfig={mockBotConfig} />);

    // Open the sheet using our test button (since internal Radix logic is mocked)
    fireEvent.click(screen.getByTestId("test-open-btn"));

    // ChatInterface is dynamically imported and conditionally rendered, so wait for it
    await waitFor(() => {
      expect(screen.getByTestId("chat-interface")).toBeDefined();
    });
  });
});
