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

## 4. UI/UX

    - **Theme Switcher:**
      - Support for Light, Dark, and System modes.
      - Persisted via `next-themes`.
      - Integrated into Public Chat (Header right) and Admin Header.
    - **Header:**
      - **Desktop:** Standard left-aligned title.
      - **Mobile:** Centered title for app-like feel.Theme switcher remains on the right.

## 5. Planned Features (The "Brain")

- **RAG Pipeline:** Vectorize documents (Markdown/Text) for retrieval.
- **Enrichment Agent:** An "Admin Agent" that helps the owner generate high-quality RAG documents.
- **Generative UI:** Dynamic widgets (`streamUI`) for project cards and contact forms.
