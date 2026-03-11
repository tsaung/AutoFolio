# BotFolio Tasks

> **Version:** 2.0
> **Last Updated:** 2026-03-03

## V1 — Complete ✅

- [x] Authentication (Email/Password, Supabase Auth)
- [x] Admin Dashboard (sidebar, protected routes)
- [x] Profile Settings (identity, context fields)
- [x] Bot Settings (model, prompt, suggestions)
- [x] Knowledge Base (CRUD, auto-chunking, embedding)
- [x] RAG Pipeline (gemini-embedding-001, pgvector retrieval)
- [x] Public Chat (streaming AI, markdown, typing indicator)
- [x] Portfolio CMS (Projects, Experiences, Skills, Social Links)
- [x] Visitor Portfolio (Hero, Projects Grid, Timeline, Skills Grid)
- [x] Floating Chat (Sheet-based FAB)
- [x] Portfolio → RAG Sync (auto-sync via `after()`)
- [x] Social Links in Chat (queried at chat time)
- [x] Theme Switcher (Light/Dark/System)
- [x] Migration Consolidation (single V1 schema)
- [x] Deployment Guide (DEPLOY.md)

## V2 Migration — In Progress 🚧

> **Architecture:** Sanity (CMS + Auth + Dashboard) + Supabase (vectors + bot configs) + Next.js (frontend + API)


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

- [x] Build `/settings/site` — site settings form (site name, navigation, footer, brand colors → saved to Sanity).
- [x] Build bot config section — model, provider, system prompt, predefined prompts (→ saved to Supabase).
- [x] Migrate `bot_configs` table if needed (ensure no Supabase Auth user_id dependency).
- [ ] Refactor generic form UI components (Image Upload, Array Builders for nested lists like socialLinks, Input with Validation, Rich Text Editor) into a reusable `admin/ui` library based on the inputs developed so far.
- [x] Verify: Settings changes from dashboard reflect on the public site layout (Header, Footer, Navigation).

### Phase 6: Block Library + Page Builder (Reusable Blocks Architecture)

> [!IMPORTANT]
> Blocks are **Sanity documents** (not inline objects). The Page Builder composes pages by referencing blocks from the library.

#### Session 1: Schema Migration + Simple Blocks

- [ ] Migrate `heroBlock`, `ctaBlock`, `richTextBlock` from `type: "object"` to `type: "document"` with `name` field.
- [ ] Create new document schemas: `statsBlock`, `embedBlock`, `faqBlock`, `featureGridBlock`.
- [ ] Update `page.ts` `pageBuilder` to use references: `{ type: "reference", to: [...all block types] }`.
- [ ] Refactor `lib/actions/blocks.ts` to be generic (handle any block type).
- [ ] Update TypeScript types and GROQ queries for dereferencing.
- [ ] Verify: `npm run build` succeeds.

#### Session 2: Block Library UI — Simple + Medium Block Forms

- [ ] Refactor monolithic `block-form.tsx` into per-type form components under `components/admin/blocks/forms/`.
- [ ] Create form components with Zod validation: `CtaBlockForm`, `RichTextBlockForm`, `StatsBlockForm`, `EmbedBlockForm`, `FaqBlockForm`, `FeatureGridBlockForm`.
- [ ] Update `/admin/blocks/new` type picker with all new block types.
- [ ] Update `/admin/blocks` list page to display all block types.
- [ ] Verify: Can create and edit each block type from the library UI.

#### Session 3: Block Library UI — Complex + Collection Blocks

- [ ] Create forms: `HeroBlockForm` (image upload + buttons), `ImageGalleryBlockForm`, `ContactFormBlockForm`, `LogoCloudBlockForm`, `TestimonialBlockForm`.
- [ ] Create collection block forms: `ProjectGridBlockForm`, `ExperienceTimelineBlockForm`, `SkillsBlockForm` (with reference pickers).
- [ ] Create reusable `SanityReferencePicker` component.
- [ ] Verify: Can create and edit all block types including image uploads and references.

#### Session 4: Page Builder — Reference-Based Composition

- [ ] Replace inline "Add Block" with a "Pick from Library" modal/drawer.
- [ ] Display block references as compact cards (name + type) instead of inline forms.
- [ ] Keep dnd-kit drag & drop for reordering references.
- [ ] Update `updatePageBlocks` server action to save reference arrays.
- [ ] Update GROQ query in `[[...slug]]/page.tsx` to dereference blocks with `->>`.
- [ ] Remove old inline `block-forms/` directory.
- [ ] Verify: Can pick blocks, reorder, save, and render on frontend.

#### Session 5: Frontend Block Renderers

- [ ] Create renderers: `StatsBlock`, `EmbedBlock`, `FaqBlock`, `FeatureGridBlock`, `LogoCloudBlock`, `TestimonialBlock`, `ImageGalleryBlock`, `ContactFormBlock`.
- [ ] Update existing renderers (Hero, CTA, RichText, ProjectGrid, ExperienceTimeline, Skills) for document-based data.
- [ ] Update `PageRenderer` component map for all 14 block types.
- [ ] Verify: Test page with every block type renders correctly.

#### Session 6: Page Builder Inline Quick-Create (Optional Enhancement)

- [ ] Add "Quick Create" tab to page builder's block picker modal.
- [ ] Embed library form components inline in the page builder.
- [ ] Quick-created blocks auto-save as documents and insert as references.
- [ ] Implement Next.js draft mode for page preview.
- [ ] Verify: Both workflows work — library-first and inline quick-create.

### Phase 7: Themeable Design System

- [ ] Implement CSS custom properties for brand colors, fonts, and spacing.
- [ ] Wire brand color values from `siteSettings` (fetched at layout-level) into CSS variables.
- [ ] Ensure all block components consume design tokens (no hardcoded colors).
- [ ] Verify: Changing brand colors in dashboard updates the site's look.

### Phase 8: RAG Auto-Ingestion Pipeline

- [ ] Add `source`, `source_id`, and `source_rev` columns to `knowledge_chunks` table.
- [ ] Install `@portabletext/to-plain-text` for Portable Text serialization.
- [ ] Develop the `/api/webhooks/sanity` API route with signature verification.
- [ ] Implement idempotent embedding logic (check `_id` + `_rev`).
- [ ] Configure the webhook trigger in the Sanity project dashboard.
- [ ] Verify: Creating/updating content in dashboard triggers webhook and upserts embeddings.

### Phase 9: Chat RAG Integration & Staleness Check

- [ ] Update the chat API to use the unified `knowledge_chunks` table.
- [ ] Implement the on-the-fly staleness check on chat open.
- [ ] Refine the AI system prompt to reference dynamic Sanity content.
- [ ] Integrate chat interface into V2 layout — source bot name/avatar from `siteSettings`.
- [ ] Verify: Chat correctly answers questions about content created via dashboard.

### Phase 10: V1 Cleanup & Deprecation

- [ ] Remove old Supabase content tables: `projects`, `experiences`, `skills`, `social_links`, `profiles`.
- [ ] Remove server actions for deprecated tables (in `src/lib/actions/`).
- [ ] Remove old admin routes that duplicate new dashboard functionality.
- [ ] Remove Cloudinary dependencies (`src/lib/cloudinary.ts`, `src/lib/cloudinary-loader.ts`).
- [ ] Update `.agent/rules/*.md` and `specs/*.md` to reflect final V2 architecture.
- [ ] Verify: App builds cleanly, no dead imports or references to removed tables.

### Phase 11: Polish & Documentation

- [ ] End-to-end test: clone template → configure env → deploy to Vercel.
- [ ] Write template README with setup instructions for marketplace users.
- [ ] Update all spec files to match V2 final state.
- [ ] Update `.agent/rules/` to reflect V2 conventions.

## Post-Migration

- [ ] Vercel Analytics integration
- [ ] Generative UI Widgets (streamUI)

## V3 — Auth & Permissions (Planned)

- [ ] **Granular Roles:** Implement `superadmin`, `admin`, and `public` roles (e.g., stored in `profiles` or `auth.users` metadata).
- [ ] **Admin User Management:** Build a user management panel in the dashboard for `superadmin` to invite and manage other `admin` users.
- [ ] **Public Signup/Login:** Create a public registration flow (`/signup`, `/login`) for visitors to access the AI chat (to limit usage volume).
- [ ] **Chat Access Control:** Protect the frontend public chat behind the new public user authentication.
- [ ] **Supabase Initial Setup:** Document the manual process for creating the first `superadmin` user directly in the Supabase Studio interface.
