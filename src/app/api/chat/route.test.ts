import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { streamText } from "ai";

// Define references to access mocks in tests
const { mockFrom, mockSelect, mockLimit, mockEq, mockSingle } = vi.hoisted(
  () => {
    const mockSingle = vi.fn();
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockLimit = vi
      .fn()
      .mockReturnValue({ single: mockSingle, eq: mockEq });
    const mockSelect = vi
      .fn()
      .mockReturnValue({ eq: mockEq, limit: mockLimit });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    return { mockFrom, mockSelect, mockLimit, mockEq, mockSingle };
  },
);

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

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ eq: mockEq, limit: mockLimit });
    mockEq.mockReturnValue({ single: mockSingle, limit: mockLimit });
    mockLimit.mockReturnValue({ single: mockSingle, eq: mockEq });
  });

  it("should use the default model when no bot_configs row is found", async () => {
    // Mock: bot_configs returns null, profiles returns null
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: "PGRST116", message: "Not found" },
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
        system: expect.stringContaining("Portfolio Assistant"),
      }),
    );
  });

  it("should use the configured model and system prompt from bot_configs", async () => {
    let callCount = 0;
    mockSingle.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        // bot_configs query
        return Promise.resolve({
          data: {
            model: "openai/gpt-4o",
            system_prompt:
              "You are {name}'s assistant specializing in {profession}.",
            provider: "openrouter",
          },
          error: null,
        });
      }
      // profiles query
      return Promise.resolve({
        data: {
          name: "Thant Sin",
          profession: "Software Engineer",
          experience: 5,
          field: "Web Development",
          professional_summary: "Experienced developer.",
        },
        error: null,
      });
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
