import { describe, it, expect, vi, beforeEach } from "vitest";

// --- Mocks ---

const mockDelete = vi.fn();
const mockInsert = vi.fn();
const mockEq = vi.fn();

vi.mock("@/lib/db/admin", () => ({
  adminClient: {
    from: vi.fn((table: string) => {
      if (table === "knowledge_chunks") {
        return {
          delete: mockDelete,
          insert: mockInsert,
        };
      }
      return {};
    }),
  },
}));

vi.mock("./embedder", () => ({
  embedChunks: vi.fn(async (texts: string[]) =>
    texts.map(() => Array(1536).fill(0.1)),
  ),
}));

import { processDocument } from "./pipeline";

describe("processDocument", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup chain: delete() -> eq("document_id", id) -> { error: null }
    mockDelete.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ error: null });

    // Insert returns success
    mockInsert.mockResolvedValue({ error: null });
  });

  it("should delete old chunks, embed new ones, and insert", async () => {
    const content = "This is a short document for testing.";

    await processDocument("doc-1", "user-1", content);

    // 1. Old chunks should be deleted
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("document_id", "doc-1");

    // 2. New chunks should be inserted
    expect(mockInsert).toHaveBeenCalled();
    const insertedRows = mockInsert.mock.calls[0][0];
    expect(insertedRows.length).toBeGreaterThan(0);
    expect(insertedRows[0]).toMatchObject({
      document_id: "doc-1",
      user_id: "user-1",
      chunk_index: 0,
    });
    // Embedding should be a JSON stringified array
    expect(insertedRows[0].embedding).toBeDefined();
  });

  it("should handle empty content gracefully", async () => {
    await processDocument("doc-1", "user-1", "");

    // Should still delete old chunks
    expect(mockDelete).toHaveBeenCalled();
    // But should NOT insert (no chunks generated)
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("should not throw on delete error", async () => {
    mockEq.mockReturnValue({ error: { message: "Delete failed" } });

    // Should not throw
    await expect(
      processDocument("doc-1", "user-1", "Some content"),
    ).resolves.toBeUndefined();
  });

  it("should not throw on insert error", async () => {
    mockInsert.mockResolvedValue({ error: { message: "Insert failed" } });

    await expect(
      processDocument("doc-1", "user-1", "Some content"),
    ).resolves.toBeUndefined();
  });

  it("should process multi-paragraph content into multiple chunks", async () => {
    const paragraph =
      "This is a detailed paragraph about software engineering. ".repeat(50);
    const content = [paragraph, paragraph, paragraph].join("\n\n");

    await processDocument("doc-1", "user-1", content);

    const insertedRows = mockInsert.mock.calls[0][0];
    expect(insertedRows.length).toBeGreaterThan(1);

    // Chunk indices should be sequential
    for (let i = 0; i < insertedRows.length; i++) {
      expect(insertedRows[i].chunk_index).toBe(i);
    }
  });
});
