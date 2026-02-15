/**
 * Recursive text splitter for RAG chunking.
 *
 * Splits text into chunks of ~500 tokens (~2000 chars) with ~50 token overlap (~200 chars).
 * Split hierarchy: paragraphs → newlines → sentences → words.
 */

export interface Chunk {
  content: string;
  chunkIndex: number;
  tokenCount: number;
}

const DEFAULT_CHUNK_SIZE = 2000; // ~500 tokens (4 chars/token estimate)
const DEFAULT_CHUNK_OVERLAP = 200; // ~50 tokens

const SEPARATORS = ["\n\n", "\n", ". ", " "];

/**
 * Estimate token count from text length (~4 chars per token).
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Split text into chunks using recursive character splitting.
 */
export function chunkText(
  text: string,
  options?: {
    chunkSize?: number;
    chunkOverlap?: number;
  },
): Chunk[] {
  const chunkSize = options?.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const chunkOverlap = options?.chunkOverlap ?? DEFAULT_CHUNK_OVERLAP;

  const trimmed = text.trim();
  if (!trimmed) {
    return [];
  }

  // If the text fits in one chunk, return it directly
  if (trimmed.length <= chunkSize) {
    return [
      {
        content: trimmed,
        chunkIndex: 0,
        tokenCount: estimateTokenCount(trimmed),
      },
    ];
  }

  const rawChunks = recursiveSplit(
    trimmed,
    chunkSize,
    chunkOverlap,
    SEPARATORS,
  );

  return rawChunks.map((content, index) => ({
    content,
    chunkIndex: index,
    tokenCount: estimateTokenCount(content),
  }));
}

/**
 * Recursively split text by trying separators in order.
 */
function recursiveSplit(
  text: string,
  chunkSize: number,
  chunkOverlap: number,
  separators: string[],
): string[] {
  if (text.length <= chunkSize) {
    return [text];
  }

  // Find the best separator (first one that produces splits)
  let bestSeparator = "";
  for (const sep of separators) {
    if (text.includes(sep)) {
      bestSeparator = sep;
      break;
    }
  }

  // If no separator found, force split at chunkSize
  if (!bestSeparator) {
    return forceSplit(text, chunkSize, chunkOverlap);
  }

  const parts = text.split(bestSeparator);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const part of parts) {
    const candidate = currentChunk ? currentChunk + bestSeparator + part : part;

    if (candidate.length <= chunkSize) {
      currentChunk = candidate;
    } else {
      // Push current chunk if it has content
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }

      // If the individual part is too large, recurse with next separator
      if (part.length > chunkSize) {
        const remainingSeparators = separators.slice(
          separators.indexOf(bestSeparator) + 1,
        );
        const subChunks = recursiveSplit(
          part,
          chunkSize,
          chunkOverlap,
          remainingSeparators.length > 0 ? remainingSeparators : [],
        );
        chunks.push(...subChunks);
        currentChunk = "";
      } else {
        currentChunk = part;
      }
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  // Apply overlap
  return applyOverlap(chunks, chunkOverlap);
}

/**
 * Force split when no separators work.
 */
function forceSplit(
  text: string,
  chunkSize: number,
  chunkOverlap: number,
): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - chunkOverlap;
  }

  return chunks;
}

/**
 * Add overlap between consecutive chunks by prepending the tail of the
 * previous chunk to the start of the next chunk.
 */
function applyOverlap(chunks: string[], overlapSize: number): string[] {
  if (chunks.length <= 1 || overlapSize <= 0) {
    return chunks;
  }

  const result: string[] = [chunks[0]];

  for (let i = 1; i < chunks.length; i++) {
    const prevChunk = chunks[i - 1];
    const overlapText = prevChunk.slice(-overlapSize);
    result.push(overlapText + chunks[i]);
  }

  return result;
}
