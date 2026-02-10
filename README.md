# AutoFolio

**AutoFolio** is an AI-native portfolio platform that "interviews" for you. It combines a sleek, modern chat interface with RAG (Retrieval Augmented Generation) to answer questions about your experience, projects, and skills accurately.

> **Status:** Active Development
> **Stack:** Next.js, Supabase, Vercel AI SDK, Shadcn UI

## Features
- **Authentication:** Secure Email/Password login with Supabase Auth.
- **Visitor Chat:** A conversational interface for recruiters and clients (Planned).
- **Generative UI:** The AI renders rich components (Project Cards, Contact Forms) in the chat (Planned).
- **Admin Dashboard:** Manage your profile and documents (Planned).
- **Profile Enrichment:** Chat with the AI to generate RAG-optimized summaries of your experience (Planned).

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/AutoFolio.git
    cd AutoFolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Supabase:**
    - Create a Supabase project (or use local).
    - Run migrations:
      ```bash
      npx supabase db reset
      ```
    - Copy `.env.local.example` to `.env.local` and fill in keys:
      ```bash
      NEXT_PUBLIC_SUPABASE_URL=...
      NEXT_PUBLIC_SUPABASE_ANON_KEY=...
      NEXT_PUBLIC_SITE_URL=http://localhost:3000
      OPENROUTER_API_KEY=...
      ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## Project Structure
- `app/(visitor)`: Public facing chat interface.
- `app/(admin)`: Protected admin dashboard.
- `app/(auth)`: Authentication pages (Login, Reset Password).
- `lib/ai`: Vercel AI SDK configurations.
- `lib/db`: Supabase client (Server/Client/Middleware).
- `supabase/migrations`: Database schema definitions.
