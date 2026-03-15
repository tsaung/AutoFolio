# V2 Architecture Overview

This document outlines the high-level architecture for the V2 iteration of the BotFolio project. The project is transitioning from a hardcoded, single-tenant portfolio into a **multi-purpose website template** powered by a headless CMS (Sanity) and an integrated AI assistant.

> [!IMPORTANT]
> **V2 is a breaking change.** This is a new template architecture, not an upgrade path from V1. Existing V1 deployments are not expected to migrate data — they should start fresh with the V2 template.

## 1. System Architecture Overview

The V2 stack uses a decoupled, "best-of-breed" approach:

| Layer               | Technology                             | Responsibility                                                                                     |
| ------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Frontend & API**  | Next.js (App Router)                   | Public site rendering, custom admin dashboard, API routes (webhooks, AI chat)                      |
| **Content Storage** | Sanity (headless, API only)            | Source of truth for structured content: Pages, Projects, Experiences, Site Settings. No Studio UI. |
| **Auth & Database** | Supabase (PostgreSQL + pgvector)       | Authentication, vector embeddings for RAG, bot configs, admin dashboard access control             |
| **AI Provider**     | OpenRouter / Vercel AI SDK             | Public-facing chat assistant, embedding generation                                                 |
| **Images**          | Sanity Image CDN (`@sanity/image-url`) | Responsive images, on-the-fly transforms, hotspot cropping                                         |

### 1.1 Source of Truth Boundaries

- **Sanity owns:** All user-facing content (pages, page builder blocks, projects, experiences, navigation, site settings, images). Sanity is used **as a headless API only** — no Studio, no Dashboard UI, no App SDK.
- **Supabase owns:** Authentication, vector embeddings (derived from Sanity content), bot configs (model selection, system prompt), sync metadata.
- **Content never lives in both.** Supabase stores _derived_ data (embeddings), not source content.

### 1.2 Template Prerequisites & Costs

| Service      | Free Tier Highlights                                                   | When Paid is Needed                                         |
| ------------ | ---------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Sanity**   | 1 project, 100k API requests/month, 500k assets, 10GB bandwidth        | High-traffic sites, multiple editors, large asset libraries |
| **Supabase** | 500MB DB, 2 projects, 50k monthly active users                         | Exceeding storage or needing backups                        |
| **Vercel**   | 100GB bandwidth, serverless functions                                  | Team features, enterprise domains                           |
| **AI APIs**  | Google AI Studio free tier (Gemini embeddings), OpenRouter pay-per-use | Depends on chat volume                                      |

## 2. Environment Variables

V2 env vars (update `.env.local.example`):

```
# Sanity (headless API only — no Studio)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=           # Server-side: read/write for content CRUD from dashboard
SANITY_WEBHOOK_SECRET=      # Webhook signature verification

# Supabase (existing V1 vars remain)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI (existing V1 vars remain)
OPENROUTER_API_KEY=
GOOGLE_AI_API_KEY=
```

> [!NOTE]
> `SANITY_API_TOKEN` needs **Editor** or **Admin** permissions since the dashboard writes content to Sanity. This is a server-side secret, never exposed to the client.