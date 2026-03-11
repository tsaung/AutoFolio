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

V2 uses a **reusable block library + reference-based page builder**. Users create standalone block documents in the Block Library (`/admin/blocks`), then compose pages by picking, referencing, and reordering those blocks in the Page Builder (`/admin/pages/[id]/edit`). No code changes required.

### 2.1 Block Library Architecture

Blocks are **Sanity documents** (not inline objects). Each block document has a `name` field for identification in the library (e.g., "Homepage Hero", "Newsletter CTA"). The `page` document's `pageBuilder` array holds **references** to these block documents.

```
/admin/blocks (Block Library)              /admin/pages/[id]/edit (Page Builder)
┌──────────────────────────────┐           ┌──────────────────────────────┐
│ Create & edit standalone     │           │ Pick blocks from library     │
│ block DOCUMENTS              │ ──refs──▶ │ Drag & drop to reorder       │
│ (Hero, CTA, FAQ, Stats...)   │           │ pageBuilder: [ref, ref, ref] │
└──────────────────────────────┘           └──────────────────────────────┘
```

### 2.2 Core Sanity Document Types

#### `page` (Document)

Represents a routable page (e.g., Home, About, Services).

- `title` (String)
- `slug` (Slug)
- `seo` (Object — see §2.4)
- `pageBuilder` (Array of References to block documents)

#### `project` (Document)

Portfolio project showcase item, referenced by `projectGridBlock`.

- `title`, `slug`, `description`, `image` (Sanity Image), `liveUrl`, `repoUrl`, `tags[]`, `status` (published/draft/archived), `sortOrder`

#### `experience` (Document)

Work history entry, referenced by `experienceTimelineBlock`.

- `title`, `company`, `location`, `startDate`, `endDate`, `description` (Portable Text), `sortOrder`

#### `navigation` (Document)

Represents a reusable navigation menu (e.g., Main Menu, Footer Menu). Supports nested items.

- `name` (String — Internal identifier)
- `items` (Array of `navigationItem` objects)

#### `navigationItem` (Object)

A recursive object for building menu structures.

- `label` (String)
- `link` (Array: Reference to `page` or External URL object)
- `children` (Array of `navigationItem` — supports up to 3 levels of nesting)

#### `siteSettings` (Singleton Document)

Global site configuration:

- `siteName` (String)
- `logo` (Sanity Image)
- `mainNavigation` (Reference to a `navigation` document)
- `footerNavigation` (Reference to a `navigation` document)
- `footer` (Object: `copyrightText`, `socialLinks[]`)
- `brandColors` (Object: `primary`, `secondary`, `accent` — hex values for CSS custom properties)

> [!NOTE]
> **Why Sanity for site settings instead of Supabase?**
> Sanity provides validation, revision history, and structured content modeling. Using Sanity as the content backend (even without Studio) gives developers a clean schema-driven API. Adding a new field = update schema + add form field in the dashboard UI.
>
> **Supabase retains** only technical settings: bot model selection, system prompts, and RAG configuration (managed via `/admin/settings`).

### 2.3 Page Builder Block Types

All blocks are **Sanity document types** with a `name` field for library identification. They are organized into **General Purpose** and **Portfolio/Resume** categories.

#### General Purpose Blocks

| Block Type          | Schema Type  | Description                                                                     |
| ------------------- | ------------ | ------------------------------------------------------------------------------- |
| `heroBlock`         | `document`   | Headline, subheadline, CTA buttons, background image                            |
| `richTextBlock`     | `document`   | Portable Text content (paragraphs, lists, links, inline images)                 |
| `imageGalleryBlock` | `document`   | Grid or masonry image gallery with lightbox                                     |
| `ctaBlock`          | `document`   | Call-to-action banner with heading, text, and button                            |
| `featureGridBlock`  | `document`   | Icon + title + description grid (great for services, features, benefits)        |
| `faqBlock`          | `document`   | Accordion-style FAQ section                                                     |
| `testimonialBlock`  | `document`   | Carousel or grid of customer/client quotes                                      |
| `embedBlock`        | `document`   | YouTube, Vimeo, Calendly, or custom embed code                                  |
| `logoCloudBlock`    | `document`   | Client/partner/tech logo strip                                                  |
| `statsBlock`        | `document`   | Key metrics/numbers showcase (e.g., "10+ Years", "50+ Projects")                |
| `contactFormBlock`  | `document`   | Embeddable contact form (submissions handled via API route or external service) |

#### Portfolio / Resume Blocks

| Block Type                | Schema Type  | Description                                                                          |
| ------------------------- | ------------ | ------------------------------------------------------------------------------------ |
| `projectGridBlock`        | `document`   | References a list of `project` documents, displayed as cards (mode: all or manual)   |
| `experienceTimelineBlock` | `document`   | References `experience` documents in a vertical timeline (mode: all or manual)       |
| `skillsBlock`             | `document`   | Grouped skill display with proficiency indicators (mode: all or manual)              |

### 2.4 SEO Schema

Every `page` document includes an `seo` object:

- `metaTitle` (String — falls back to `page.title` if empty)
- `metaDescription` (Text)
- `ogImage` (Sanity Image — for social sharing)
- `noIndex` (Boolean — exclude from search engines)

### 2.5 Next.js Component Mapping

A dynamic catch-all route (`app/[[...slug]]/page.tsx`) fetches the `page` document from Sanity via GROQ. The `pageBuilder` array contains **references**, so the GROQ query must **dereference** them:

```groq
*[_type == "page" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  seo,
  pageBuilder[]->{
    _id,
    _type,
    name,
    ...
  }
}
```

A `PageRenderer` component iterates over the dereferenced blocks and maps each block's `_type` to a React component:

```tsx
const blockComponents: Record<string, React.ComponentType<{ data: any }>> = {
  heroBlock: Hero,
  richTextBlock: RichText,
  projectGridBlock: ProjectGrid,
  ctaBlock: CallToAction,
  faqBlock: FAQ,
  statsBlock: Stats,
  embedBlock: Embed,
  featureGridBlock: FeatureGrid,
  testimonialBlock: Testimonial,
  imageGalleryBlock: ImageGallery,
  logoCloudBlock: LogoCloud,
  contactFormBlock: ContactForm,
  experienceTimelineBlock: ExperienceTimeline,
  skillsBlock: Skills,
};

export function PageRenderer({ blocks }: { blocks: SanityBlock[] }) {
  return blocks.map((block) => {
    const Component = blockComponents[block._type];
    return Component ? <Component key={block._id} data={block} /> : null;
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

