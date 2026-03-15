# Migration Status: V1 to V2

**Status:** In Progress 🚧

BotFolio is currently migrating from its original **V1 Architecture** (pure Supabase + custom CMS tables) to a **V2 Architecture** (Sanity Headless CMS + Supabase for Auth/RAG).

> [!IMPORTANT]
> **For AI Agents & Developers:** Do not confuse the architecture. The primary architecture and source of truth for new development is the **V2 architecture** which is split into 5 modular files (e.g., `v2-01-architecture.md`).

## Understanding the Specs Directory

To avoid confusion during this migration phase, the `specs/` directory is organized as follows:

- `00-migration-status.md` (This file): Explains the current state of the project.
- **The Single Source of Truth for V2 is split into 5 modular files:**
  - `v2-01-architecture.md`: High-level system design and env variables.
  - `v2-02-content-model.md`: Sanity schemas and the Block Library architecture.
  - `v2-03-page-builder.md`: Frontend rendering and Live Preview logic.
  - `v2-04-rag-pipeline.md`: AI auto-ingestion, Webhooks, and pgvector schema.
  - `v2-05-setup-and-admin.md`: Admin Dashboard, Supabase Auth, and Setup Wizard UX.
- `v1-deprecated/`: Contains the original V1 specification files (`01-system-overview.md` through `07-public-profile.md`).

## When to Reference `v1-deprecated/`

The V1 specs have been deprecated and moved to the `v1-deprecated/` directory. However, because we are still in a migration phase, these files are preserved for reference.

You should **only** consult the `v1-deprecated/` specs when working on:
1. **Legacy UI Components:** Modifying or debugging components that have not yet been fully migrated to the V2 Sanity Block Library (e.g., the `chat-interface`, layout structure).
2. **Feature Parity:** Ensuring a new V2 feature matches the intended behavior or design of the original V1 implementation (e.g., if a task asks to "enable/disable public chat," you may need to see how it was originally designed in V1).
3. **Migration Scripts:** Understanding the old Supabase schema (`projects`, `experiences`, `skills`, etc.) to write data migration or cleanup scripts (as outlined in Phase 10 of `todo.md`).

For all new features, components, or data modeling, strictly follow the V2 architecture.
