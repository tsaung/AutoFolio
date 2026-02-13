import { describe, it, expect, vi, beforeEach } from "vitest";
import { getProfile, updateProfile } from "./profile";

// Mock the server client creation
const mockSelect = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockFrom = vi.fn();
const mockGetUser = vi.fn();

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
      mockEq.mockResolvedValue({ error: null }); // success for update

      const result = await updateProfile(updateData);

      expect(mockFrom).toHaveBeenCalledWith("profiles");
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          profession: "Senior Developer",
          experience: "10 years",
          updated_at: expect.any(String), // We expect a timestamp
        }),
      );
      expect(mockEq).toHaveBeenCalledWith("id", "user-123");
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
      mockEq.mockResolvedValue({ error: { message: "Update failed" } });

      await expect(updateProfile({})).rejects.toThrow(
        "Failed to update profile",
      );
    });
  });
});
