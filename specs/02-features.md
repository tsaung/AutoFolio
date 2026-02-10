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
- **Functionality:** Visitors can chat with the AI to learn about the portfolio owner.
- **Model:** Configurable via Admin Dashboard (stored in `system_settings`).

## 4. Planned Features (The "Brain")
- **RAG Pipeline:** Vectorize documents (Markdown/Text) for retrieval.
- **Enrichment Agent:** An "Admin Agent" that helps the owner generate high-quality RAG documents.
- **Generative UI:** Dynamic widgets (`streamUI`) for project cards and contact forms.
