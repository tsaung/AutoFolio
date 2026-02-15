/**
 * RAG processing pipeline.
 *
 * Orchestrates: delete old chunks → split content → embed → store.
 * Called via `after()` in server actions for background processing.
 */

import { adminClient } from "@/lib/db/admin";
import { chunkText } from "./chunker";
import { embedChunks } from "./embedder";

/**
 * Process a document: chunk the content, generate embeddings, and store in knowledge_chunks.
 *
 * This function is idempotent — it deletes existing chunks before inserting new ones.
 */
export async function processDocument(
  documentId: string,
  userId: string,
  content: string,
): Promise<void> {
  try {
    // 1. Delete existing chunks for this document
    const { error: deleteError } = await adminClient
      .from("knowledge_chunks")
      .delete()
      .eq("document_id", documentId);

    if (deleteError) {
      console.error(
        `[RAG Pipeline] Failed to delete old chunks for document ${documentId}:`,
        deleteError,
      );
      return;
    }

    // 2. Chunk the content
    const chunks = chunkText(content);

    if (chunks.length === 0) {
      console.warn(
        `[RAG Pipeline] No chunks generated for document ${documentId}`,
      );
      return;
    }

    // 3. Generate embeddings
    const chunkTexts = chunks.map((c) => c.content);
    const embeddings = await embedChunks(chunkTexts);

    // 4. Insert chunks with embeddings
    const rows = chunks.map((chunk, i) => ({
      document_id: documentId,
      user_id: userId,
      content: chunk.content,
      embedding: JSON.stringify(embeddings[i]),
      chunk_index: chunk.chunkIndex,
      token_count: chunk.tokenCount,
      metadata: {},
    }));

    const { error: insertError } = await adminClient
      .from("knowledge_chunks")
      .insert(rows);

    if (insertError) {
      console.error(
        `[RAG Pipeline] Failed to insert chunks for document ${documentId}:`,
        insertError,
      );
      return;
    }

    console.log(
      `[RAG Pipeline] Processed document ${documentId}: ${chunks.length} chunks embedded and stored.`,
    );
  } catch (error) {
    console.error(
      `[RAG Pipeline] Unexpected error processing document ${documentId}:`,
      error,
    );
  }
}
