# V2 Content Model & Block Library

This document outlines the Sanity content schemas and the Block Library architecture used in V2.

## 1. Content Modeling Approach

V2 uses a **reusable block library + reference-based page builder**. Users create standalone block documents in the Block Library (`/admin/blocks`), then compose pages by picking, referencing, and reordering those blocks in the Page Builder (`/admin/pages/[id]/edit`). No code changes required.

### 1.1 Block Library Architecture

Blocks are **Sanity documents** (not inline objects). Each block document has a `name` field for identification in the library (e.g., "Homepage Hero", "Newsletter CTA"). The `page` document's `pageBuilder` array holds **references** to these block documents.

```
/admin/blocks (Block Library)              /admin/pages/[id]/edit (Page Builder)
┌──────────────────────────────┐           ┌──────────────────────────────┐
│ Create & edit standalone     │           │ Pick blocks from library     │
│ block DOCUMENTS              │ ──refs──▶ │ Drag & drop to reorder       │
│ (Hero, CTA, FAQ, Stats...)   │           │ pageBuilder: [ref, ref, ref] │
└──────────────────────────────┘           └──────────────────────────────┘
```

## 2. Core Sanity Document Types

#### `page` (Document)
Represents a routable page (e.g., Home, About, Services).
- `title` (String)
- `slug` (Slug)
- `seo` (Object — see SEO Schema below)
- `pageBuilder` (Array of References to block documents)

#### `project` (Document)
Portfolio project showcase item.
- `title`, `slug`, `description`, `image` (Sanity Image), `liveUrl`, `repoUrl`, `tags[]`, `status` (published/draft/archived), `sortOrder`

#### `experience` (Document)
Work history entry.
- `title`, `company`, `location`, `startDate`, `endDate`, `description` (Portable Text), `sortOrder`

#### `navigation` (Document)
Represents a reusable navigation menu. Supports nested items.
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
> Sanity provides validation, revision history, and structured content modeling. Using Sanity as the content backend gives developers a clean schema-driven API. Adding a new field = update schema + add form field in the dashboard UI.
> **Supabase retains** only technical settings: bot model selection, system prompts, and RAG configuration.

### 2.1 SEO Schema
Every `page` document includes an `seo` object:
- `metaTitle` (String — falls back to `page.title` if empty)
- `metaDescription` (Text)
- `ogImage` (Sanity Image — for social sharing)
- `noIndex` (Boolean — exclude from search engines)

## 3. Page Builder Block Types

All blocks are **Sanity document types** with a `name` field for library identification.

### General Purpose Blocks
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

### Portfolio / Resume Blocks
| Block Type                | Schema Type  | Description                                                                          |
| ------------------------- | ------------ | ------------------------------------------------------------------------------------ |
| `projectGridBlock`        | `document`   | References a list of `project` documents, displayed as cards (mode: all or manual)   |
| `experienceTimelineBlock` | `document`   | References `experience` documents in a vertical timeline (mode: all or manual)       |
| `skillsBlock`             | `document`   | Grouped skill display with proficiency indicators (mode: all or manual)              |