# AutoFolio - Comprehensive Specifications

> **Status:** Draft / Requirements Gathering
> **Last Updated:** 2026-02-10

## 1. Project Vision
**Concept:** An open-source, AI-native portfolio platform.
**Model:** "WordPress-style" architecture:
1.  **Open Source (MVP):** Single-tenant, self-hosted (User clones repo + connects their own Supabase).
2.  **Hosted (Future):** Multi-tenant SaaS (One DB, multiple users).
*Strategy:* Build with `user_id` / `workspace_id` in the schema from Day 1 to allow easy migration to Hosted mode later.

## 2. User Journeys

### 2.1 The Visitor (Recruiter / Client)
*   **Goal:** Quickly evaluate the candidate's fit.
*   **Interaction:** Chat interface + Rich UI elements.
*   **Fallback:** *TBD (e.g., standard "Project Grid" view for non-chat users).*

### 2.2 The Owner (Developer / Creator)
*   **Goal:** Manage data and train the AI.
*   **Mechanism:** Admin Dashboard.
*   **Data Enrichment:** Chat with the "Admin Agent" to generate RAG-optimized documents.
*   **Authentication:** Supabase Auth (Email/Password).
    - **Login:** Standard email/password flow.
    - **Signup:** Disabled/Manual creation (Single Tenant focus).
    - **Password Reset:** Supported via email link.

## 3. Core Features

### 3.1 Conversational Interface
*   Streaming responses.
*   Markdown support.
*   **Model Provider:** OpenRouter.

### 3.2 "Tiny Additions" (Generative UI)
*   Render React components (widgets) via tool calling (`streamUI`).

### 3.3 Personal RAG (The "Brain")
*   **Dual-Document Architecture:**
    1.  **Raw Source:** User pastes Text/Markdown.
    2.  **Enriched:** AI-generated summaries.
*   **Database:** Supabase (postgres + pgvector).

### 3.4 SEO & Metatags
*   Dynamic OpenGraph images.
*   Server-Side Rendering of initial content (if possible) or static fallback.

## 4. Tech Stack
*   **Frontend:** Next.js (App Router), Tailwind CSS.
*   **UI Library:** Shadcn UI.
*   **AI:** Vercel AI SDK Core + UI.
*   **Database:** Supabase.
*   **Deployment:** Vercel (recommended).

## 5. Data Schema (Current)
*   `profiles`:
    - `id` (uuid, PK, references auth.users)
    - `username`, `full_name`, `avatar_url`, `website`
    - `updated_at`
*   `documents` (Future):
    - `id`, `user_id`, `content`, `type`=['raw','enriched'], `created_at`
*   `embeddings` (Future):
    - `id`, `document_id`, `vector`, `content_chunk`
*   `messages` (Future):
    - `id`, `user_id`, `session_id`, `role`, `content`

## 6. Implementation Strategy (MVP)
### 6.1 Project Structure
*   `app/(visitor)/page.tsx` -> Main Chat Interface.
*   `app/(admin)/dashboard/...` -> Admin Panel (Protected).
*   `app/(auth)/...` -> Authentication Pages.
*   `lib/ai` -> SDK Core definition and prompts.
*   `lib/db` -> Supabase Client (Server/Client).

### 6.2 Environment Variables
*   `OPENROUTER_API_KEY`
*   `NEXT_PUBLIC_SUPABASE_URL`
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
*   `SUPABASE_SERVICE_ROLE_KEY` (for admin/enrichment tasks)
*   `NEXT_PUBLIC_SITE_URL` (for auth redirects)

---
*This document will be updated as we clarify requirements.*
