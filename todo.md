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

### Phase 1a: Sanity Setup & Studio Embedding ✅

- [x] Git baseline (`v1.2.0` tag)
- [x] Install `next-sanity`, `@sanity/image-url`
- [x] Embed Sanity Studio at `/studio`
- [x] Configure env vars + CORS
- [x] Verify Studio loads

### Phase 1b: Schema Design

- [ ] `page` document (with `pageBuilder` array)
- [ ] `project` document
- [ ] `experience` document
- [ ] `siteSettings` singleton (site name, logo, nav, footer, brand colors)
- [ ] `seo` object type (attached to `page`)
- [ ] Foundational blocks: `heroBlock`, `richTextBlock`, `ctaBlock`

### Phase 2: Next.js Page Renderer

- [ ] Dynamic catch-all route (`app/[[...slug]]/page.tsx`)
- [ ] `PageRenderer` component (block → React component mapping)
- [ ] All General Purpose block components
- [ ] Portfolio block components
- [ ] Fetch `siteSettings` for nav/footer
- [ ] Generate `metadata` from `seo` object

### Phase 2.5: Themeable Design System

- [ ] CSS custom properties for brand colors, fonts, spacing
- [ ] Wire `siteSettings` brand colors → CSS variables
- [ ] All blocks consume design tokens (no hardcoded colors)

### Phase 3: RAG Auto-Ingestion Pipeline

- [ ] Extend `knowledge_chunks` with `source`, `source_id`, `source_rev`
- [ ] `/api/webhooks/sanity` route with signature verification
- [ ] Idempotent embedding logic (`_id` + `_rev`)
- [ ] Portable Text parsing (`@portabletext/to-plain-text`)

### Phase 4: Chat Integration & Staleness Check

- [ ] Unified `knowledge_chunks` vector search
- [ ] On-the-fly staleness check on chat open
- [ ] Social links / contact info from Sanity `siteSettings`
- [ ] Refined AI system prompt

### Phase 5: Cleanup & Deprecation

- [ ] **Drop Supabase Auth** entirely (Sanity handles auth)
- [ ] **Remove admin routes:** `/admin/*`, `/dashboard`, login/signup flows
- [ ] **Remove Supabase tables:** `projects`, `experiences`, `skills`, `social_links`, `profiles`
- [ ] **Remove server actions:** All CRUD actions for deprecated tables
- [ ] **Remove:** Cloudinary dependencies
- [ ] **Retain:** `bot_configs`, `knowledge_documents`, `knowledge_chunks`, `/admin/settings` (bot config only)
- [ ] Update `.agent/rules/` and `specs/` for V2

### Phase 6: Live Preview & Draft Support

- [ ] `next-sanity` preview mode
- [ ] Sanity Presentation tool / `@sanity/visual-editing`
- [ ] Draft/published toggle

### Phase 7: Polish & Documentation

- [ ] End-to-end template test (clone → setup → deploy)
- [ ] Template README for marketplace users
- [ ] Update all spec files to V2 final state

## Post-Migration

- [ ] Vercel Analytics integration
- [ ] Generative UI Widgets (streamUI)

## V3 — Auth & Permissions (Planned)

- [ ] **Granular Roles:** Implement `superadmin`, `admin`, and `public` roles (e.g., stored in `profiles` or `auth.users` metadata).
- [ ] **Admin User Management:** Build a user management panel in the dashboard for `superadmin` to invite and manage other `admin` users.
- [ ] **Public Signup/Login:** Create a public registration flow (`/signup`, `/login`) for visitors to access the AI chat (to limit usage volume).
- [ ] **Chat Access Control:** Protect the frontend public chat behind the new public user authentication.
- [ ] **Supabase Initial Setup:** Document the manual process for creating the first `superadmin` user directly in the Supabase Studio interface.
