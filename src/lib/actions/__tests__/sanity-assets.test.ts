import { describe, it, expect, vi, beforeEach } from "vitest";
import { uploadImage } from "../sanity-assets";
import { writeClient } from "@/sanity/lib/write-client";

// --- Mocks ---

const {
  mockGetUser,
  mockAssetsUpload,
} = vi.hoisted(() => {
  return {
    mockGetUser: vi.fn(),
    mockAssetsUpload: vi.fn(),
  };
});

// Mock Supabase Server Client
vi.mock("@/lib/db/server", () => ({
  createClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
  })),
}));

// Mock Sanity Client
vi.mock("@/sanity/lib/write-client", () => ({
  writeClient: {
    assets: {
      upload: mockAssetsUpload,
    },
  },
}));

describe("Sanity Assets Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("uploadImage", () => {
    it("should throw an error if user is unauthenticated", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: new Error("Unauthorized"),
      });

      const formData = new FormData();
      formData.append("file", new Blob(["dummy"]), "test.jpg");

      await expect(uploadImage(formData)).rejects.toThrow("Unauthorized");
    });

    it("should throw an error if no file is provided", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });

      const formData = new FormData();

      await expect(uploadImage(formData)).rejects.toThrow("No file provided");
    });

    it("should upload the file to Sanity successfully", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });

      mockAssetsUpload.mockResolvedValue({
        _id: "image-123",
        url: "https://cdn.sanity.io/images/...",
      });

      const file = new File(["dummy content"], "test.png", { type: "image/png" });
      file.arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(8));
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadImage(formData);

      expect(mockAssetsUpload).toHaveBeenCalledWith("image", expect.any(Buffer), {
        filename: "test.png",
      });
      expect(result).toEqual({
        success: true,
        assetId: "image-123",
        url: "https://cdn.sanity.io/images/...",
      });
    });
  });
});
