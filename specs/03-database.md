# Database Schema

## Tables

### `profiles`

- **Purpose:** Stores user profile information and bot personality context.
- **RLS:** Public read, Owner write.
- **Columns:**
  - `id` (UUID, PK, FK auth.users)
  - `full_name` (Text)
  - `avatar_url` (Text)
  - `profession` (Text)
  - `experience` (Integer)
  - `field` (Text)
  - `welcome_message` (Text)
  - `professional_summary` (Text)
  - `updated_at` (Timestamp)

### `system_settings`

- **Purpose:** Global configuration (Key-Value store).
- **RLS:** Private (Owner read/write).
- **Columns:** `key` (PK), `value` (JSONB).

## Future Schema (Planned)

- **`documents`**: Stores raw and enriched content (`content`, `type`, `created_at`).
- **`embeddings`**: Stores vector embeddings for RAG (`vector`, `content_chunk`).
- **`messages`**: Stores chat history (optional/transient?).

## Access Patterns

- **Client Component:** Use `createClient` (Browser).
- **Server Component:** Use `createServerClient` (Cookies).
- **Admin/Background:** Use `adminClient` (Service Role) to bypass RLS.
