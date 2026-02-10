# 002-Setup-Auth-DB

## 1. Context
- **Goal:** Implement basic authentication (Email/Password) and the initial database schema (profiles table) using Supabase.
- **Why:** To enable user accounts, secure the admin area, and prepare the database for future RAG features.
- **Scope:**
    - Supabase Auth integration (Email/Password).
    - `profiles` table schema and RLS policies.
    - Server-side Supabase client utilities.
    - Login, Forgot Password, and Update Password pages.
    - Excludes: Social Auth (Google, GitHub), Signup page (Invite-only/Manual), full RAG schema, and extensive UI polish.

## 2. Strategy
- **Architecture:** Next.js App Router with `@supabase/ssr` for auth handling (Server Components, Middleware, Server Actions).
- **Data Model:**
    - `profiles` table: `id` (FK to auth.users), `username`, `full_name`, `avatar_url`, `website`, `updated_at`.
- **API Changes:**
    - New `auth/callback` route handler.
    - Server Actions for `signIn`, `signOut`, `resetPassword`, `updatePassword`.

## 3. Implementation Plan
- [x] **Step 1:** Create SQL migration for `profiles` table and triggers.
- [x] **Step 2:** Implement `src/lib/db/server.ts` and `src/lib/db/middleware.ts`.
- [x] **Step 3:** Update `src/middleware.ts` to refresh sessions.
- [x] **Step 4:** Create Auth UI pages (`/login`, `/forgot-password`, `/update-password`).
- [x] **Step 5:** Create Auth Server Actions.
- [x] **Step 6:** Verify local and hosted sync (manual check instructions).

## 4. Verification Plan
- **Automated Tests:** N/A for this phase.
- **Manual Verification:**
    - [x] Run `supabase db reset` locally to verify migrations apply cleanly.
    - [x] Log in with valid credentials -> Redirect to dashboard.
    - [x] Log in with invalid credentials -> Show error.
    - [x] Forgot Password flow (request reset link).
