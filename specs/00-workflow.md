# AI-Driven TDD Workflow

**Status:** Active
**Last Updated:** 2026-02-12

This document defines the mandatory development workflow for all contributors (Human and AI) to the BotFolio project. It enforces the "Specs & Tests are Truth" philosophy.

## 1. Core Philosophy

### "Specs & Tests are Truth"

- **Specs (`specs/`)**: The Single Source of Truth for _what_ the system should do.
- **Tests (`__tests__`, `*.test.ts`)**: The rigorous verification that the system _does_ what the specs say.
- **Code (`src/`)**: Implementation details that simply satisfy the tests and specs.

### The Golden Rule

**Code, Tests, and Specs must NEVER diverge.**
If you change the code, you **MUST** update the Specs and the Tests to match.

## 2. The 5-Step Workflow

### Integration Strategy

- **Manual Merging:** All merging and conflict resolution is a manual responsibility of the Human Lead.
- **No Automated Sync:** Agents should focus on their specific task without syncing `development` automatically.

Every task, feature, or bug fix must follow this cycle:

### Step 1: Context & Analysis

- **Input:** User request or `todo.md` item.
- **Action:** Read relevant files in `specs/` to understand the current system behavior.
- **Goal:** Understand _where_ the new feature fits and _what_ needs to change.

### Step 2: Update Specs (The "Plan")

- **Action:** Update the relevant markdown file in `specs/` (or create a new one) to describe the _intended_ new behavior.
- **Why:** This forces you to think through the design before writing code ("Thinking before Coding"). It also prevents documentation rot.
- **Output:** A modified spec file that describes the future state.

### Step 3: Test-Driven Development (TDD)

- **Logic/Backend:** Write a **failing test** (Unit or Integration) that asserts the new behavior defined in the spec.
- **UI/Frontend:**
  - Prefer standard TDD with component tests (Vitest/React Testing Library).
  - If strictly visual, write a clear **Verification Script** (manual steps or Playwright) in the PR/Commit message.
- **Action:** Run the test to confirm it fails (Red).

### Step 4: Implementation

- **Action:** Write the minimum amount of code required to make the test pass (Green).
- **Constraint:** Do not over-engineer. Solve the immediate problem defined by the test.

### Step 5: Refactor & Verify

- **Action:** Clean up the code. Ensure it aligns with project conventions (see below).
- **Verify:** Run **ALL** tests to ensure no regressions.
- **Check:** Does the Code match the Test? Does the Test match the Spec?

## 3. Tech Stack & Conventions

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS + Shadcn UI (Use `npx shadcn@latest add` - DO NOT install primitives directly)
- **Database:** Supabase
- **State Management:** Server Stats preferred; React Context for global UI state only.
- **Testing:** Vitest (Logic/Components), Playwright (E2E).

### Coding Standards

- **Naming:**
  - Directories: `kebab-case` (e.g., `components/ui/button.tsx`)
  - Components: `PascalCase` (e.g., `UserProfile.tsx`)
  - Functions/Vars: `camelCase`
- **Exports:** Prefer **Named Exports** over Default Exports for better refactoring support.
- **Types:** Explicitly define return types for significant functions.

## 4. Running Tests

### Unit & Component Tests (Vitest)

- **Run all:** `npm run test`
- **Watch mode:** `npm run test:watch`

### End-to-End Tests (Playwright)

- **Run all:** `npm run test:e2e`
- **UI Mode:** `npx playwright test --ui`
