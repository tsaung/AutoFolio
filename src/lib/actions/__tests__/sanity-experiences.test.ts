import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperiences,
  getPublicExperiences,
} from "../sanity-experiences";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import { EXPERIENCES_QUERY, EXPERIENCE_BY_ID_QUERY } from "@/sanity/lib/queries";

// --- Mocks ---

const {
  mockGetUser,
  mockFetch,
  mockCreate,
  mockPatch,
  mockSet,
  mockCommit,
  mockDelete,
  mockTransaction,
} = vi.hoisted(() => {
  return {
    mockGetUser: vi.fn(),
    mockFetch: vi.fn(),
    mockCreate: vi.fn(),
    mockPatch: vi.fn(),
    mockSet: vi.fn(),
    mockCommit: vi.fn(),
    mockDelete: vi.fn(),
    mockTransaction: vi.fn(),
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
    patch: mockPatch,
    delete: mockDelete,
    transaction: mockTransaction,
  },
}));

// Mock Next.js Cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Sanity Experiences Server Actions", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    const patchChain = {
      set: mockSet,
      commit: mockCommit,
    };
    mockPatch.mockReturnValue(patchChain);
    mockSet.mockReturnValue(patchChain);
    mockCommit.mockResolvedValue({ _id: "patched" });

    const txChain = {
      patch: vi.fn(),
      commit: vi.fn(),
    };
    mockTransaction.mockReturnValue(txChain);
  });

  // --- getExperiences ---
  describe("getExperiences", () => {
    it("should return experiences for authenticated user", async () => {
      const mockData = [{ _id: "1", title: "Exp 1" }];

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockFetch.mockResolvedValue(mockData);

      const result = await getExperiences();

      expect(mockGetUser).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledWith(EXPERIENCES_QUERY, {}, { cache: "no-store" });
      expect(result).toEqual(mockData);
    });

    it("should return empty array if unauthorized", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: new Error("Auth failed"),
      });

      const result = await getExperiences();

      expect(result).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  // --- getExperience ---
  describe("getExperience", () => {
    it("should return a single experience for authenticated user", async () => {
      const mockData = { _id: "1", title: "Exp 1" };

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockFetch.mockResolvedValue(mockData);

      const result = await getExperience("1");

      expect(mockFetch).toHaveBeenCalledWith(EXPERIENCE_BY_ID_QUERY, { id: "1" }, { cache: "no-store" });
      expect(result).toEqual(mockData);
    });
  });

  // --- createExperience ---
  describe("createExperience", () => {
    it("should create an experience with createdBy and updatedBy", async () => {
      const input = { title: "New Exp", company: "Corp", startDate: "2023-01-01", sortOrder: 0 };
      const created = { ...input, _id: "new-id", _type: "experience" };

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockCreate.mockResolvedValue(created);

      const result = await createExperience(input);

      expect(mockCreate).toHaveBeenCalledWith({
        _type: "experience",
        ...input,
        createdBy: "user-1",
        updatedBy: "user-1",
      });
      expect(result).toEqual(created);
    });
  });

  // --- updateExperience ---
  describe("updateExperience", () => {
    it("should update an experience with updatedBy", async () => {
      const input = { title: "Updated Exp" };

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });

      const result = await updateExperience("1", input);

      expect(mockPatch).toHaveBeenCalledWith("1");
      expect(mockSet).toHaveBeenCalledWith({
        ...input,
        updatedBy: "user-1",
      });
      expect(mockCommit).toHaveBeenCalled();
      expect(result).toEqual({ _id: "patched" });
    });
  });

  // --- deleteExperience ---
  describe("deleteExperience", () => {
    it("should delete an experience", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });

      await deleteExperience("1");

      expect(mockDelete).toHaveBeenCalledWith("1");
    });
  });

  // --- reorderExperiences ---
  describe("reorderExperiences", () => {
    it("should run a transaction to update sortOrders", async () => {
      const items = [
        { id: "1", sortOrder: 1 },
        { id: "2", sortOrder: 2 },
      ];

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      
      const mockTxCommit = vi.fn();
      const mockTxPatch = vi.fn();
      mockTransaction.mockReturnValue({
        patch: mockTxPatch,
        commit: mockTxCommit,
      });

      await reorderExperiences(items);

      expect(mockTransaction).toHaveBeenCalled();
      expect(mockTxPatch).toHaveBeenCalledTimes(2);
      expect(mockTxCommit).toHaveBeenCalled();
    });
  });

  // --- getPublicExperiences ---
  describe("getPublicExperiences", () => {
    it("should fetch without auth", async () => {
      const mockData = [{ _id: "1", title: "Public Exp" }];

      mockFetch.mockResolvedValue(mockData);

      const result = await getPublicExperiences();

      expect(mockGetUser).not.toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledWith(EXPERIENCES_QUERY);
      expect(result).toEqual(mockData);
    });
  });
});
