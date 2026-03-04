import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import {
  getAdminBotConfig,
  updateAdminBotConfig,
} from "../../lib/actions/admin-bot-config";

// Mock the Supabase client
const mockSelect = vi.fn();
const mockUpdate = vi.fn();
const mockInsert = vi.fn();
const mockEqUserId = vi.fn();
const mockEqType = vi.fn();
const mockSingle = vi.fn();
const mockListUsers = vi.fn();
const mockEqId = vi.fn();

const mockSupabase = {
  from: vi.fn(() => ({
    select: mockSelect,
    update: mockUpdate,
    insert: mockInsert,
  })),
  auth: {
    admin: {
      listUsers: mockListUsers,
    },
  },
};

// Setup method chain mocks
mockSelect.mockReturnValue({
  eq: mockEqType,
});
mockEqType.mockReturnValue({
  single: mockSingle,
});

mockUpdate.mockReturnValue({
  eq: mockEqId,
});

// Mock Next.js cache revalidation
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock Supabase SSR client
vi.mock("@supabase/ssr", () => {
  return {
    createServerClient: vi.fn(() => mockSupabase),
  };
});

describe("Admin Bot Config Server Actions", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SANITY_PROJECT_ID: "test_project_id",
    };

    // Mock global fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getAdminBotConfig", () => {
    test("throws Error when token is invalid", async () => {
      // Mock fetch to return unauthorized
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      await expect(getAdminBotConfig("invalid_token")).rejects.toThrow(
        "Unauthorized",
      );
      expect(mockSupabase.from).not.toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        "https://test_project_id.api.sanity.io/v2021-06-07/users/me",
        {
          headers: {
            Authorization: "Bearer invalid_token",
          },
        },
      );
    });

    test("returns config when token is valid", async () => {
      // Mock fetch to return valid user
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: "sanity-user-123", name: "Test User" }),
      });

      const mockConfig = {
        id: "123",
        type: "public_agent",
        model: "test-model",
      };
      mockSingle.mockResolvedValueOnce({ data: mockConfig, error: null });

      const result = await getAdminBotConfig("valid_token");

      expect(result).toEqual(mockConfig);
      expect(mockSupabase.from).toHaveBeenCalledWith("bot_configs");
      expect(mockEqType).toHaveBeenCalledWith("type", "public_agent");
    });

    test("returns null when no config found", async () => {
      // Mock fetch to return valid user
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: "sanity-user-123", name: "Test User" }),
      });

      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { code: "PGRST116" },
      });

      const result = await getAdminBotConfig("valid_token");
      expect(result).toBeNull();
    });
  });

  describe("updateAdminBotConfig", () => {
    const validData = { model: "new-model", system_prompt: "new prompt" };

    test("throws Error when token is invalid", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      await expect(
        updateAdminBotConfig("invalid_token", validData),
      ).rejects.toThrow("Unauthorized");
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });

    test("updates existing config successfully", async () => {
      // Need two successful fetches because updateAdminBotConfig calls getAdminBotConfig first
      // Actually wait, let's see implementation. Yes it calls getAdminBotConfig inside which will call fetch again if we don't prevent it, or we just mock fetch twice.
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
        });

      const existingConfig = { id: "123", type: "public_agent" };
      // First call is getAdminBotConfig checking for existing
      mockSingle.mockResolvedValueOnce({ data: existingConfig, error: null });
      mockEqId.mockResolvedValueOnce({ error: null });

      const result = await updateAdminBotConfig("valid_token", validData);

      expect(result).toEqual({ success: true });
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          ...validData,
          updated_at: expect.any(String),
        }),
      );
      expect(mockEqId).toHaveBeenCalledWith("id", "123");
    });

    test("inserts new config when none exists", async () => {
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
        });

      // First call is getAdminBotConfig checking for existing - return null
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { code: "PGRST116" },
      });
      mockListUsers.mockResolvedValueOnce({
        data: { users: [{ id: "user-123" }] },
        error: null,
      });
      mockInsert.mockResolvedValueOnce({ error: null });

      const result = await updateAdminBotConfig("valid_token", validData);

      expect(result).toEqual({ success: true });
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "public_agent",
          model: "new-model",
          system_prompt: "new prompt",
        }),
      );
    });
  });
});
