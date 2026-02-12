# Features

## 1. Authentication
- **Method:** Email/Password via Supabase Auth.
- **Registration:** Invite-only (no public signup).
- **Flows:** Login, Forgot Password, Update Password.
- **Status:** Implemented.

## 2. Admin Dashboard
- **Access:** Restricted to authenticated users (`/(admin)` routes).
- **Layout:**
    - Sidebar navigation (Dashboard, AI Settings).
    - Header with logout button.
    - Mobile-responsive.
- **Features:**
    - **Model Settings:** Select the AI model for the public chat.
    - **Profile Management:** Update personal details.

## 3. Visitor Chat
- **Interface:** Full-screen chat UI.
- **Functionality:**
    - **Welcome Screen:** Display a welcoming message and suggested prompts (e.g., "Tell me about your experience", "Contact info").
    - **Chat Interaction:**
        - User types a message or clicks a prompt.
        - AI responds with streaming text.
        - Support for Markdown rendering (bold, italics, code blocks).
    - **Loading State:** Input is disabled while AI is "thinking".
    - **History:** Chat history persists within the session (no need for long-term persistence yet).
- **Model:** Configurable via Admin Dashboard (stored in `system_settings`).
    - **Default:** `google/gemini-3-flash-preview` (if no config found).
    - **System Prompt:** "You are Thant Sin's Portfolio Assistant. You are a helpful assistant that answers questions about Thant Sin's work and experience."
- **Backend:**
    - Uses Vercel AI SDK (`streamText`) with OpenRouter.
    - Connects to `google/gemini-3-flash-preview` by default.

## 4. Planned Features (The "Brain")
- **RAG Pipeline:** Vectorize documents (Markdown/Text) for retrieval.
- **Enrichment Agent:** An "Admin Agent" that helps the owner generate high-quality RAG documents.
- **Generative UI:** Dynamic widgets (`streamUI`) for project cards and contact forms.
