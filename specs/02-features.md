# Features

## 1. Authentication

- **Method:** Email/Password via Supabase Auth.
- **Registration:** Invite-only for admins (no public signup for admins). **Planned (V3):** Public user signup to access frontend chat functionality, limiting chat volume.
- **Flows:** Login, Forgot Password, Update Password, Public Signup (Planned).
- **Roles & Permissions (Planned V3):**
  - **Superadmin:** Manually created in Supabase. Full access to content management, bot settings, and admin user management.
  - **Admin:** Invited by `superadmin`. Access to content management and bot settings.
  - **Public:** Self-registered visitors. Access limited to public chat UI.
- **Status:** Implemented (Basic Auth). V3 granular roles and public signup pending.

## 2. Admin Dashboard

- **Access:** Restricted to authenticated users (`/(admin)` routes).
- **Layout:**
  - Sidebar navigation (Dashboard, Knowledge Base, Settings). Portfolio items are accessed from the Dashboard.
  - Header with logout button.
  - Mobile-responsive.
- **Features:**
  - **Overview:** Consolidated dashboard with portfolio item counts (Projects, Experiences, Skills, Social Links), Knowledge Fragments, and Chats. Quick-add dialogs for Skills and Social Links.
  - **User Management (Planned V3):** Panel for `superadmin` to invite and manage other `admin` users.
  - **Knowledge Base:** CRUD for RAG documents (user-provided content). Create/Edit via full-page form, delete with confirmation. Phase 1: manual documents only.
    - **Auto-Processing:** On create/update, documents are automatically chunked and embedded in the background via Next.js `after()`.
    - **Status:** Implemented.
  - **Bot Settings (Public Agent):**
    - **Purpose:** Configure the public-facing portfolio assistant.
    - **Unified Form:** Single interface to manage:
      - **Model:** Provider (OpenRouter) and Model ID (e.g., Gemini 2.0 Flash).
      - **Persona:** System Prompt with variable injection support (`{name}`, `{profession}`, etc.).
      - **Suggestions:** Manage predefined prompts (quick replies) for visitors.
    - **Status:** Backend and UI implemented.
  - **Profile Settings:**
    - **Purpose:** Configure the bot's identity and core context.
    - **Fields:** Name, Profession, Experience (Years), Field/Industry, Welcome Message.
    - **Storage:** Stored in the `profiles` table (tied to the user account).
    - **Status:** Backend implemented, Frontend ready for testing.
  - **Portfolio Management:**
    - **Purpose:** Manage portfolio content (`projects`, `experiences`, `skills`, `social_links`).
    - **Actions:**
      - **Projects:** Title, Description, Image/Live/Repo URLs, Tags, Status (Published/Draft/Archived).
      - **Experiences:** Title, Company, Location, Start/End Date, Description.
      - **Skills:** Name, Category, Proficiency (1-5).
      - **Social Links:** Platform, URL.
    - **Features:** Reorder items via drag-and-drop (updates `sort_order`), CRUD operations.
    - **Routes:** Portfolio sub-routes are at the admin root level (`/projects`, `/experiences`, `/skills`, `/social-links`).
    - **Status:** Implemented.

## 3. Visitor Chat

- **Interface:** Full-screen chat UI.
- **Functionality:**
  - **Access Control (Planned V3):** Chat interface locked behind public user authentication to manage volume.
  - **Welcome Screen:** Display a welcoming message and suggested prompts (e.g., "Tell me about your experience", "Contact info").
  - **Chat Interaction:**
    - User types a message or clicks a prompt.
    - AI responds with streaming text.
    - Support for Markdown rendering (bold, italics, code blocks).
  - **Loading State:**
    - Send button is disabled while AI is "thinking" to prevent double-submission.
    - Input remains enabled for review/editing.
    - **Typing Indicator:** A 3-dot bounce animation appears when the bot is processing/streaming.
  - **Appearance:**
    - **Profile Picture:** Displays user's avatar. If not set, defaults to `avatar.jpg` from public folder (instead of generic Bot icon).
  - **Interaction:**
    - **Optimistic UI:** Input field clears immediately upon hitting sending, does not wait for server response.
  - **History:** Chat history persists within the session (no need for long-term persistence yet).
  - **Appearance:**
    - Search-box style input: Input and Send button housed within a single unified container.
    - Input field takes available space, button sits comfortably to the right.
- **Model:** Configurable via Admin Dashboard (stored in `bot_configs`).
  - **Default:** `google/gemini-2.0-flash-001` (if no config found).
  - **System Prompt:** Dynamic based on profile ("You are {name}'s Portfolio Assistant...").
- **Backend:**
  - Uses Vercel AI SDK (`streamText`) with OpenRouter.
  - Connects to the user-selected model.
  - **RAG Retrieval:** On each message, the user's query is embedded via `gemini-embedding-001` (`RETRIEVAL_QUERY` task type), then matched against `knowledge_chunks` using pgvector cosine similarity. Top-K results are injected into the system prompt.

## 4. UI/UX

    - **Theme Switcher:**
      - Support for Light, Dark, and System modes.
      - Persisted via `next-themes`.
      - Integrated into Public Chat (Header right) and Admin Header.
    - **Header:**
      - **Desktop:** Standard left-aligned title.
      - **Mobile:** Centered title for app-like feel.Theme switcher remains on the right.

## 5. Phase 2 — Planned Features (The "Brain")

> [!NOTE]
> The following features are **deferred to Phase 2**. The "Improve with AI" page (`/improve`) is scaffolded but hidden from the sidebar.

- **Improve with AI (Content Studio):** An interactive "Canvas" for generating high-quality RAG content.
  - **Concept:** Admin acts as Co-author, AI acts as Drafter/Editor.
  - **Workflow:** Admin pastes raw notes/docs -> AI analyzes and drafts structured content -> Admin reviews/edits in Preview Pane -> Save to Knowledge Base.
  - **UI:** Split-pane layout (Chat Interface + Live Preview).
  - **Model Selector:** Dropdown to switch models during the session.
- **AI-Generated Knowledge:** Documents derived from other sources (lower confidence, reviewable). Adds "AI Generated" tab and "Source" column to Knowledge Base.
- **RAG Pipeline:** ~~Vectorize documents (Markdown/Text) for retrieval.~~ → **Implemented** (automatic chunking + embedding via `gemini-embedding-001`).
- **Enrichment Agent:** An "Admin Agent" that helps the owner generate high-quality RAG documents.
- **Generative UI:** Dynamic widgets (`streamUI`) for project cards and contact forms.
