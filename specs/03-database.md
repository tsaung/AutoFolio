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
  - `predefined_prompts` (JSONB, Nullable) - Array of suggested questions.
  - `created_at` (Timestamp)
  - `updated_at` (Timestamp)
- **Constraints:** Unique(`user_id`, `type`).

### Automation

- **Removed**: Automatic profile creation trigger `on_auth_user_created` has been removed to enforce manual onboarding and data quality.
- **Lazy Initialization**: Bot configs are created automatically via Server Actions if they don't exist when a user updates their profile.

## Future Schema (Planned)

- **`documents`**: Stores raw and enriched content (`content`, `type`, `created_at`).
- **`embeddings`**: Stores vector embeddings for RAG (`vector`, `content_chunk`).
- **`messages`**: Stores chat history (optional/transient?).

## Access Patterns

- **Client Component:** Use `createClient` (Browser).
- **Server Component:** Use `createServerClient` (Cookies).
- **Admin/Background:** Use `adminClient` (Service Role) to bypass RLS.
