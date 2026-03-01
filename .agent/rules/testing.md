---
description: Testing frameworks and commands to execute them.
---

# Testing Commands

## 1. Unit & Component Tests (Vitest)

- **Run all:** `npm run test` or `npx vitest run`
- **Watch mode:** `npm run test:watch`

## 2. End-to-End Tests (Playwright)

- **Run all:** `npm run test:e2e`
- **UI Mode:** `npx playwright test --ui`

## 3. General Rules

- Tests must be written before logic implementation (TDD).
- If strictly visual, write a clear Verification Script (manual steps or Playwright).
- The Code, the Tests, and the Specs MUST NEVER diverge.
