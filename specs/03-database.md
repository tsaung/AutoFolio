# Database Schema

## Tables

### `profiles`

- **Purpose:** Stores user profile information and core identity context.
- **RLS:** Public read, Owner write.
- **Columns:**
  - `id` (UUID, PK, FK auth.users)
  - `name` (Text, NOT NULL)
  - `avatar_url` (Text)
  - `profession` (Text, NOT NULL)
  - `experience` (Integer, Default 0, NOT NULL)
  - `field` (Text, NOT NULL)
  - `welcome_message` (Text, NOT NULL)
  - `professional_summary` (Text, NOT NULL)
  - `updated_at` (Timestamp)

### `bot_configs`

- **Purpose:** Stores configuration for different AI agents (e.g., Public Chat, Admin Tools).
- **RLS:**
  - Owner: View/Update own configs.
  - Public: View `public_agent` config only.
- **Columns:**
  - `id` (UUID, PK)
  - `user_id` (UUID, FK profiles.id)
  - `type` (Text, Check: 'public_agent', 'admin_agent')
  - `provider` (Text, Default: 'openrouter')
  - `model` (Text, Default: 'google/gemini-2.0-flash-001')
  - `system_prompt` (Text, Nullable)
  - `predefined_prompts` (JSONB, Default: Enforced at code level) - Array of suggested questions.
  - `created_at` (Timestamp)
  - `updated_at` (Timestamp)
- **Constraints:** Unique(`user_id`, `type`).

### Automation

- **Removed**: Automatic profile creation trigger `on_auth_user_created` has been removed to enforce manual onboarding and data quality.
- **Lazy Initialization**: Bot configs are created automatically via Server Actions if they don't exist when a user updates their profile.

### `knowledge_documents`

- **Purpose:** Stores original user-provided content for the RAG knowledge base.
- **RLS:** Owner full CRUD. Public read of `'active'` documents only.
- **Columns:**
  - `id` (UUID, PK)
  - `user_id` (UUID, FK auth.users, ON DELETE CASCADE)
  - `title` (Text, NOT NULL)
  - `content` (Text, NOT NULL)
  - `type` (Text, NOT NULL, Check: `'manual'`, `'ai_generated'`)
  - `metadata` (JSONB)
  - `status` (Text, NOT NULL, Default `'active'`, Check: `'active'`, `'archived'`)
  - `created_at` (Timestamptz)
  - `updated_at` (Timestamptz)
- **Indexes:** B-tree on `user_id`.

### `knowledge_chunks`

- **Purpose:** Stores derived vector embeddings for similarity search (RAG retrieval).
- **Embedding Model:** `google/gemini-embedding-001` via Google AI Studio, 1536 dimensions.
- **Extension:** Requires `vector` (pgvector).
- **RLS:** Owner full CRUD. Public read (needed for visitor RAG queries).
- **Columns:**
  - `id` (UUID, PK)
  - `document_id` (UUID, FK knowledge_documents, ON DELETE CASCADE)
  - `user_id` (UUID, FK auth.users, denormalized for fast RLS + queries)
  - `content` (Text, NOT NULL)
  - `embedding` (vector(1536))
  - `chunk_index` (Integer, NOT NULL)
  - `token_count` (Integer)
  - `metadata` (JSONB)
  - `created_at` (Timestamptz)
- **Indexes:** HNSW on `embedding` (vector_cosine_ops), B-tree on `user_id`.

### Background Processing

- **Pattern:** Next.js `after()` in server actions schedules chunking + embedding after response is sent.
- **Flow:** `createDocument`/`updateDocument` → `after(() => processDocument(...))` → delete old chunks → chunk text → `embedMany()` via `@ai-sdk/google` → insert via `adminClient`.
- **Idempotent:** Old chunks are always deleted before new ones are inserted.

### RPC Functions

- **`match_knowledge_chunks(query_embedding, match_count, match_threshold)`**: pgvector cosine similarity search. Joins with `knowledge_documents` to only return chunks from `active` documents. Security definer (bypasses RLS for visitor queries). Returns `id`, `document_id`, `content`, `chunk_index`, `similarity`.

## Future Schema (Planned)

- **`messages`**: Stores chat history (optional/transient?).

## Access Patterns

- **Client Component:** Use `createClient` (Browser).
- **Server Component:** Use `createServerClient` (Cookies).
- **Admin/Background:** Use `adminClient` (Service Role) to bypass RLS.
