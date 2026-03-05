import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSiteSettings, updateSiteSettings } from "../site-settings";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

// --- Mocks ---

const {
  mockGetUser,
  mockFetch,
  mockCreate,
  mockPatch,
  mockSet,
  mockCommit,
} = vi.hoisted(() => {
  return {
    mockGetUser: vi.fn(),
    mockFetch: vi.fn(),
    mockCreate: vi.fn(),
    mockPatch: vi.fn(),
    mockSet: vi.fn(),
    mockCommit: vi.fn(),
  };
});

// Mock Supabase Server Client
vi.mock("@/lib/db/server", () => ({
  createClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
  })),
}));

// Mock Sanity Clients
vi.mock("@/sanity/lib/client", () => ({
  client: {
    fetch: mockFetch,
    withConfig: vi.fn(() => ({ fetch: mockFetch })),
  },
}));

vi.mock("@/sanity/lib/write-client", () => ({
  writeClient: {
    create: mockCreate,
    createIfNotExists: mockCreate,
    patch: mockPatch,
  },
}));

// Mock Next.js Cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Site Settings Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const patchChain = {
      set: mockSet,
      commit: mockCommit,
    };
    mockPatch.mockReturnValue(patchChain);
    mockSet.mockReturnValue(patchChain);
    mockCommit.mockResolvedValue({ _id: "siteSettings" });
  });

  describe("getSiteSettings", () => {
    it("should fetch site settings from Sanity", async () => {
      const mockData = { siteName: "My Site", brandColors: { primary: "#000000" } };
      mockFetch.mockResolvedValue(mockData);

      const result = await getSiteSettings();

      expect(mockFetch).toHaveBeenCalledWith(SITE_SETTINGS_QUERY, {}, { cache: "no-store", perspective: "published" });
      expect(result).toEqual(mockData);
    });
  });

  describe("updateSiteSettings", () => {
    it("should throw an error if user is unauthenticated", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: new Error("Unauthorized"),
      });

      await expect(updateSiteSettings({ siteName: "Hacked Site" })).rejects.toThrow();
    });

    it("should upsert site settings using patch if it exists or create if missing", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });

      const input = {
        siteName: "Updated Site Name",
        brandColors: { primary: "#ff0000", secondary: "#00ff00", accent: "#0000ff" },
      };

      const result = await updateSiteSettings(input);

      // It should create the document with a predefined ID if it doesn't exist,
      // or set fields. Given Sanity API, creating with _id forces replace/upsert.
      // Wait, createIfNotExists is a method, or createOrReplace.
      // Let's assert mockCreate was called with createIfNotExists or createOrReplace.
      // E.g., mockCreate.mockResolvedValue({...})
      // But a common Sanity pattern is writeClient.createOrReplace({ _id: "siteSettings", ... })
      // Or writeClient.patch("siteSettings").set({...}).commit()
      // Let's expect the patch method as it's more idiomatic for partial updates.
      // However, for singletons, if it's never created, patch fails. Let's createIfNotExists first.
      
      // Let's test the signature we expect in updateSiteSettings:
      // await writeClient.createIfNotExists({ _id: 'siteSettings', _type: 'siteSettings' })
      // await writeClient.patch('siteSettings').set(input).commit()

      expect(mockCreate).toHaveBeenCalledWith(
        { _id: "siteSettings", _type: "siteSettings" },
        { returnDocuments: false }
      );
      expect(mockPatch).toHaveBeenCalledWith("siteSettings");
      expect(mockSet).toHaveBeenCalledWith(input);
      expect(mockCommit).toHaveBeenCalled();

      expect(result).toEqual({ success: true, settings: { _id: "siteSettings" } });
    });
  });
});
