---
description: Instructions and architectural rules for the RAG Pipeline setup.
---

# RAG Pipeline

BotFolio utilizes a Retrieval Augmented Generation pipeline for its AI features.

- **Location:** `src/lib/rag/` — chunker, embedder, pipeline, portfolio-sync modules.
- **AI Integration:** Vercel AI SDK (`ai`) with OpenRouter.
- **Embedding Model:** `gemini-embedding-001` via `@ai-sdk/google` (`embedMany` from Vercel AI SDK). 1536 dimensions.
- **API Key:** `GOOGLE_GENERATIVE_AI_API_KEY` (separate from OpenRouter).
- **Chunking:** Recursive text splitting (~500 tokens/chunk, ~50 token overlap).
- **Background Processing:** Uses Next.js `after()` in server actions — response returns immediately, chunking + embedding runs in background.
- **Storage:** `knowledge_chunks` table via `adminClient` (service role, bypasses RLS).
- **Task Types:** `RETRIEVAL_DOCUMENT` for storing chunks, `RETRIEVAL_QUERY` for searching.
