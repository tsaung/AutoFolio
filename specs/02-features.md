# Features

## 1. Authentication

- **Method:** Email/Password via Supabase Auth.
- **Registration:** Invite-only (no public signup).
- **Flows:** Login, Forgot Password, Update Password.
- **Status:** Implemented.

## 2. Admin Dashboard

- **Access:** Restricted to authenticated users (`/(admin)` routes).
- **Layout:**
  - Sidebar navigation (Dashboard, Knowledge Base, Improve with AI, AI Settings).
  - Header with logout button.
  - Mobile-responsive.
- **Features:**
  - **Overview:** Dashboard with key metrics (Knowledge Fragments, Chats).
  - **Knowledge Base:** Manage RAG documents.
    - **User Content:** Manually created documents (high confidence).
    - **AI Generated:** Documents derived from other sources (lower confidence, reviewable).
  - **Improve with AI (Content Studio):** An interactive "Canvas" for generating high-quality RAG content.
    - **Concept:** Admin acts as Co-author, AI acts as Drafter/Editor.
    - **Workflow:** Admin pastes raw notes/docs -> AI analyzes and drafts structured content -> Admin reviews/edits in Preview Pane -> Save to Knowledge Base.
    - **UI:** Split-pane layout (Chat Interface + Live Preview).
    - **Model Selector:** Dropdown to switch models (e.g., GPT-4o for reasoning, Flash for speed) during the session.
  - **Model Settings:** Global configuration for the _public_ visitor chat.
  - **Profile Settings:**
    - **Purpose:** Configure the bot's identity and core context.
    - **Fields:** Name, Profession, Experience (Years), Field/Industry, Welcome Message.
    - **Storage:** Stored in the `profiles` table (tied to the user account).
    - **Status:** Backend implemented, Frontend ready for testing.

## 3. Visitor Chat

- **Interface:** Full-screen chat UI.
- **Functionality:**
  - **Welcome Screen:** Display a welcoming message and suggested prompts (e.g., "Tell me about your experience", "Contact info").
  - **Chat Interaction:**
    - User types a message or clicks a prompt.
    - AI responds with streaming text.
    - Support for Markdown rendering (bold, italics, code blocks).
  - **Loading State:**
    - Send button is disabled while AI is "thinking" to prevent double-submission.
    - Input remains enabled for review/editing.
    - **Typing Indicator:** A 3-dot bounce animation appears when the bot is processing/streaming.
  - **Interaction:**
    - **Optimistic UI:** Input field clears immediately upon hitting sending, does not wait for server response.
  - **History:** Chat history persists within the session (no need for long-term persistence yet).
  - **Appearance:**
    - Search-box style input: Input and Send button housed within a single unified container.
    - Input field takes available space, button sits comfortably to the right.
- **Model:** Configurable via Admin Dashboard (stored in `system_settings`).
  - **Default:** `google/gemini-3-flash-preview` (if no config found).
  - **System Prompt:** "You are Thant Sin's Portfolio Assistant. You are a helpful assistant that answers questions about Thant Sin's work and experience."
- **Backend:**
  - Uses Vercel AI SDK (`streamText`) with OpenRouter.
  - Connects to `google/gemini-3-flash-preview` by default.

## 4. UI/UX

- **Theme Switcher:**
  - Support for Light, Dark, and System modes.
  - Persisted via `next-themes`.
  - Integrated into Public Chat and Admin Header.

## 5. Planned Features (The "Brain")

- **RAG Pipeline:** Vectorize documents (Markdown/Text) for retrieval.
- **Enrichment Agent:** An "Admin Agent" that helps the owner generate high-quality RAG documents.
- **Generative UI:** Dynamic widgets (`streamUI`) for project cards and contact forms.
