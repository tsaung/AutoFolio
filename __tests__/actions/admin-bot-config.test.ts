import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import {
  getAdminBotConfig,
  updateAdminBotConfig,
} from "@/lib/actions/admin-bot-config";

// Mock the Supabase client
const mockSelect = vi.fn();
const mockUpdate = vi.fn();
const mockInsert = vi.fn();
const mockEqUserId = vi.fn();
const mockEqType = vi.fn();
const mockSingle = vi.fn();
const mockEqId = vi.fn();

const mockSupabase = {
  from: vi.fn(() => ({
    select: mockSelect,
    update: mockUpdate,
    insert: mockInsert,
  })),
};

// Setup method chain mocks
mockSelect.mockReturnValue({
  eq: mockEqUserId,
});
mockEqUserId.mockReturnValue({
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
vi.mock("@supabase/ssr", () => ({
  createClient: vi.fn(() => mockSupabase),
}));

describe("Admin Bot Config Server Actions", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv, ADMIN_API_SECRET: "test_secret" };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getAdminBotConfig", () => {
    test("throws Error when secret is invalid", async () => {
      await expect(getAdminBotConfig("invalid_secret")).rejects.toThrow(
        "Unauthorized",
      );
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });

    test("returns config when secret is valid", async () => {
      const mockConfig = {
        id: "123",
        type: "public_agent",
        model: "test-model",
      };
      mockSingle.mockResolvedValueOnce({ data: mockConfig, error: null });

      const result = await getAdminBotConfig("test_secret");

      expect(result).toEqual(mockConfig);
      expect(mockSupabase.from).toHaveBeenCalledWith("bot_configs");
      expect(mockEqType).toHaveBeenCalledWith("type", "public_agent");
    });

    test("returns null when no config found", async () => {
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { code: "PGRST116" },
      });

      const result = await getAdminBotConfig("test_secret");
      expect(result).toBeNull();
    });
  });

  describe("updateAdminBotConfig", () => {
    const validData = { model: "new-model", system_prompt: "new prompt" };

    test("throws Error when secret is invalid", async () => {
      await expect(
        updateAdminBotConfig("invalid_secret", validData),
      ).rejects.toThrow("Unauthorized");
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });

    test("updates existing config successfully", async () => {
      const existingConfig = { id: "123", type: "public_agent" };
      // First call is getAdminBotConfig checking for existing
      mockSingle.mockResolvedValueOnce({ data: existingConfig, error: null });
      mockEqId.mockResolvedValueOnce({ error: null });

      const result = await updateAdminBotConfig("test_secret", validData);

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
      // First call is getAdminBotConfig checking for existing - return null
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { code: "PGRST116" },
      });
      mockInsert.mockResolvedValueOnce({ error: null });

      const result = await updateAdminBotConfig("test_secret", validData);

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
