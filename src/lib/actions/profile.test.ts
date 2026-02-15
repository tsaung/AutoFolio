import { describe, it, expect, vi, beforeEach } from "vitest";
import { getProfile, updateProfile } from "./profile";

// --- Mocks ---

// Hoist mocks to be available in vi.mock factories
const {
  mockSelect,
  mockUpdate,
  mockUpsert,
  mockEq,
  mockSingle,
  mockFrom,
  mockGetUser,
  mockGetBotConfig,
  mockUpdateBotConfig,
} = vi.hoisted(() => {
  return {
    mockSelect: vi.fn(),
    mockUpdate: vi.fn(),
    mockUpsert: vi.fn(),
    mockEq: vi.fn(),
    mockSingle: vi.fn(),
    mockFrom: vi.fn(),
    mockGetUser: vi.fn(),
    mockGetBotConfig: vi.fn(),
    mockUpdateBotConfig: vi.fn(),
  };
});

// Mock bot-config actions to prevent actual DB calls or complex chaining requirements
vi.mock("./bot-config", () => ({
  getBotConfig: mockGetBotConfig,
  updateBotConfig: mockUpdateBotConfig,
}));

// Mock the server client creation
vi.mock("@/lib/db/server", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  })),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Profile Server Actions", () => {
  beforeEach(() => {
    vi.resetAllMocks(); // Clear mocks (history and implementations if needed, but mostly history)

    // Setup chainable mocks for Supabase
    mockFrom.mockReturnValue({
      select: mockSelect,
      update: mockUpdate,
      upsert: mockUpsert,
    });
    mockSelect.mockReturnValue({
      eq: mockEq,
      limit: vi.fn().mockReturnValue({ single: mockSingle }), // Added limit mock for getPublicProfile
    });
    mockEq.mockReturnValue({
      single: mockSingle,
    });
    mockUpdate.mockReturnValue({
      eq: mockEq,
    });
    // Upsert chain: upsert -> select -> single
    mockUpsert.mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: mockSingle,
      }),
    });
  });

  describe("getProfile", () => {
    it("should return profile data when found", async () => {
      const mockProfile = {
        id: "user-123",
        name: "Test User",
        profession: "Developer",
      };

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123", email: "test@example.com" } },
        error: null,
      });
      mockSingle.mockResolvedValue({ data: mockProfile, error: null });

      const result = await getProfile();

      expect(mockFrom).toHaveBeenCalledWith("profiles");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("id", "user-123");
      expect(result).toEqual({ ...mockProfile, email: "test@example.com" });
    });

    it("should return null when not authenticated", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

      const result = await getProfile();

      expect(result).toBeNull();
    });

    it("should return null on database error", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });
      mockSingle.mockResolvedValue({
        data: null,
        error: { message: "DB Error" },
      });

      const result = await getProfile();

      expect(result).toBeNull();
    });

    it("should return email object when profile is not found (PGRST116)", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123", email: "new@example.com" } },
        error: null,
      });
      mockSingle.mockResolvedValue({
        data: null,
        error: { code: "PGRST116", message: "Row not found" },
      });

      const result = await getProfile();

      expect(result).toEqual({ email: "new@example.com" });
    });
  });

  describe("getPublicProfile", () => {
    it("should return the first profile found", async () => {
      const mockProfile = {
        id: "user-123",
        name: "Public User",
      };

      mockSingle.mockResolvedValue({ data: mockProfile, error: null });
      // The limit mock is handled in beforeEach

      const { getPublicProfile } = await import("./profile");
      const result = await getPublicProfile();

      expect(mockFrom).toHaveBeenCalledWith("profiles");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(result).toEqual(mockProfile);
    });

    it("should return null on error", async () => {
      mockSingle.mockResolvedValue({ data: null, error: { message: "Error" } });

      const { getPublicProfile } = await import("./profile");
      const result = await getPublicProfile();

      expect(result).toBeNull();
    });
  });

  describe("updateProfile", () => {
    it("should update profile successfully and seed bot config if missing", async () => {
      const updateData = {
        name: "Test User",
        profession: "Senior Developer",
        experience: 10,
      };

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });
      mockSingle.mockResolvedValue({
        data: { ...updateData, id: "user-123" },
        error: null,
      });

      // Mock bot config check: returns null (not found) to trigger seeding
      mockGetBotConfig.mockResolvedValue(null);
      mockUpdateBotConfig.mockResolvedValue({ success: true });

      const result = await updateProfile(updateData);

      expect(mockFrom).toHaveBeenCalledWith("profiles");
      // mockUpsert called
      expect(mockUpsert).toHaveBeenCalled();

      // Verify bot config check and seed
      expect(mockGetBotConfig).toHaveBeenCalledWith("public_agent");
      expect(mockUpdateBotConfig).toHaveBeenCalledWith(
        "public_agent",
        expect.objectContaining({
          model: "google/gemini-2.0-flash-001",
          system_prompt: expect.stringContaining("Test User"),
        }),
      );

      expect(result).toEqual({ success: true });
    });

    it("should update profile and skip seeding if bot config exists", async () => {
      const updateData = { profession: "Dev" };

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });
      mockSingle.mockResolvedValue({
        data: { ...updateData, id: "user-123" },
        error: null,
      });

      // Mock bot config check: returns object (found)
      mockGetBotConfig.mockResolvedValue({ id: "config-1" });

      await updateProfile(updateData);

      expect(mockGetBotConfig).toHaveBeenCalledWith("public_agent");
      expect(mockUpdateBotConfig).not.toHaveBeenCalled();
    });

    it("should throw error when not authenticated", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

      await expect(updateProfile({})).rejects.toThrow("Unauthorized");
    });

    it("should throw error on database failure", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });
      mockSingle.mockResolvedValue({
        data: null,
        error: { message: "Update failed" },
      });

      await expect(updateProfile({})).rejects.toThrow(
        "Failed to update profile",
      );
    });
  });
});
