import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { streamText } from "ai";

// Define references to access mocks in tests
const { mockFrom } = vi.hoisted(() => {
  const mockFrom = vi.fn();
  return { mockFrom };
});

// Mock Supabase admin client
vi.mock("@/lib/db/admin", () => ({
  adminClient: {
    from: mockFrom,
  },
}));

vi.mock("@openrouter/ai-sdk-provider", () => ({
  createOpenRouter: vi.fn().mockReturnValue({
    chat: vi.fn().mockReturnValue({ id: "mock-model", provider: "openrouter" }),
  }),
}));

// Mock the AI SDK and provider
vi.mock("ai", () => ({
  streamText: vi.fn().mockImplementation(() => {
    return {
      toUIMessageStreamResponse: vi
        .fn()
        .mockReturnValue(new Response("Mock Stream")),
    };
  }),
  convertToModelMessages: vi.fn().mockImplementation((messages) => messages),
  pipeUIMessageStreamToResponse: vi.fn(),
}));

// Helper to create a mock Supabase query chain
function createMockChain(resolvedValue: unknown) {
  const chain: Record<string, unknown> = {};
  const resolver = () => Promise.resolve(resolvedValue);
  // Each method returns the chain itself, except terminal methods
  chain.select = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.limit = vi.fn().mockReturnValue(chain);
  chain.order = vi.fn().mockReturnValue(chain);
  chain.single = vi.fn().mockImplementation(resolver);
  // Make chain itself thenable for Promise.all (non-single queries)
  chain.then = (resolve: (v: unknown) => void) => resolver().then(resolve);
  return chain;
}

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should use the default model when no bot_configs row is found", async () => {
    const errorResult = {
      data: null,
      error: { code: "PGRST116", message: "Not found" },
    };

    // All tables return null/error
    mockFrom.mockImplementation(() => createMockChain(errorResult));

    const req = {
      json: vi
        .fn()
        .mockResolvedValue({ messages: [{ role: "user", content: "Hello" }] }),
    } as unknown as Request;

    await POST(req);

    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({
        model: expect.anything(),
        system: expect.stringContaining("Portfolio Assistant"),
      }),
    );
  });

  it("should use the configured model and system prompt from bot_configs", async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === "bot_configs") {
        return createMockChain({
          data: {
            model: "openai/gpt-4o",
            system_prompt:
              "You are {name}'s assistant specializing in {profession}.",
            provider: "openrouter",
          },
          error: null,
        });
      }
      if (table === "profiles") {
        return createMockChain({
          data: {
            id: "user-1",
            name: "Thant Sin",
            profession: "Software Engineer",
            experience: 5,
            field: "Web Development",
            professional_summary: "Experienced developer.",
          },
          error: null,
        });
      }
      // knowledge_chunks / rpc fallback
      return createMockChain({ data: [], error: null });
    });

    const req = {
      json: vi
        .fn()
        .mockResolvedValue({ messages: [{ role: "user", content: "Hello" }] }),
    } as unknown as Request;

    await POST(req);

    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({
        model: expect.anything(),
        system: expect.stringContaining(
          "You are Thant Sin's assistant specializing in Software Engineer.",
        ),
      }),
    );
  });
});
