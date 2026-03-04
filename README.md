# BotFolio

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tsaung/botfolio)

**BotFolio** is an AI-native portfolio platform that "interviews" for you. It combines a structured portfolio with an AI-powered chat assistant backed by RAG (Retrieval Augmented Generation) to answer questions about your experience, projects, and skills accurately.

> **Version:** 2.0 (Migration to Sanity CMS in progress)
> **Stack:** Next.js (App Router), Sanity, Supabase, Vercel AI SDK, Shadcn UI, Tailwind CSS

## Prerequisites & Pricing

To run BotFolio, you will need the following accounts (all offer generous free tiers suitable for personal use):

- **[GitHub](https://github.com)** (for forking the repo)
- **[Supabase](https://supabase.com)** (Authentication, pgvector database)
- **[Vercel](https://vercel.com)** (Hosting)
- **[Sanity](https://sanity.io)** (Headless CMS for content management)
- **API Gateways** like [OpenRouter](https://openrouter.ai) or [Google AI Studio](https://aistudio.google.com) for AI Chat & Embeddings

> **⚠️ Note on Scaling:** While the free tiers of these services are sufficient to run BotFolio, you may incur fees if your traffic scales significantly or if you exceed API gateway usage limits.

## Features

- **Structured Portfolio** — Hero section, Projects grid, Experience timeline, Skills grid, Social links.
- **AI Chat Assistant** — Floating chat FAB with streaming responses, markdown rendering, and typing indicator.
- **RAG Pipeline** — Automatic chunking & embedding via `gemini-embedding-001` with pgvector cosine similarity retrieval.
- **Portfolio → RAG Sync** — Structured portfolio data auto-syncs to the knowledge base for better AI answers.
- **Admin Dashboard** — Manage profile, portfolio content, knowledge base, and bot settings.
- **Knowledge Base** — CRUD for RAG documents with automatic background processing via Next.js `after()`.
- **Authentication** — Secure Email/Password login with Supabase Auth (invite-only).
- **Theme Switcher** — Light, Dark, and System modes across all views.

> **☁️ Want to deploy without local setup?** See [DEPLOY.md](DEPLOY.md) for a step-by-step cloud deployment guide.

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/tsaung/botfolio.git
    cd botfolio
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Setup Environment:**
    - Copy `.env.local.example` to `.env.local` and fill in keys:

      ```bash
      # Supabase (Local Instance)
      NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:64321
      NEXT_PUBLIC_SUPABASE_ANON_KEY=...
      SUPABASE_SERVICE_ROLE_KEY=...

      # OpenRouter
      OPENROUTER_API_KEY=...

      # Site URL
      NEXT_PUBLIC_SITE_URL=http://localhost:3000
      ```

4.  **Start Local Supabase:**

    ```bash
    npx supabase start
    ```

    If this is your first time or need to reset the database:

    ```bash
    npx supabase db reset
    ```

5.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## Project Structure

- `app/(visitor)` — Public portfolio page + floating AI chat.
- `app/(admin)` — Protected admin dashboard, portfolio management (projects, experiences, skills, social-links), knowledge base, settings.
- `app/(auth)` — Authentication pages (Login, Reset Password).
- `app/api/chat` — AI chat API route with RAG retrieval.
- `lib/actions` — Server actions for all CRUD operations.
- `lib/rag` — RAG pipeline (chunking, embedding, portfolio sync).
- `lib/db` — Supabase clients (Server/Client/Admin).
- `components/` — Reusable UI components.
- `specs/` — Living documentation and specifications.
- `supabase/migrations` — Database schema definitions.
