# Admin UI Specifications

## 1. Sidebar

- **Collapsible**: The sidebar should be collapsible to maximize screen real estate.
- **State**: The collapsed state should be persisted (e.g., in localStorage) so the user preference is remembered.
- **Responsiveness**: The sidebar is hidden on mobile and shown on desktop (lg breakpoint). On mobile, it should be accessible via a hamburger menu (already implemented in header?).
- **Navigation Items**: Dashboard, Knowledge Base, Settings.
  - **Phase 2:** "Improve with AI" will be added back. The page (`/improve`) is scaffolded but hidden from navigation.

## 2. Settings Page

- **Structure**: A settings layout (`/admin/settings/layout.tsx`) containing a secondary sidebar for navigation.
- **Routes**:
  - `/admin/settings/profile`: User profile (Name, Profession, YOE, Field) & Welcome Message.
  - `/admin/settings/bot`: Bot Configuration (Model, Persona, Prompts).
- **Sidebar**:
  - Should be responsive (collapsible or hidden on mobile).
  - Links to the above routes.
- **UI**:
  - Use "Card" components for settings forms.
  - Ensure consistent layout with the main admin dashboard.

### Bot Configuration (`/settings/bot`)

- **Model Selection**:
  - Models are fetched dynamically from the OpenRouter API via `GET /api/models`.
  - The API route serves as a server-side proxy, filtering to text-capable chat models and caching results for 60 seconds.
  - The dropdown uses a **searchable Combobox** (Popover + Command) since OpenRouter exposes hundreds of models.
  - Each model displays its name, ID, and context length.
  - If the API fetch fails, 3 fallback models are shown (Gemini 2.0 Flash, GPT-4o Mini, Claude 3 Haiku).
- **Provider**: Currently locked to OpenRouter (disabled dropdown).
- **System Prompt**: Supports `{name}`, `{profession}`, `{experience}`, `{field}` placeholders interpolated at runtime.
- **Predefined Prompts**: Up to 4 quick-reply suggestions shown to visitors in the chat.

## 3. Knowledge Base Page (`/knowledge`)

- **Purpose**: CRUD interface for managing RAG knowledge documents.
- **Layout**: Table listing documents with Title, Type, Last Updated, and Actions columns.
- **Features**:
  - **Search**: Client-side filter by document title.
  - **Create** (`/knowledge/new`): Full-page form with Title (Input) and Content (large Textarea), Zod validation.
  - **Edit** (`/knowledge/[id]/edit`): Same form pre-filled with existing document data (server-fetched).
  - **Delete**: Confirmation dialog on list page, hard-deletes document and cascades to chunks.
- **Data Flow**: Server Component fetches documents → passes to client `KnowledgeList` component.
- **Status**: Implemented (Phase 1 — manual documents only).
