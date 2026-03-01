import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { VisitorLayoutWrapper } from "../visitor-layout-wrapper";
import { describe, it, expect, vi, beforeAll } from "vitest";

// Mock matchMedia for JSDOM
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

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

describe("VisitorLayoutWrapper", () => {
  const mockProfile: any = { id: "1", name: "Test User" };
  const mockBotConfig: any = { id: "1", model: "gpt-4" };

  it("renders children natively when closed", () => {
    render(
      <VisitorLayoutWrapper profile={mockProfile} botConfig={mockBotConfig}>
        <div data-testid="child-content">Child UI</div>
      </VisitorLayoutWrapper>,
    );
    expect(screen.getByTestId("child-content")).toBeDefined();
    // FAB is visible by default
    expect(screen.getByRole("button", { name: "Chat with AI" })).toBeDefined();
  });

  it("hides FAB and shows chat interface when opened", async () => {
    render(
      <VisitorLayoutWrapper profile={mockProfile} botConfig={mockBotConfig}>
        <div data-testid="child-content">Child UI</div>
      </VisitorLayoutWrapper>,
    );

    // Open chat
    const fabButton = screen.getByRole("button", { name: "Chat with AI" });
    fireEvent.click(fabButton);

    // After clicking, the chat interface components should mount
    await waitFor(() => {
      // Due to the dual render approach (Desktop Sidebar + Mobile Sheet),
      // we'll get multiple chat interfaces rendering in the DOM tree depending
      // on media queries. We want to ensure at least one renders.
      const chatInterfaces = screen.getAllByTestId("chat-interface");
      expect(chatInterfaces.length).toBeGreaterThan(0);
    });

    // The FAB button should be removed from DOM
    expect(screen.queryByRole("button", { name: "Chat with AI" })).toBeNull();
  });
});
