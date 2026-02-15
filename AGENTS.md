# BotFolio - Collaborative Seniors

> **Status:** Active Development
> **Last Updated:** 2026-02-13

## 1. The Collaborative Seniors Model

This repository is built by a team of **autonomous Senior Developers** (both Human, Cloud Agents, and Local Agents).

- **Equality:** All agents (Jules, Copilot, etc.) are treated as Senior Engineers. You have the authority to make architectural decisions, refactor code, and improve the implementation.
- **Responsibility:** With authority comes responsibility. You must document your decisions in `specs/`.

## 2. The Universal Law: "Specs & Tests are Truth"

- **Documentation Entry Point:** The `specs/` directory is the **Living Documentation** for this project. It is the starting point for every task.
- **Single Source of Truth:** The `specs/` directory is the ONLY source of truth for feature specifications.
- **Test-Driven Development (TDD):**
  - **Logic:** Write a failing test BEFORE writing implementation code. Use `npx vitest run` to run tests.
  - **UI/E2E:** For complex UI interactions, use **Playwright**. If strict TDD is too heavy, ensure you have a verification script or clear manual test steps.
- **Synchronization:** The Code, the Tests, and the Specs MUST NEVER diverge.
  - If you change the code, you **MUST** update the `specs/` and the tests.

## 3. Workflow Protocol

1.  **Check Context:**
    - Read `todo.md` (Root) to identify the task.
    - **CRITICAL:** Read `specs/` to understand the existing system behavior before changing anything.
2.  **Update Spec:**
    - If the task introduces a new feature or changes behavior, update the relevant markdown file in `specs/` _first_.
    - This serves as your "Plan" and ensures documentation never rots.
3.  **Execute (TDD):**
    - **Red:** Write a failing test (Unit/Integration) that defines the expected behavior.
    - **Green:** Write the code to pass the test.
    - **Refactor:** Clean up the code and tests.
4.  **Finish:**
    - Mark the item in `todo.md` as checked `[x]`.
    - Verify that `specs/` accurately describes the final implementation.

## 4. Git Strategy

To maintain a clean and conflict-free history:

1.  **Manual Merging:** Do not run automated sync scripts. Merging `development` into your branch is a manual task performed by the Human Lead if necessary.
2.  **Merge Strategy:** If you must merge, use `git merge` (not rebase) to incorporate changes.
    - Focus on your specific task. Let the Human Lead handle complex integrations.

## 5. UI Components

- `src/components/ui/` is **reserved for Shadcn primitives only** (installed via `npx shadcn@latest add`).
- Custom reusable components go in `src/components/` (e.g., `src/components/searchable-select.tsx`).

## 5. Interaction Style

- **Be Concise:** Don't explain basic concepts unless asked.
- **Be Proactive:** If you spot a bug or a potential improvement, fix it (and update the spec).
- **Assume Competence:** The previous agent had a reason for their code. Read the spec to understand _why_ before deleting it.

## 6. Database and Types

- **Type Generation:** Run `npx supabase gen types typescript --local > src/types/database.ts` after any migration to keep TypeScript definitions in sync with the database schema.

## 7. RAG Pipeline

- **Location:** `src/lib/rag/` — chunker, embedder, and pipeline modules.
- **Embedding Model:** `gemini-embedding-001` via `@ai-sdk/google` (`embedMany` from Vercel AI SDK). 1536 dimensions.
- **API Key:** `GOOGLE_GENERATIVE_AI_API_KEY` (separate from OpenRouter).
- **Chunking:** Recursive text splitting (~500 tokens/chunk, ~50 token overlap).
- **Background Processing:** Uses Next.js `after()` in server actions — response returns immediately, chunking + embedding runs in background.
- **Storage:** `knowledge_chunks` table via `adminClient` (service role, bypasses RLS).
- **Task Types:** `RETRIEVAL_DOCUMENT` for storing chunks, `RETRIEVAL_QUERY` for searching.

## 8. Temporary Files

- **Scratchpad:** If you need to create temporary files (logs, data validation scripts, scratchpad code), **ALWAYS** use the `.ai/temp/` directory.
- **Git Hygiene:** Do NOT commit files in `.ai/temp/` or any `*.tmp` files.
