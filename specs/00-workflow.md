# AI-Driven TDD Workflow

**Status:** Active
**Last Updated:** 2026-02-10

This document defines the mandatory development workflow for all contributors (Human and AI) to the AutoFolio project. It enforces the "Specs & Tests are Truth" philosophy.

## 1. Core Philosophy

### "Specs & Tests are Truth"
- **Specs (`specs/`)**: The Single Source of Truth for *what* the system should do.
- **Tests (`__tests__`, `*.test.ts`)**: The rigorous verification that the system *does* what the specs say.
- **Code (`src/`)**: Implementation details that simply satisfy the tests and specs.

### The Golden Rule
**Code, Tests, and Specs must NEVER diverge.**
If you change the code, you **MUST** update the Specs and the Tests to match.

## 2. The 5-Step Workflow

### Sync Strategy
- **Cloud Agents:** Use `scripts/sync-dev.sh` (Merge) to ensure safety.
- **Local (Humans):** Use `scripts/sync-dev.sh --rebase` or manual rebase to keep history clean.


Every task, feature, or bug fix must follow this cycle:

### Step 1: Context & Analysis
- **Input:** User request or `todo.md` item.
- **Action:** Read relevant files in `specs/` to understand the current system behavior.
- **Goal:** Understand *where* the new feature fits and *what* needs to change.

### Step 2: Update Specs (The "Plan")
- **Action:** Update the relevant markdown file in `specs/` (or create a new one) to describe the *intended* new behavior.
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
- **Styling:** Tailwind CSS + Shadcn UI
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
