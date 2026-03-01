---
description: Database and typing rules.
---

# Database Guidelines

BotFolio uses Supabase (PostgreSQL + pgvector).

- **Type Generation:** Run `npx supabase gen types typescript --local > src/types/database.ts` after any migration to keep TypeScript definitions in sync with the database schema.
- **Migrations:** Single consolidated V1 schema resides in `supabase/migrations/00000000000000_v1_schema.sql`.
