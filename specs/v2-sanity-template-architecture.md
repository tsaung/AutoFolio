# V2 Architecture: AI-Powered Headless CMS Template

This document outlines the architecture for the V2 iteration of the BotFolio project. The project is transitioning from a hardcoded, single-tenant portfolio into a **multi-purpose website template** powered by a headless CMS (Sanity) and an integrated AI assistant.

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

### 1.2 Authentication & Admin Dashboard

Supabase is the **sole authentication provider** in V2. The template includes a custom admin dashboard at `/admin` built with Next.js. Users log in via Supabase Auth (email/password, or OAuth providers like Google/GitHub).

From the dashboard, users can:

1. **Manage content** — CRUD pages, projects, experiences (saved to Sanity via server-side API token)
2. **Build pages** — Form-based page builder with block reordering (saved to Sanity)
3. **Configure bot settings** — Model selection, system prompt, predefined prompts (saved to Supabase)
4. **Manage site settings** — Site name, navigation, footer, brand colors (saved to Sanity)
5. **Preview pages** — Next.js draft mode shows unpublished content

> [!NOTE]
> **Sanity is invisible to users.** They never see or interact with Sanity Studio or the Sanity Dashboard. All content management happens through the custom `/admin` dashboard. Under the hood, Next.js server actions use the `SANITY_API_TOKEN` to CRUD documents via Sanity's API.

### 1.3 Dashboard Architecture

```
/admin                         → Dashboard overview (stats, quick links)
/admin/pages                   → List all pages
/admin/pages/new               → Create new page
/admin/pages/[id]/edit         → Page builder (form-based blocks + reorder)
/admin/projects                → List/CRUD projects
/admin/projects/new            → Create new project
/admin/projects/[id]/edit      → Edit project
/admin/experiences             → List/CRUD experiences
/admin/experiences/new         → Create new experience
/admin/experiences/[id]/edit   → Edit experience
/admin/skills                  → List/CRUD skills
/admin/skills/new              → Create new skill
/admin/skills/[id]/edit        → Edit skill
/admin/social-links            → List/CRUD social links
/admin/social-links/new        → Create new social link
/admin/social-links/[id]/edit  → Edit social link
/admin/knowledge               → List/CRUD knowledge documents
/admin/knowledge/new           → Create new knowledge document
/admin/knowledge/[id]/edit     → Edit knowledge document
/admin/improve                 → Chat/AI Improvement interface
/admin/settings                → Settings overview
/admin/settings/profile        → Profile settings
/admin/settings/site           → Site settings (Sanity)
/admin/settings/bot            → Bot config (Supabase)
```

**Server-side CRUD flow:**

```
User action in /admin → Next.js Server Action → Sanity API (write token) → Content Lake
User action in /admin → Next.js Server Action → Supabase (service role)  → PostgreSQL
```

**Preview flow:**

```
User clicks "Preview" → Enable Next.js draft mode → Fetch draft documents from Sanity
→ Render page with unpublished content → User clicks "Publish" → Publish Sanity document
```

### 1.4 Template Prerequisites & Costs

| Service      | Free Tier Highlights                                                   | When Paid is Needed                                         |
| ------------ | ---------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Sanity**   | 1 project, 100k API requests/month, 500k assets, 10GB bandwidth        | High-traffic sites, multiple editors, large asset libraries |
| **Supabase** | 500MB DB, 2 projects, 50k monthly active users                         | Exceeding storage or needing backups                        |
| **Vercel**   | 100GB bandwidth, serverless functions                                  | Team features, enterprise domains                           |
| **AI APIs**  | Google AI Studio free tier (Gemini embeddings), OpenRouter pay-per-use | Depends on chat volume                                      |

## 2. Content Modeling: The "Page Builder" Approach

V2 uses a **dynamic block-based page builder**. Users add, remove, and reorder sections via the custom admin dashboard — no code changes required.

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

Global site configuration:

- `siteName` (String)
- `logo` (Sanity Image)
- `navigation` (Array of `{ label, link }` — link can reference a `page` document or be an external URL)
- `footer` (Object: `copyrightText`, `socialLinks[]`)
- `brandColors` (Object: `primary`, `secondary`, `accent` — hex values for CSS custom properties)

> [!NOTE]
> **Why Sanity for site settings instead of Supabase?**
> Sanity provides validation, revision history, and structured content modeling. Using Sanity as the content backend (even without Studio) gives developers a clean schema-driven API. Adding a new field = update schema + add form field in the dashboard UI.
>
> **Supabase retains** only technical settings: bot model selection, system prompts, and RAG configuration (managed via `/admin/settings`).

### 2.2 Page Builder Blocks

Blocks are organized into **General Purpose** and **Portfolio/Resume** categories.

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
- `noIndex` (Boolean — exclude from search engines)

### 2.4 Next.js Component Mapping

A dynamic catch-all route (`app/[[...slug]]/page.tsx`) fetches the `page` document from Sanity via GROQ. A `PageRenderer` component iterates over the `pageBuilder` array and maps each block's `_type` to a React component:

```tsx
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

1. **Trigger:** Content is created/updated/deleted via the admin dashboard (which writes to Sanity).
2. **Webhook:** Sanity fires a GROQ-powered webhook to `/api/webhooks/sanity`.
3. **Processing:**
   - Validate the webhook signature (`SANITY_WEBHOOK_SECRET`).
   - Parse the Sanity document (including Portable Text via `@portabletext/to-plain-text`) into a plain, context-rich text string.
   - Generate vector embeddings via the embedding API (e.g., `gemini-embedding-001`).
4. **Storage:** Upsert the embedding + metadata into the `knowledge_chunks` table.
5. **Idempotency:** Use Sanity `_id` + `_rev` as the idempotency key.

### 3.2 Fallback: On-the-Fly Staleness Check

If a webhook fails silently, the AI could answer from stale embeddings. As a safety net:

1. When a visitor opens the chat, the frontend fetches the latest Sanity document `_rev` values (lightweight query).
2. Compare against the `source_rev` stored in `knowledge_chunks`.
3. If any are stale, trigger a background re-sync for those documents only.
4. The chat proceeds immediately with whatever embeddings are available.

### 3.3 Unified Embedding Schema

Extend the existing `knowledge_chunks` table with source-tracking columns:

- `source` (Text): `'manual'` | `'sanity_auto'`
- `source_id` (Text): Sanity document `_id` (for auto-ingested) or `knowledge_documents.id` (for manual)
- `source_rev` (Text, Nullable): Sanity document `_rev` (for idempotency, null for manual docs)

### 3.4 Portable Text Parsing

Use `@portabletext/to-plain-text` to serialize blocks into embeddable strings. Additionally:

- Extract and include image `alt` text and captions.
- Expand document references to include referenced document titles/summaries.
- Handle custom block types gracefully.

## 4. Chat Integration

- The visitor-facing chat interface queries the unified `knowledge_chunks` table for vector search.
- The AI system prompt (stored in `bot_configs` in Supabase) instructs the model to rely primarily on retrieved Sanity context.
- Social links and contact info are fetched from the `siteSettings` Sanity document.

## 5. Environment Variables

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

## 6. Actionable Task Breakdown

This migration is executed in phases. Each phase is designed to be a self-contained, testable increment.

> [!TIP]
> **Before starting Phase 1:** Tag the current codebase as `v1.0.0` in Git so there's a clear rollback point.

### Phase 1a: Sanity Setup ✅

- [x] Install `next-sanity`, `sanity`, and `@sanity/image-url`.
- [x] Create the Sanity project (via `sanity init` or Sanity dashboard).
- [x] Configure Sanity CORS origins and API tokens.
- [x] Add Sanity env vars to `.env.local.example` and document in README.
- [x] Verify: Sanity API is accessible and can create test documents.

### Phase 1b: Schema Design ✅

- [x] Define the `page` document type with `pageBuilder` array field.
- [x] Define the `project` document type.
- [x] Define the `experience` document type.
- [x] Define the `siteSettings` singleton (site name, logo, navigation, footer, brand colors).
- [x] Define the `seo` object type and attach to `page`.
- [x] Implement 3 foundational blocks: `heroBlock`, `richTextBlock`, `ctaBlock`.
- [x] Verify: All document types and blocks are accessible via Sanity API.

### Phase 2: Next.js Page Renderer ✅

- [x] Create an isolated test route to fetch `page` data via GROQ.
- [x] Build the `PageRenderer` component to map `_type` to React components.
- [x] Scaffold foundational block components (Hero, RichText, CTA).
- [x] Generate Next.js `metadata` from the `seo` object on each page.
- [x] Verify: Creating a page with blocks renders correctly on the frontend.

### Phase 3: Studio & SDK Cleanup

> [!IMPORTANT]
> This phase cleans up the Sanity Studio / App SDK experiments before building the custom dashboard.

- [x] Remove embedded Studio route (`/studio`, catch-all `[[...tool]]/page.tsx`).
- [x] Remove `admin/` App SDK directory (if exists).
- [x] Remove `BotSettingsTool.tsx` and related Studio tool files.
- [x] Remove `@sanity/studio-secrets` dependency.
- [x] Remove `/api/admin/bot-config` API route (will be replaced by server action).
- [x] Keep: Sanity schemas, `next-sanity` client, GROQ queries, image utils.
- [x] Verify: `npm run build` succeeds with no dead imports.

### Phase 4: Admin Dashboard — Projects & Experiences CRUD

- [x] Ensure Supabase Auth (login/signup) works for dashboard access.
- [x] Protect `/admin/*` routes with auth middleware.
- [x] Build dashboard layout: sidebar nav, header with user info.
- [x] Build `/admin/projects` — list, create, edit, delete projects via Sanity API.
- [x] Build `/admin/experiences` — list, create, edit, delete experiences via Sanity API.
- [x] Implement image upload to Sanity Asset CDN via server action.
- [x] Verify: CRUD operations from dashboard create/update documents in Sanity.

### Phase 5: Admin Dashboard — Settings & UI Component Library

- [ ] Build `/settings/site` — site settings form (site name, navigation, footer, brand colors → saved to Sanity).
- [ ] Build bot config section — model, provider, system prompt, predefined prompts (→ saved to Supabase).
- [ ] Migrate `bot_configs` table if needed (ensure no Supabase Auth user_id dependency).
- [ ] Refactor generic form UI components (Image Upload, Array Builders for nested lists like socialLinks, Input with Validation, Rich Text Editor) into a reusable `admin/ui` library based on the inputs developed so far.
- [ ] Verify: Settings changes from dashboard reflect on the public site layout (Header, Footer, Navigation).

### Phase 6: Admin Dashboard — Page Builder

- [ ] Build `/admin/pages` — list all pages, create new page.
- [ ] Build `/admin/pages/[id]/edit` — form-based page builder using reusable UI components.
- [ ] Implement "Add Block" dropdown with block type selector.
- [ ] Build form for each core block type (Hero, RichText, CTA).
- [ ] Implement block reordering with `@dnd-kit/sortable`.
- [ ] Implement block removal.
- [ ] Implement Next.js draft mode for page preview.
- [ ] Verify: Page built in dashboard renders correctly on the frontend.

### Phase 7: Themeable Design System

- [ ] Implement CSS custom properties for brand colors, fonts, and spacing.
- [ ] Wire brand color values from `siteSettings` (fetched at layout-level) into CSS variables.
- [ ] Ensure all block components consume design tokens (no hardcoded colors).
- [ ] Verify: Changing brand colors in dashboard updates the site's look.

### Phase 8: Remaining Block Components

- [ ] Create and polish remaining block components: FeatureGrid, FAQ, Testimonial, ImageGallery, Embed, LogoCloud, Stats, ContactForm, ProjectGrid, ExperienceTimeline, Skills.
- [ ] Add corresponding forms in the page builder for each new block type.
- [ ] Verify: All block types are createable from dashboard and render on frontend.

### Phase 9: RAG Auto-Ingestion Pipeline

- [ ] Add `source`, `source_id`, and `source_rev` columns to `knowledge_chunks` table.
- [ ] Install `@portabletext/to-plain-text` for Portable Text serialization.
- [ ] Develop the `/api/webhooks/sanity` API route with signature verification.
- [ ] Implement idempotent embedding logic (check `_id` + `_rev`).
- [ ] Configure the webhook trigger in the Sanity project dashboard.
- [ ] Verify: Creating/updating content in dashboard triggers webhook and upserts embeddings.

### Phase 10: Chat RAG Integration & Staleness Check

- [ ] Update the chat API to use the unified `knowledge_chunks` table.
- [ ] Implement the on-the-fly staleness check on chat open.
- [ ] Refine the AI system prompt to reference dynamic Sanity content.
- [ ] Integrate chat interface into V2 layout — source bot name/avatar from `siteSettings`.
- [ ] Verify: Chat correctly answers questions about content created via dashboard.

### Phase 11: V1 Cleanup & Deprecation

- [ ] Remove old Supabase content tables: `projects`, `experiences`, `skills`, `social_links`, `profiles`.
- [ ] Remove server actions for deprecated tables (in `src/lib/actions/`).
- [ ] Remove old admin routes that duplicate new dashboard functionality.
- [ ] Remove Cloudinary dependencies (`src/lib/cloudinary.ts`, `src/lib/cloudinary-loader.ts`).
- [ ] Update `.agent/rules/*.md` and `specs/*.md` to reflect final V2 architecture.
- [ ] Verify: App builds cleanly, no dead imports or references to removed tables.

### Phase 12: Polish & Documentation

- [ ] End-to-end test: clone template → configure env → deploy to Vercel.
- [ ] Write template README with setup instructions for marketplace users.
- [ ] Update all spec files to match V2 final state.
- [ ] Update `.agent/rules/` to reflect V2 conventions.
