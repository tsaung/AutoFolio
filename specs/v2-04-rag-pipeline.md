# V2 AI & RAG Pipeline

This document explains the AI Auto-Ingestion Pipeline (RAG) and the Chat Integration.

## 1. AI Auto-Ingestion Pipeline (RAG)

The visitor-facing AI assistant must always be up-to-date with the latest Sanity content. This is achieved through a **hybrid sync strategy**: webhook-driven real-time sync (primary) with on-the-fly staleness checks (fallback).

### 1.1 Primary: Webhook Sync

1. **Trigger:** Content is created/updated/deleted via the admin dashboard (which writes to Sanity).
2. **Webhook:** Sanity fires a GROQ-powered webhook to `/api/webhooks/sanity`.
3. **Processing:**
   - Validate the webhook signature (`SANITY_WEBHOOK_SECRET`).
   - Parse the Sanity document (including Portable Text via `@portabletext/to-plain-text`) into a plain, context-rich text string.
   - Generate vector embeddings via the embedding API (e.g., `gemini-embedding-001`).
4. **Storage:** Upsert the embedding + metadata into the `knowledge_chunks` table.
5. **Idempotency:** Use Sanity `_id` + `_rev` as the idempotency key.

### 1.2 Fallback: On-the-Fly Staleness Check

If a webhook fails silently, the AI could answer from stale embeddings. As a safety net:

1. When a visitor opens the chat, the frontend fetches the latest Sanity document `_rev` values (lightweight query).
2. Compare against the `source_rev` stored in `knowledge_chunks`.
3. If any are stale, trigger a background re-sync for those documents only.
4. The chat proceeds immediately with whatever embeddings are available.

### 1.3 Unified Embedding Schema

Extend the existing `knowledge_chunks` table with source-tracking columns:

- `source` (Text): `'manual'` | `'sanity_auto'`
- `source_id` (Text): Sanity document `_id` (for auto-ingested) or `knowledge_documents.id` (for manual)
- `source_rev` (Text, Nullable): Sanity document `_rev` (for idempotency, null for manual docs)

### 1.4 Portable Text Parsing

Use `@portabletext/to-plain-text` to serialize blocks into embeddable strings. Additionally:

- Extract and include image `alt` text and captions.
- Expand document references to include referenced document titles/summaries.
- Handle custom block types gracefully.

## 2. Chat Integration

- The visitor-facing chat interface queries the unified `knowledge_chunks` table for vector search.
- The AI system prompt (stored in `bot_configs` in Supabase) instructs the model to rely primarily on retrieved Sanity context.
- Social links and contact info are fetched from the `siteSettings` Sanity document.