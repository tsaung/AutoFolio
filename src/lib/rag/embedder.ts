/**
 * Embedding module using Vercel AI SDK with Google Generative AI.
 *
 * Model: gemini-embedding-001, 1536 dimensions.
 * Uses GOOGLE_GENERATIVE_AI_API_KEY env var (auto-detected by @ai-sdk/google).
 */

import { google, type GoogleEmbeddingModelOptions } from "@ai-sdk/google";
import { embedMany } from "ai";

const EMBEDDING_MODEL = "gemini-embedding-001";
const OUTPUT_DIMENSIONALITY = 1536;

/**
 * Generate embeddings for multiple text chunks.
 *
 * Uses `RETRIEVAL_DOCUMENT` task type for storing document chunks.
 * For query-time embedding, use `embedQuery` instead.
 */
export async function embedChunks(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  const model = google.embedding(EMBEDDING_MODEL);

  const { embeddings } = await embedMany({
    model,
    values: texts,
    providerOptions: {
      google: {
        outputDimensionality: OUTPUT_DIMENSIONALITY,
        taskType: "RETRIEVAL_DOCUMENT",
      } satisfies GoogleEmbeddingModelOptions,
    },
  });

  return embeddings;
}

/**
 * Generate an embedding for a single query string.
 *
 * Uses `RETRIEVAL_QUERY` task type for better search quality.
 */
export async function embedQuery(text: string): Promise<number[]> {
  const model = google.embedding(EMBEDDING_MODEL);

  const { embeddings } = await embedMany({
    model,
    values: [text],
    providerOptions: {
      google: {
        outputDimensionality: OUTPUT_DIMENSIONALITY,
        taskType: "RETRIEVAL_QUERY",
      } satisfies GoogleEmbeddingModelOptions,
    },
  });

  return embeddings[0];
}
