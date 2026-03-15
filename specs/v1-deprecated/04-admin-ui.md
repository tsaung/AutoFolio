# Admin UI Specifications

## 1. Sidebar

- **Collapsible**: The sidebar should be collapsible to maximize screen real estate.
- **State**: The collapsed state should be persisted (e.g., in localStorage) so the user preference is remembered.
- **Responsiveness**: The sidebar is hidden on mobile and shown on desktop (lg breakpoint). On mobile, it should be accessible via a hamburger menu (already implemented in header?).
- **Navigation Items**: Dashboard, Knowledge Base, Settings.
  - Portfolio items (Projects, Experiences, Skills, Social Links) are accessed from the Dashboard, not from the sidebar.
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

## 4. Portfolio Management

- **Purpose**: Manage portfolio content (Projects, Experiences, Skills, Social Links).
- **Access**: Via the consolidated Dashboard, which shows:
  - **Projects**: Count, Link to list, "Add Project" button (links to `/projects/new`).
  - **Experiences**: Count, Link to list, "Add Experience" button (links to `/experiences/new`).
  - **Skills**: Count, Link to list, "Quick Add" dialog.
  - **Social Links**: Count, Link to list, "Quick Add" dialog.
  - **Knowledge Base**: Count of documents/fragments, "Add Document" button (links to `/knowledge/new`).
- **Structure** (routes under `/(admin)`):
  - `/dashboard`: Overview page with portfolio item counts, quick-add dialogs/links for all items, and knowledge base stats.
  - `/projects`: CRUD + Reordering for Projects.
  - `/experiences`: CRUD + Reordering for Experiences.
  - `/skills`: CRUD + Reordering for Skills.
  - `/social-links`: CRUD + Reordering for Social Links.

### 4.1 Projects (`/projects`)

- **List View**:
  - Columns: Title, Technologies (tags), Status (Badge), Actions.
  - **Reordering**: Drag-and-drop or Up/Down buttons to update `sort_order`.
  - **Status Badge**: Published (Green), Draft (Yellow), Archived (Gray).
- **Create/Edit Form**:
  - Fields: Title, Slug, Tagline (short), Description (Rich Text/Markdown), Technologies (Array/Tag Input), Demo URL, Repo URL, Image URL.
  - Status: Dropdown/Radio (published, draft, archived).
  - Feature: "Featured Project" toggle (boolean).

### 4.2 Experiences (`/experiences`)

- **List View**:
  - Columns: Company, Role, Date Range, Actions.
  - Reordering supported.
- **Create/Edit Form**:
  - Fields: Company, Position, Location, Start Date, End Date (Current/Present checkbox), Description.
  - Logic: If "Current" is checked, `end_date` is null.

### 4.3 Skills (`/skills`)

- **List View**:
  - Columns: Name, Category, Proficiency, Actions.
  - Reordering supported.
- **Create/Edit Form**:
  - Fields: Name, Category (Frontend, Backend, etc.), Proficiency (1-5 or 0-100), Icon (optional).
  - Proficiency UI: Visual slider or star rating.

### 4.4 Social Links (`/social-links`)

- **List View**:
  - Columns: Platform, URL, Actions.
  - Reordering supported.
- **Create/Edit Form**:
  - Fields: Platform (GitHub, LinkedIn, etc.), URL, Icon (Lucide icon name string).
