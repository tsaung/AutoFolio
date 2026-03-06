import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getNavigations,
  getNavigationById,
  getPages,
  createNavigation,
  updateNavigation,
  deleteNavigation,
} from "./navigation";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

// Mock dependencies
vi.mock("@/sanity/lib/client", () => ({
  client: {
    withConfig: vi.fn().mockReturnThis(),
    fetch: vi.fn(),
  },
}));

vi.mock("@/sanity/lib/write-client", () => ({
  writeClient: {
    create: vi.fn(),
    patch: vi.fn(() => ({
      set: vi.fn().mockReturnThis(),
      commit: vi.fn(),
    })),
    delete: vi.fn(),
  },
}));

vi.mock("@/lib/db/server", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => ({ data: { user: { id: "test-user-id" } }, error: null })),
    },
  })),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

describe("Navigation Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch navigations successfully", async () => {
    const mockNavs = [{ _id: "1", name: "Main Menu" }];
    vi.mocked(client.fetch).mockResolvedValueOnce(mockNavs);

    const result = await getNavigations();

    expect(result).toEqual(mockNavs);
    expect(client.fetch).toHaveBeenCalledWith(
      `*[_type == "navigation"] | order(_createdAt desc)`,
      {},
      expect.any(Object)
    );
  });

  it("should create a navigation", async () => {
    const mockData = { name: "Footer", items: [] };
    const mockResponse = { _id: "new-id", ...mockData };
    vi.mocked(writeClient.create).mockResolvedValueOnce(mockResponse as any);

    const result = await createNavigation(mockData);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockResponse);
    expect(writeClient.create).toHaveBeenCalledWith({
      _type: "navigation",
      name: mockData.name,
      items: [],
      createdBy: "test-user-id",
      updatedBy: "test-user-id",
    });
  });

  it("should fetch available pages", async () => {
    const mockPages = [{ _id: "page-1", title: "Home" }];
    vi.mocked(client.fetch).mockResolvedValueOnce(mockPages);

    const result = await getPages();

    expect(result).toEqual(mockPages);
    expect(client.fetch).toHaveBeenCalledWith(
      `*[_type == "page"] { _id, _type, title, slug } | order(title asc)`,
      {},
      expect.any(Object)
    );
  });
});
