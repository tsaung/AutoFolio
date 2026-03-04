# V2 Architecture: AI-Powered Headless CMS Template

This document outlines the architecture for the V2 iteration of the BotFolio project. The project is transitioning from a hardcoded, single-tenant portfolio into a **multi-purpose website template** powered by a headless CMS (Sanity) and an integrated AI assistant.

> [!IMPORTANT]
> **V2 is a breaking change.** This is a new template architecture, not an upgrade path from V1. Existing V1 deployments are not expected to migrate data — they should start fresh with the V2 template.

## 1. System Architecture Overview

The V2 stack uses a decoupled, "best-of-breed" approach:

| Layer                        | Technology                                | Responsibility                                                                                                             |
| ---------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Frontend & API**           | Next.js (App Router)                      | Presentation (rendering page builder blocks), API routes (webhooks, AI chat)                                               |
| **Content Management**       | Sanity Studio (hosted at Sanity's domain) | Single source of truth for all **structured content**: Pages, Projects, Experiences, Blog Posts, Site Settings, Navigation |
| **Admin Dashboard**          | Sanity App SDK (in Sanity Dashboard)      | Bot config management UI — saves to Supabase via API route, authenticated by Sanity token verification                     |
| **Database & Vector Search** | Supabase (PostgreSQL + pgvector)          | Vector embeddings for RAG pipeline, bot configs                                                                            |
| **AI Provider**              | OpenRouter / Vercel AI SDK                | Public-facing chat assistant, embedding generation                                                                         |
| **Images**                   | Sanity Image CDN (`@sanity/image-url`)    | Responsive images, on-the-fly transforms, hotspot cropping                                                                 |

### 1.1 Source of Truth Boundaries

To avoid dual-source-of-truth confusion, this is the definitive boundary:

- **Sanity owns:** All user-facing content (pages, page builder blocks, projects, experiences, navigation, site settings, images) and **all authentication** (Studio/Dashboard login via Google/GitHub SSO).
- **Supabase owns:** Vector embeddings (derived from Sanity content), bot configs (model selection, system prompt), sync metadata.
- **Content never lives in both.** Supabase stores _derived_ data (embeddings), not source content.

### 1.2 Authentication

Sanity is the **sole authentication provider** in V2. Content editors log into the **Sanity Dashboard** (`sanity.io/@your-org`) via Google/GitHub SSO. From there, they access:

1. **Hosted Studio** — for content CRUD (pages, projects, experiences, site settings)
2. **Bot Settings App** (Sanity App SDK) — for managing bot configs (saved to Supabase)

The Bot Settings app runs inside the Sanity Dashboard as an iframe. In Dashboard mode, the SDK provides a **global stamped token** via `useClient().config().token`. The app sends this token as a `Bearer` header to the Next.js API route, where it's verified server-side via Sanity's `/users/me` endpoint. No secrets are exposed on the client.

> [!IMPORTANT]
> **Supabase Auth is fully dropped in V2.** There is no custom login/signup flow. Sanity is the sole authentication provider. The old admin dashboard (`/admin/*`), auth routes (`/login`, `/signup`), and all Supabase Auth dependencies (`@supabase/ssr`, auth middleware) will be removed in Phase 5.
>
> **Studio is NOT embedded in Next.js.** The `/studio` route is removed. The hosted Studio and App SDK app both live in the Sanity Dashboard.

### 1.3 Template Prerequisites & Costs

This template requires accounts on multiple services. All offer free tiers sufficient for personal sites and small businesses:

| Service      | Free Tier Highlights                                                   | When Paid is Needed                                         |
| ------------ | ---------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Sanity**   | 1 project, 100k API requests/month, 500k assets, 10GB bandwidth        | High-traffic sites, multiple editors, large asset libraries |
| **Supabase** | 500MB DB, 2 projects, 50k monthly active users                         | Exceeding storage or needing backups                        |
| **Vercel**   | 100GB bandwidth, serverless functions                                  | Team features, enterprise domains                           |
| **AI APIs**  | Google AI Studio free tier (Gemini embeddings), OpenRouter pay-per-use | Depends on chat volume                                      |

> [!NOTE]
> For a typical personal or SME website with moderate traffic, all services should remain within their free tiers.

## 2. Content Modeling: The "Page Builder" Approach

Instead of hardcoded pages, V2 uses a **dynamic block-based page builder**. Users add, remove, and reorder sections visually within Sanity Studio — no code changes required.

### 2.1 Core Sanity Document Types

#### `page` (Document)

Represents a routable page (e.g., Home, About, Services).

- `title` (String)
- `slug` (Slug)
- `seo` (Object — see §2.3)
- `pageBuilder` (Array of Block objects)

#### `project` (Document)

Portfolio project showcase item, referenced by `projectGridBlock`.

- `title`, `slug`, `description`, `image` (Sanity Image), `liveUrl`, `repoUrl`, `tags[]`, `status` (published/draft/archived), `sortOrder`

#### `experience` (Document)

Work history entry, referenced by `experienceTimelineBlock`.

- `title`, `company`, `location`, `startDate`, `endDate`, `description` (Portable Text), `sortOrder`

#### `siteSettings` (Singleton Document)

Global site configuration, managed from Studio:

- `siteName` (String)
- `logo` (Sanity Image)
- `navigation` (Array of `{ label, link }` — link can reference a `page` document or be an external URL)
- `footer` (Object: `copyrightText`, `socialLinks[]`)
- `brandColors` (Object: `primary`, `secondary`, `accent` — hex values for CSS custom properties)

> [!NOTE]
> **Why Sanity for site settings instead of Supabase?**
> The site owner is already in Sanity Studio editing content. Having navigation, branding, and footer settings in the same editing environment is much better UX than switching to a separate admin panel. Sanity also provides validation, draft previews, and revision history on these settings for free.
>
> **Supabase retains** only technical settings that the site owner shouldn't touch from the CMS: bot model selection, system prompts, and RAG configuration (managed via the Bot Settings App SDK app in the Sanity Dashboard).

### 2.2 Page Builder Blocks

Blocks are organized into **General Purpose** (for any website type) and **Portfolio/Resume** (for personal branding sites).

#### General Purpose Blocks

| Block Type          | Description                                                                     |
| ------------------- | ------------------------------------------------------------------------------- |
| `heroBlock`         | Headline, subheadline, CTA buttons, background image                            |
| `richTextBlock`     | Portable Text content (paragraphs, lists, links, inline images)                 |
| `imageGalleryBlock` | Grid or masonry image gallery with lightbox                                     |
| `ctaBlock`          | Call-to-action banner with heading, text, and button                            |
| `featureGridBlock`  | Icon + title + description grid (great for services, features, benefits)        |
| `faqBlock`          | Accordion-style FAQ section                                                     |
| `testimonialBlock`  | Carousel or grid of customer/client quotes                                      |
| `embedBlock`        | YouTube, Vimeo, Calendly, or custom embed code                                  |
| `logoCloudBlock`    | Client/partner/tech logo strip                                                  |
| `statsBlock`        | Key metrics/numbers showcase (e.g., "10+ Years", "50+ Projects")                |
| `contactFormBlock`  | Embeddable contact form (submissions handled via API route or external service) |

#### Portfolio / Resume Blocks

| Block Type                | Description                                                  |
| ------------------------- | ------------------------------------------------------------ |
| `projectGridBlock`        | References a list of `project` documents, displayed as cards |
| `experienceTimelineBlock` | References `experience` documents in a vertical timeline     |
| `skillsBlock`             | Grouped skill display with proficiency indicators            |

### 2.3 SEO Schema

Every `page` document includes an `seo` object:

- `metaTitle` (String — falls back to `page.title` if empty)
- `metaDescription` (Text)
- `ogImage` (Sanity Image — for social sharing)
- `noIndex` (Boolean — exclude from search engines, useful for drafts/internal pages)

The Next.js dynamic route generates the `metadata` export from this object.

### 2.4 Next.js Component Mapping

A dynamic catch-all route (`app/[[...slug]]/page.tsx`) fetches the `page` document from Sanity via GROQ. A `PageRenderer` component iterates over the `pageBuilder` array and maps each block's `_type` to a React component:

```tsx
// Conceptual Page Renderer
const blockComponents: Record<string, React.ComponentType<{ data: any }>> = {
  heroBlock: Hero,
  richTextBlock: RichText,
  projectGridBlock: ProjectGrid,
  ctaBlock: CallToAction,
  faqBlock: FAQ,
  // ...
};

export function PageRenderer({ blocks }: { blocks: SanityBlock[] }) {
  return blocks.map((block) => {
    const Component = blockComponents[block._type];
    return Component ? <Component key={block._key} data={block} /> : null;
  });
}
```

## 3. AI Auto-Ingestion Pipeline (RAG)

The visitor-facing AI assistant must always be up-to-date with the latest Sanity content. This is achieved through a **hybrid sync strategy**: webhook-driven real-time sync (primary) with on-the-fly staleness checks (fallback).

### 3.1 Primary: Webhook Sync

1. **Trigger:** An editor creates, updates, or deletes a document in Sanity Studio.
2. **Webhook:** Sanity fires a GROQ-powered webhook to `/api/webhooks/sanity`.
3. **Processing:**
   - Validate the webhook signature (`SANITY_WEBHOOK_SECRET`).
   - Parse the Sanity document (including Portable Text via `@portabletext/to-plain-text`) into a plain, context-rich text string.
   - Generate vector embeddings via the embedding API (e.g., `gemini-embedding-001`).
4. **Storage:** Upsert the embedding + metadata into the `knowledge_chunks` table (not a separate table — see §3.3).
5. **Idempotency:** Use Sanity `_id` + `_rev` as the idempotency key. On webhook receipt:
   - If chunks for this `_id` already exist with the same `_rev`, skip processing.
   - If the `_rev` differs (or no chunks exist), delete old chunks for this `_id` and re-process.
   - For delete events, remove all chunks with this `source_id`.

### 3.2 Fallback: On-the-Fly Staleness Check

If a webhook fails silently, the AI could answer from stale embeddings. As a safety net:

1. When a visitor opens the chat, the frontend fetches the latest Sanity document `_rev` values (lightweight query).
2. Compare against the `source_rev` stored in `knowledge_chunks`.
3. If any are stale, trigger a background re-sync for those documents only.
4. The chat proceeds immediately with whatever embeddings are available — the sync runs in the background (via `after()` or a queued task).

> [!NOTE]
> This fallback adds a lightweight GROQ query on chat open but avoids the performance hit of blocking the chat. The visitor gets an answer from the last known-good embeddings while stale content catches up in the background.

### 3.3 Unified Embedding Schema

Instead of creating a separate `sanity_embeddings` table, **extend the existing `knowledge_chunks` table** with source-tracking columns:

- `source` (Text): `'manual'` | `'sanity_auto'`
- `source_id` (Text): Sanity document `_id` (for auto-ingested) or `knowledge_documents.id` (for manual)
- `source_rev` (Text, Nullable): Sanity document `_rev` (for idempotency, null for manual docs)

This lets the **single `match_knowledge_chunks` RPC** search across all content sources — both manually entered knowledge docs and auto-ingested Sanity content — with one vector query.

### 3.4 Portable Text Parsing

Sanity Portable Text is a nested JSON structure, not flat text. The ingestion pipeline must use `@portabletext/to-plain-text` to serialize blocks into embeddable strings. Additionally:

- Extract and include image `alt` text and captions.
- Expand document references to include referenced document titles/summaries.
- Handle custom block types gracefully (skip or serialize to a generic format).

## 4. Chat Integration

- The visitor-facing chat interface queries the unified `knowledge_chunks` table for vector search (same `match_knowledge_chunks` RPC).
- The AI system prompt (stored in `bot_configs` in Supabase) instructs the model to rely primarily on retrieved Sanity context.
- Social links and contact info are fetched from the `siteSettings` Sanity document (not from a Supabase table).

## 5. Environment Variables

V2 adds the following env vars (update `.env.local.example`):

```
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=           # Server-side: read/write for webhooks
SANITY_WEBHOOK_SECRET=      # Webhook signature verification

# (Existing V1 vars for Supabase, OpenRouter, Google AI remain)
```

The App SDK project (`botfolio-admin/`) uses its own env vars:

```
# botfolio-admin/.env
SANITY_APP_API_URL=           # Your Next.js app URL (e.g. https://yoursite.com)
```

> [!NOTE]
> No shared secret is needed. The App SDK provides the Sanity auth token automatically via `useClient().config().token`, and the Next.js API verifies it server-side via `api.sanity.io/users/me`.

## 6. Actionable Task Breakdown

This migration is executed in phases. Each phase is designed to be a self-contained, testable increment.

> [!TIP]
> **Before starting Phase 1:** Tag the current codebase as `v1.0.0` in Git so there's a clear rollback point.

### Phase 1a: Sanity Setup

- [x] Install `next-sanity`, `sanity`, and `@sanity/image-url`.
- [x] Create the Sanity project (via `sanity init` or Sanity dashboard).
- [x] Configure Sanity CORS origins and API tokens.
- [x] Add Sanity env vars to `.env.local.example` and document in README.
- [x] Verify: Studio loads at hosted Sanity domain and can create a test document.
- [ ] Remove embedded Studio route (`/studio`) from Next.js app.

### Phase 1b: Schema Design

- [x] Define the `page` document type with `pageBuilder` array field.
- [x] Define the `project` document type.
- [x] Define the `experience` document type.
- [x] Define the `siteSettings` singleton (site name, logo, navigation, footer, brand colors).
- [x] Define the `seo` object type and attach to `page`.
- [x] Implement 3 foundational blocks: `heroBlock`, `richTextBlock`, `ctaBlock`.
- [x] Verify: All document types and blocks are editable in Studio.

### Phase 2: Next.js Page Renderer

- [x] Create an isolated test route (e.g., `app/sandbox/page.tsx` or `app/v2/[slug]/page.tsx`) instead of a catch-all route to fetch `page` data via GROQ. This avoids conflicts with existing V1 routes until cleanup.
- [x] Build the `PageRenderer` component to map `_type` to React components.
- [x] Scaffold foundational General Purpose block components (Hero, RichText, CTA).
- [ ] Create and polish remaining block components (FeatureGrid, FAQ, Testimonial, ImageGallery, Embed, LogoCloud, Stats, ContactForm, ProjectGrid, ExperienceTimeline, Skills).
- [ ] Fetch `siteSettings` for navigation and footer rendering.
- [ ] **Integrate chat interface into V2 layout:** Decouple `ChatInterface` from V1's `profiles` table — source bot name/avatar from `siteSettings` (Sanity). Decouple `VisitorLayoutWrapper` from V1 types. Create a V2-compatible layout wrapper that works with Sanity data.
- [x] Generate Next.js `metadata` from the `seo` object on each page.
- [x] Verify: Creating a page in Studio with blocks renders correctly on the frontend.

### Phase 2.1: Bot Settings App (Sanity App SDK)

> [!NOTE]
> This phase is executed **before** remaining Phase 2 work. The chat interface integration (Phase 2) depends on `bot_configs` being accessible without Supabase Auth. This phase provides that.

- [x] Build API route `GET/POST /api/admin/bot-config` — reads/writes `bot_configs` from Supabase, protected by Sanity token verification (`Bearer` token → `/users/me`).
- [ ] Update `getPublicBotConfig()` in `src/lib/actions/bot-config.ts` — remove Supabase Auth dependency, query directly by type (single-tenant).
- [ ] Scaffold Sanity App SDK project (`botfolio-admin/`) with `npx sanity@latest init --template app-sanity-ui`.
- [ ] Build Bot Settings form using `@sanity/ui` components — model selection, system prompt, predefined prompts.
- [ ] Wire API calls from App SDK app to Next.js `bot-config` endpoint with `ADMIN_API_SECRET`.
- [x] Remove embedded Studio route, `BotSettingsTool.tsx`, and `@sanity/studio-secrets` dependency.
- [ ] Migrate `bot_configs` table: drop `user_id` foreign key (no more Supabase Auth users).
- [ ] Deploy App SDK app with `npx sanity deploy`.
- [ ] Verify: Bot settings are editable from the Sanity Dashboard App and persisted to Supabase.

### Phase 2.5: Themeable Design System

- [ ] Implement CSS custom properties for brand colors, fonts, and spacing.
- [ ] Wire brand color values from `siteSettings` (fetched at layout-level) into CSS variables.
- [ ] Ensure all block components consume design tokens (no hardcoded colors).
- [ ] Verify: Changing brand colors in Studio updates the site's look.

### Phase 3: RAG Auto-Ingestion Pipeline

- [ ] Add `source`, `source_id`, and `source_rev` columns to the `knowledge_chunks` table (Supabase migration).
- [ ] Install `@portabletext/to-plain-text` for Portable Text serialization.
- [ ] Develop the `/api/webhooks/sanity` API route with signature verification.
- [ ] Implement idempotent embedding logic (check `_id` + `_rev` before processing).
- [ ] Configure the webhook trigger in the Sanity project dashboard.
- [ ] Verify: Creating/updating a document in Studio triggers the webhook and upserts embeddings.

### Phase 4: Chat RAG Integration & Staleness Check

- [ ] Update the chat API to use the unified `knowledge_chunks` table (same RPC, now includes Sanity content).
- [ ] Implement the on-the-fly staleness check on chat open (compare `source_rev`).
- [ ] Refine the AI system prompt to reference dynamic Sanity content.
- [ ] Verify: Chat correctly answers questions about content created in Sanity Studio.

### Phase 5: Cleanup & Deprecation

- [ ] **Drop Supabase Auth entirely:** Remove `@supabase/ssr`, auth middleware/proxy, login/signup routes, auth callbacks.
- [ ] **Remove Supabase tables:** `projects`, `experiences`, `skills`, `social_links`, `profiles` (content now in Sanity `siteSettings`).
- [ ] **Remove server actions:** All CRUD actions for the deprecated tables (in `src/lib/actions/`).
- [ ] **Remove admin routes:** All `/admin/*` routes, `/dashboard` (replaced by Sanity Studio at `/studio`).
- [ ] **Retain:** `bot_configs` table, `knowledge_documents` + `knowledge_chunks` tables.
- [ ] **Retain:** Bot config management via the Sanity Studio custom tool (built in Phase 2.1).
- [ ] Remove Cloudinary dependencies (`src/lib/cloudinary.ts`, `src/lib/cloudinary-loader.ts`).
- [ ] Update `.agent/rules/*.md` and `specs/*.md` to reflect the new architecture.
- [ ] Verify: App builds cleanly, no dead imports or references to removed tables.

### Phase 6: Live Preview & Draft Support

- [ ] Configure `next-sanity` preview mode for real-time Studio editing.
- [ ] Evaluate Sanity's `Presentation` tool or `@sanity/visual-editing` for inline editing.
- [ ] Implement draft/published toggle so editors can preview unpublished changes.
- [ ] Verify: Editing a page in Studio shows changes in real-time on the frontend preview.

### Phase 7: Polish & Documentation

- [ ] End-to-end test: clone template → create Sanity project → configure env → deploy to Vercel.
- [ ] Write template README with setup instructions for marketplace users.
- [ ] Update all spec files to match V2 final state.
- [ ] Update `.agent/rules/` to reflect V2 conventions.
