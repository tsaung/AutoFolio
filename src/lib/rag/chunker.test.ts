import { describe, it, expect } from "vitest";
import { chunkText, estimateTokenCount } from "./chunker";

describe("estimateTokenCount", () => {
  it("should estimate ~1 token per 4 characters", () => {
    expect(estimateTokenCount("abcd")).toBe(1);
    expect(estimateTokenCount("12345678")).toBe(2);
    expect(estimateTokenCount("a")).toBe(1); // ceil(1/4) = 1
  });

  it("should return 0 for empty string", () => {
    expect(estimateTokenCount("")).toBe(0);
  });
});

describe("chunkText", () => {
  it("should return empty array for empty or whitespace input", () => {
    expect(chunkText("")).toEqual([]);
    expect(chunkText("   ")).toEqual([]);
    expect(chunkText("\n\n")).toEqual([]);
  });

  it("should return single chunk for short text", () => {
    const text = "Hello, I am a software engineer.";
    const chunks = chunkText(text);

    expect(chunks).toHaveLength(1);
    expect(chunks[0].content).toBe(text);
    expect(chunks[0].chunkIndex).toBe(0);
    expect(chunks[0].tokenCount).toBeGreaterThan(0);
  });

  it("should split long text into multiple chunks", () => {
    // Create text longer than default chunk size (2000 chars)
    const paragraph =
      "This is a test paragraph with enough words to take up space. ";
    const text = paragraph.repeat(100); // ~6100 chars

    const chunks = chunkText(text);

    expect(chunks.length).toBeGreaterThan(1);
    // Every chunk should have content
    for (const chunk of chunks) {
      expect(chunk.content.length).toBeGreaterThan(0);
      expect(chunk.tokenCount).toBeGreaterThan(0);
    }
  });

  it("should maintain chunk indices in order", () => {
    const text = "A ".repeat(1500); // ~3000 chars
    const chunks = chunkText(text);

    for (let i = 0; i < chunks.length; i++) {
      expect(chunks[i].chunkIndex).toBe(i);
    }
  });

  it("should respect custom chunk size", () => {
    const text = "Word ".repeat(200); // ~1000 chars
    const chunks = chunkText(text, { chunkSize: 100, chunkOverlap: 20 });

    expect(chunks.length).toBeGreaterThan(1);
    // First chunk should be around 100 chars (not exact due to word boundaries)
    expect(chunks[0].content.length).toBeLessThanOrEqual(150);
  });

  it("should split by paragraphs first", () => {
    const para1 = "A".repeat(500);
    const para2 = "B".repeat(500);
    const para3 = "C".repeat(500);
    const para4 = "D".repeat(500);
    const para5 = "E".repeat(500);
    const text = [para1, para2, para3, para4, para5].join("\n\n");

    const chunks = chunkText(text);

    // Should group paragraphs into chunks respecting the size limit
    expect(chunks.length).toBeGreaterThan(1);
  });

  it("should handle text with no natural separators", () => {
    const text = "A".repeat(5000); // No spaces, no newlines
    const chunks = chunkText(text);

    expect(chunks.length).toBeGreaterThan(1);
    // All content should be preserved (minus overlap duplication)
  });

  it("should include overlap between consecutive chunks", () => {
    const text = "word ".repeat(1000); // ~5000 chars
    const chunks = chunkText(text, { chunkSize: 500, chunkOverlap: 50 });

    // Check that later chunks have some content from the previous chunk
    if (chunks.length > 1) {
      const prevTail = chunks[0].content.slice(-50);
      expect(chunks[1].content.startsWith(prevTail)).toBe(true);
    }
  });
});
