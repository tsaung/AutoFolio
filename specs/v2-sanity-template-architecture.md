# V2 Architecture: AI-Powered Headless CMS Template

This document outlines the architecture for the V2 iteration of the portfolio project. The project is transitioning from a hardcoded, single-tenant portfolio application into a **multi-purpose website template** powered by a headless CMS (Sanity) and an integrated AI assistant.

The core goal is to provide a "WordPress-like" experience where developers can clone the template and offer it as a productized service on marketplaces. End-users (e.g., SME owners) get a flexible, block-based visual page builder, multi-tenant content management capabilities (via Sanity roles), and an autonomous AI agent trained specifically on their dynamic content.

## 1. System Architecture Overview

The V2 stack relies on a "best-of-breed" decoupled approach:

*   **Frontend & API (Next.js App Router):** Acts as the presentation layer (rendering the visual page builder) and the orchestration layer (API routes for webhooks and AI).
*   **Content Management (Sanity Studio):** Embedded directly into the Next.js application (e.g., at `/studio`). It is the single source of truth for all structured content (Pages, Projects, Experiences, Blog Posts) and the schema definitions for the Page Builder.
*   **Database, Auth & Vector Search (Supabase):**
    *   **PostgreSQL + pgvector:** Stores the vector embeddings generated from Sanity content for the RAG pipeline.
    *   **Auth:** Handles global application authentication if needed outside of the CMS.
    *   **Settings:** Stores site-wide configuration (like the user's selected LLM model and AI system prompts).
*   **AI Provider (OpenRouter/Vercel AI SDK):** Powers the public-facing chat assistant and generates embeddings for the auto-ingestion pipeline.

## 2. Content Modeling: The "Page Builder" Approach

Instead of hardcoded pages, the template will use a dynamic block-based page builder. This allows users to add, remove, and reorder sections visually within Sanity Studio without modifying code.

### 2.1 Sanity Schemas

*   **`Page` Document:** Represents a routable page (e.g., Home, About, Services).
    *   `title` (String)
    *   `slug` (Slug)
    *   `pageBuilder` (Array of Block objects)
*   **UI Block Objects (The "Builder"):**
    *   `heroBlock`: Headline, subheadline, call-to-action buttons, background image.
    *   `projectGridBlock`: A reference to a list of `Project` documents to display in a grid.
    *   `experienceTimelineBlock`: A reference to `Experience` documents.
    *   `richTextBlock`: Standard portable text content.
    *   `testimonialBlock`: A carousel or grid of customer quotes.

### 2.2 Next.js Component Mapping

In Next.js, a dynamic catch-all route (e.g., `app/[slug]/page.tsx`) fetches the `Page` document from Sanity. A `PageRenderer` component iterates over the `pageBuilder` array and dynamically imports the corresponding React/Tailwind component based on the block's `_type`:

```tsx
// Conceptual Page Renderer
const blockComponents = {
  heroBlock: Hero,
  projectGridBlock: ProjectGrid,
  richTextBlock: RichText,
};

export function PageRenderer({ blocks }) {
  return blocks.map((block) => {
    const Component = blockComponents[block._type];
    return Component ? <Component key={block._key} data={block} /> : null;
  });
}
```

## 3. AI Auto-Ingestion Pipeline (RAG)

To ensure the visitor-facing AI assistant is always up-to-date with the latest content, an automated ingestion pipeline is required. The content in Sanity must be synced to Supabase as vector embeddings.

1.  **Trigger:** An editor creates, updates, or deletes a document (e.g., a `Project` or `Page`) in Sanity Studio.
2.  **Webhook:** Sanity fires a GROQ-powered webhook containing the updated document payload to a Next.js API route (e.g., `/api/webhooks/sanity`).
3.  **Processing:**
    *   The Next.js API route validates the webhook signature.
    *   It parses the document into plain, context-rich text.
    *   It calls the embedding API (e.g., OpenAI `text-embedding-3-small` via OpenRouter/OpenAI API) to generate a vector representation of the content.
4.  **Storage:** The API route upserts the embedding and metadata (Sanity Document ID, title, type) into the Supabase `pgvector` table (e.g., `sanity_embeddings`).
5.  **Retrieval:** When a visitor asks the AI chatbot a question, the system queries Supabase for the most relevant embeddings and passes that context to the LLM to generate a response.

## 4. Actionable Task Breakdown

This migration should be executed in phases to ensure stability and allow for incremental testing.

### Phase 1: Sanity Integration & Schema Foundation
*   [ ] Initialize `next-sanity` and embed Sanity Studio at `/studio` within the Next.js app.
*   [ ] Create the foundational Sanity schemas: `Project`, `Experience`, and the `Page` document.
*   [ ] Implement the basic Page Builder blocks (`heroBlock`, `richTextBlock`).
*   [ ] Configure Sanity CORS and API tokens.

### Phase 2: The Next.js Page Renderer
*   [ ] Create the dynamic catch-all route (`app/[...slug]/page.tsx` or similar) to fetch `Page` data via GROQ.
*   [ ] Build the `PageRenderer` component to map Sanity `_type` block schemas to UI components.
*   [ ] Scaffold the initial UI components (Hero, RichText, ProjectGrid) using Tailwind CSS and Shadcn UI.

### Phase 3: AI Auto-Ingestion Pipeline
*   [ ] Create the `sanity_embeddings` table in Supabase with vector support.
*   [ ] Develop the `/api/webhooks/sanity` API route in Next.js.
*   [ ] Implement signature verification to secure the webhook.
*   [ ] Write the logic to generate embeddings and upsert them into Supabase.
*   [ ] Configure the webhook trigger inside the Sanity project dashboard.

### Phase 4: AI Chatbot Integration
*   [ ] Update the visitor-facing chat interface to utilize the new `sanity_embeddings` table for vector search.
*   [ ] Refine the AI System Prompt (stored in Supabase settings) to instruct the model to rely primarily on the retrieved Sanity context.
*   [ ] Test the chat functionality against dynamically created page content.

### Phase 5: Cleanup & Admin UI Transition
*   [ ] Deprecate the legacy hardcoded database tables and custom `/admin` CRUD routes that are now handled by Sanity Studio.
*   [ ] Keep the `/admin/settings` route for Supabase-specific configurations (like AI model selection and global RAG settings).