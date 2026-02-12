# BotFolio

**BotFolio** is an AI-native portfolio platform that "interviews" for you. It combines a sleek, modern chat interface with RAG (Retrieval Augmented Generation) to answer questions about your experience, projects, and skills accurately.

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
    git clone https://github.com/yourusername/botfolio.git
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
    This project uses a custom port configuration (643xx) to avoid conflicts with other local Supabase projects.

    ```bash
    npx supabase start
    ```

    _Note: The API URL and Keys will be output to the terminal after the start command finishes._

    If this is your first time or need to reset the database:

    ```bash
    npx supabase db reset
    ```

5.  **Run Development Server:**
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
