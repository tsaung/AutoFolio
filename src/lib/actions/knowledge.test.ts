import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
} from "./knowledge";

// --- Mocks ---

const {
  mockFrom,
  mockSelect,
  mockInsert,
  mockUpdate,
  mockDelete,
  mockEq,
  mockOrder,
  mockSingle,
  mockGetUser,
} = vi.hoisted(() => {
  return {
    mockFrom: vi.fn(),
    mockSelect: vi.fn(),
    mockInsert: vi.fn(),
    mockUpdate: vi.fn(),
    mockDelete: vi.fn(),
    mockEq: vi.fn(),
    mockOrder: vi.fn(),
    mockSingle: vi.fn(),
    mockGetUser: vi.fn(),
  };
});

vi.mock("@/lib/db/server", () => ({
  createClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/server", () => ({
  after: vi.fn((cb: () => void) => cb()),
}));

vi.mock("@/lib/rag/pipeline", () => ({
  processDocument: vi.fn(),
}));

describe("Knowledge Server Actions", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Default chainable mock setup
    // The chain varies per action, so we set up a flexible chain:
    // from -> select/insert/update/delete -> eq -> eq -> order -> single
    // Each mock returns an object with the next possible methods.
    const chainable = {
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
      eq: mockEq,
      order: mockOrder,
      single: mockSingle,
    };

    mockFrom.mockReturnValue(chainable);
    mockSelect.mockReturnValue(chainable);
    mockInsert.mockReturnValue(chainable);
    mockUpdate.mockReturnValue(chainable);
    mockDelete.mockReturnValue(chainable);
    mockEq.mockReturnValue(chainable);
    mockOrder.mockReturnValue({ data: [], error: null }); // default for list queries
    mockSingle.mockReturnValue({ data: null, error: null });
  });

  // --- getDocuments ---
  describe("getDocuments", () => {
    it("should return documents for authenticated user", async () => {
      const mockDocs = [
        { id: "doc-1", title: "Doc 1", user_id: "user-123" },
        { id: "doc-2", title: "Doc 2", user_id: "user-123" },
      ];

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });
      mockOrder.mockReturnValue({ data: mockDocs, error: null });

      const result = await getDocuments();

      expect(mockFrom).toHaveBeenCalledWith("knowledge_documents");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(result).toEqual(mockDocs);
    });

    it("should return empty array when not authenticated", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

      const result = await getDocuments();

      expect(result).toEqual([]);
      expect(mockFrom).not.toHaveBeenCalled();
    });

    it("should return empty array on database error", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });
      mockOrder.mockReturnValue({ data: null, error: { message: "DB Error" } });

      const result = await getDocuments();

      expect(result).toEqual([]);
    });
  });

  // --- getDocument ---
  describe("getDocument", () => {
    it("should return a single document by ID", async () => {
      const mockDoc = { id: "doc-1", title: "Doc 1", user_id: "user-123" };

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });
      mockSingle.mockReturnValue({ data: mockDoc, error: null });

      const result = await getDocument("doc-1");

      expect(mockFrom).toHaveBeenCalledWith("knowledge_documents");
      expect(result).toEqual(mockDoc);
    });

    it("should return null when not authenticated", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

      const result = await getDocument("doc-1");

      expect(result).toBeNull();
    });

    it("should return null on error", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });
      mockSingle.mockReturnValue({
        data: null,
        error: { message: "Not found" },
      });

      const result = await getDocument("doc-1");

      expect(result).toBeNull();
    });
  });

  // --- createDocument ---
  describe("createDocument", () => {
    it("should create a document successfully", async () => {
      const input = { title: "New Doc", content: "Some content here..." };
      const created = {
        id: "doc-new",
        ...input,
        user_id: "user-123",
        type: "manual",
      };

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });
      mockSingle.mockReturnValue({ data: created, error: null });

      const result = await createDocument(input);

      expect(mockFrom).toHaveBeenCalledWith("knowledge_documents");
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: "user-123",
          title: input.title,
          content: input.content,
          type: "manual",
        }),
      );
      expect(result).toEqual(created);
    });

    it("should throw when not authenticated", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

      await expect(
        createDocument({ title: "X", content: "Y" }),
      ).rejects.toThrow("Unauthorized");
    });

    it("should throw on database error", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });
      mockSingle.mockReturnValue({
        data: null,
        error: { message: "Insert failed" },
      });

      await expect(
        createDocument({ title: "X", content: "Y" }),
      ).rejects.toThrow("Failed to create document");
    });
  });

  // --- updateDocument ---
  describe("updateDocument", () => {
    it("should update a document successfully", async () => {
      const updated = {
        id: "doc-1",
        title: "Updated",
        content: "Updated content",
        user_id: "user-123",
      };

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });
      mockSingle.mockReturnValue({ data: updated, error: null });

      const result = await updateDocument("doc-1", {
        title: "Updated",
        content: "Updated content",
      });

      expect(mockFrom).toHaveBeenCalledWith("knowledge_documents");
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Updated",
          content: "Updated content",
        }),
      );
      expect(result).toEqual(updated);
    });

    it("should throw when not authenticated", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

      await expect(
        updateDocument("doc-1", { title: "X", content: "Y" }),
      ).rejects.toThrow("Unauthorized");
    });

    it("should throw on database error", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });
      mockSingle.mockReturnValue({
        data: null,
        error: { message: "Update failed" },
      });

      await expect(
        updateDocument("doc-1", { title: "X", content: "Y" }),
      ).rejects.toThrow("Failed to update document");
    });
  });

  // --- deleteDocument ---
  describe("deleteDocument", () => {
    it("should delete a document successfully", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });
      // delete -> eq("id") -> eq("user_id") -> { error: null }
      mockEq
        .mockReturnValueOnce({ eq: mockEq }) // first .eq("id", id) returns chainable
        .mockReturnValueOnce({ error: null }); // second .eq("user_id", uid) returns result

      await expect(deleteDocument("doc-1")).resolves.toBeUndefined();
      expect(mockFrom).toHaveBeenCalledWith("knowledge_documents");
      expect(mockDelete).toHaveBeenCalled();
    });

    it("should throw when not authenticated", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

      await expect(deleteDocument("doc-1")).rejects.toThrow("Unauthorized");
    });

    it("should throw on database error", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });
      // delete -> eq("id") -> eq("user_id") -> { error }
      mockEq
        .mockReturnValueOnce({ eq: mockEq })
        .mockReturnValueOnce({ error: { message: "Delete failed" } });

      await expect(deleteDocument("doc-1")).rejects.toThrow(
        "Failed to delete document",
      );
    });
  });
});
