---
description: Technology stack guidelines and coding conventions.
---

# Tech Stack & Conventions

## 1. Tech Stack Preferences

- **Framework:** Next.js (App Router) - prefer Server Components.
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS + Shadcn UI
  - **IMPORTANT:** Use `npx shadcn@latest add` - DO NOT install primitives directly.
  - `src/components/ui/` is reserved for Shadcn primitives only. Custom reusable components go in `src/components/` (e.g., `src/components/searchable-select.tsx`).
- **State Management:** Server Stats preferred; React Context for global UI state only.
- **Testing:** Vitest for logic and components, Playwright for E2E.

## 2. Coding Standards

- **Naming:**
  - Directories: `kebab-case` (e.g., `components/ui/button.tsx`)
  - Components: `PascalCase` (e.g., `UserProfile.tsx`)
  - Functions/Vars: `camelCase`
- **Exports:** Prefer **Named Exports** over Default Exports for better refactoring support.
- **Types:** Explicitly define return types for significant functions.
- **Conventions:**
  - `middleware.ts` is renamed to `proxy.ts` (Next.js 16+ convention).
  - `proxy.ts` must export a default function named `proxy`.
