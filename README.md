# BotFolio

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tsaung/botfolio)

**BotFolio** is evolving from a simple AI-native portfolio into a "WordPress-like" multi-purpose website template. It combines a powerful, reference-based Page Builder and Block Library powered by a Headless CMS with an integrated AI Chat Assistant backed by RAG (Retrieval-Augmented Generation). Build dynamic sites with ease while letting an AI agent guide your visitors.

> **Version:** 2.0 (Migration to Sanity CMS in progress)
> **Stack:** Next.js (App Router), Sanity, Supabase, Vercel AI SDK, Shadcn UI, Tailwind CSS

> 🚧 **Work in Progress:** BotFolio is currently undergoing a massive structural migration from V1 (Supabase-only CMS) to V2 (Sanity Headless CMS + Page Builder). Many features listed below are still under active development and the V2 release is not yet complete. Please see `todo.md` for the current migration status!

## Architecture Separation of Concerns

BotFolio V2 relies on three main components to function:
1.  **Frontend & Admin Panel:** Next.js (App Router) provides both the public-facing pages and the custom-built, React-based Admin Dashboard.
2.  **Content Source of Truth:** Sanity is purely a headless backend containing your user-managed structure for pages, reusable blocks, and navigation. We intentionally don't ship their Studio interface to keep user experiences focused.
3.  **Auth, Config, & Embeddings:** Supabase is responsible for handling user authentication (logging into the dashboard), saving the bot configuration logic, and storing vector chunks (`pgvector`) used in semantic queries for the AI.

## Prerequisites & Pricing

To run BotFolio, you will need the following accounts (all offer generous free tiers suitable for personal use):

- **[GitHub](https://github.com)** (for forking the repo)
- **[Supabase](https://supabase.com)** (Authentication, pgvector database)
- **[Vercel](https://vercel.com)** (Hosting)
- **[Sanity](https://sanity.io)** (Headless CMS for content management)
- **API Gateways** like [OpenRouter](https://openrouter.ai) or [Google AI Studio](https://aistudio.google.com) for AI Chat & Embeddings

> **⚠️ Note on Scaling:** While the free tiers of these services are sufficient to run BotFolio, you may incur fees if your traffic scales significantly or if you exceed API gateway usage limits.

## Features (V2 🚧)

- **Sanity Headless CMS** — Content backend using a custom Page Builder model, without exposing a complex Studio UI to end users.
- **Block Library & Page Builder** — A "WordPress-like" experience where users compose dynamic pages using 14+ reusable generic blocks (Hero, CTA, FAQs, Testimonials, Grids, etc).
- **AI Chat Assistant** — A custom floating bot interface powered by the Vercel AI SDK. Answers visitor questions accurately using semantic context.
- **RAG Pipeline via Webhooks** — An auto-ingestion pipeline where content created in the Sanity CMS triggers a webhook, dynamically chunks/embeds data, and stores it in Supabase `pgvector`.
- **Admin Dashboard** — Custom-built dashboard replacing the standard Sanity Studio to manage pages, blocks, projects, experiences, and RAG knowledge base.
- **Theme Switcher & Design Tokens** — Full Light/Dark/System support powered by CSS custom properties and brand colors controlled via the admin settings.
- **Supabase Authentication** — Secure Email/Password login guarding access to the CMS capabilities.

> **☁️ Want to deploy without local setup?** See [DEPLOY.md](DEPLOY.md) for a step-by-step cloud deployment guide (Needs updating for V2).

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
    - Copy `.env.local.example` to `.env.local` and fill in keys for Sanity, Supabase, and your AI API Provider.

      ```bash
      # Sanity
      NEXT_PUBLIC_SANITY_PROJECT_ID=...
      NEXT_PUBLIC_SANITY_DATASET=production
      SANITY_API_TOKEN=...
      SANITY_WEBHOOK_SECRET=...

      # Supabase (Local Instance defaults for development)
      NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:64321
      NEXT_PUBLIC_SUPABASE_ANON_KEY=...
      SUPABASE_SERVICE_ROLE_KEY=...

      # AI Provider
      OPENROUTER_API_KEY=...
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

> 💡 **Coming Soon:** A fully automated Setup Wizard UI (`/setup`) is planned to simplify Supabase DB initialization and Sanity environment checks, avoiding manual backend CLI commands!

## Project Structure (V2)

- `src/app/(visitor)` — Public dynamic pages rendered by the Block Library, plus floating AI chat.
- `src/app/admin/` — Custom protected Admin Dashboard. Manages Sanity pages, blocks, collections (projects, experiences), knowledge base, and AI settings.
- `src/app/(auth)` — Supabase Auth pages (Login, Reset Password).
- `src/app/api/webhooks/sanity` — V2 RAG Pipeline: automatically chunks & syncs Sanity content to `pgvector`.
- `src/app/api/chat` — AI chat API route (Vercel AI SDK) with vector similarity retrieval.
- `src/lib/db/` — Supabase clients (Server/Client/Admin) and Proxy configurations.
- `src/components/v2/blocks/` — React implementations for Sanity document types (Hero, CTA, Features, etc).
- `src/sanity/schemas/` — Definitions for our Page Builder blocks and collection models.
- `specs/` — Living documentation and specifications.
- `supabase/migrations` — Supabase Auth and pgvector schema definitions.
