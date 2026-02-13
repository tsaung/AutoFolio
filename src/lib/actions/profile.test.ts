import { describe, it, expect, vi, beforeEach } from "vitest";
import { getProfile, updateProfile } from "./profile";

// Mock the server client creation
// Mock the server client creation
const {
  mockSelect,
  mockUpdate,
  mockUpsert,
  mockEq,
  mockSingle,
  mockFrom,
  mockGetUser,
} = vi.hoisted(() => {
  const mockGetUser = vi.fn();
  const mockSingle = vi.fn();
  const mockEq = vi.fn();
  const mockSelect = vi.fn();
  const mockUpdate = vi.fn();
  const mockUpsert = vi.fn();
  const mockFrom = vi.fn();
  return {
    mockSelect,
    mockUpdate,
    mockUpsert,
    mockEq,
    mockSingle,
    mockFrom,
    mockGetUser,
  };
});

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
    vi.clearAllMocks();

    // Setup chainable mocks
    mockFrom.mockReturnValue({
      select: mockSelect,
      update: mockUpdate,
      upsert: mockUpsert,
    });
    mockSelect.mockReturnValue({
      eq: mockEq,
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
      // mockFrom -> select -> limit -> single
      const mockLimit = vi.fn().mockReturnValue({ single: mockSingle });
      mockSelect.mockReturnValue({ limit: mockLimit });

      const { getPublicProfile } = await import("./profile");
      const result = await getPublicProfile();

      expect(mockFrom).toHaveBeenCalledWith("profiles");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockLimit).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProfile);
    });

    it("should return null on error", async () => {
      const mockLimit = vi.fn().mockReturnValue({ single: mockSingle });
      mockSelect.mockReturnValue({ limit: mockLimit });
      mockSingle.mockResolvedValue({ data: null, error: { message: "Error" } });

      const { getPublicProfile } = await import("./profile");
      const result = await getPublicProfile();

      expect(result).toBeNull();
    });
  });

  describe("updateProfile", () => {
    it("should update profile successfully", async () => {
      const updateData = {
        profession: "Senior Developer",
        experience: "10 years",
      };

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });
      mockSingle.mockResolvedValue({
        data: { ...updateData, id: "user-123" },
        error: null,
      }); // success for upsert return

      const result = await updateProfile(updateData);

      expect(mockFrom).toHaveBeenCalledWith("profiles");
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "user-123",
          profession: "Senior Developer",
          experience: "10 years",
          updated_at: expect.any(String),
        }),
      );
      expect(result).toEqual({ success: true });
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
      // Mock upsert failure
      // The chain is upsert -> select -> single. error comes from single() logic in the real client if select fails?
      // Actually, if upsert fails, it might throw or return error on the chain?
      // In Supabase js: .upsert().select().single() returns { data, error }
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
