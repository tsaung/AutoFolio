# V2 Authentication & Setup

This document covers the Admin Dashboard architecture, Supabase integration, and the Setup Wizard.

## 1. Authentication & Admin Dashboard

Supabase is the **sole authentication provider** in V2. The template includes a custom admin dashboard at `/admin` built with Next.js. Users log in via Supabase Auth (email/password).

From the dashboard, users can:

1. **Manage content** — CRUD pages, projects, experiences (saved to Sanity via server-side API token)
2. **Build pages** — Form-based page builder with block reordering (saved to Sanity)
3. **Configure bot settings** — Model selection, system prompt, predefined prompts (saved to Supabase)
4. **Manage site settings** — Site name, navigation, footer, brand colors (saved to Sanity)
5. **Preview pages** — Next.js draft mode shows unpublished content

> [!NOTE]
> **Sanity is invisible to users.** They never see or interact with Sanity Studio or the Sanity Dashboard. All content management happens through the custom `/admin` dashboard.

### 1.1 Dashboard Architecture Routes

```
/admin                         → Dashboard overview (stats, quick links)
/admin/pages                   → List all pages
/admin/pages/new               → Create new page
/admin/pages/[id]/edit         → Page builder (form-based blocks + reorder)
/admin/projects                → List/CRUD projects
... (other portfolio CRUD routes)
/admin/knowledge               → List/CRUD knowledge documents
/admin/settings                → Settings overview
/admin/settings/site           → Site settings (Sanity)
/admin/settings/bot            → Bot config (Supabase)
```

**Server-side CRUD flow:**

```
User action in /admin → Next.js Server Action → Sanity API (write token) → Content Lake
User action in /admin → Next.js Server Action → Supabase (service role)  → PostgreSQL
```

## 2. Installation Setup Wizard

To solve poor installation UX requiring manual CLI commands, V2 includes an automated web-based Setup Wizard.

### 2.1 UX Flow (`/setup`)

1. **Welcome & Environment Check:** A landing page detects if required variables (`NEXT_PUBLIC_SUPABASE_URL`, etc.) are present.
2. **Database Initialization:** A Next.js API route automatically executes Supabase SQL migrations and sets up the pgvector extension via the Service Role key.
3. **Admin Registration:** Form to create the first Superadmin account in Supabase Auth.
4. **Site & Bot Configuration:** Prompt for site name, user profession, and preferred AI model.
5. **Completion & Redirect:** Redirects to the `/admin/dashboard`.

The `/setup` route should only be accessible if the database is uninitialized or empty.