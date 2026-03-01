---
description: The mandatory Test-Driven Development workflow for AI agents working in BotFolio
---

# /tdd-workflow

This workflow enforces the "Specs & Tests are Truth" philosophy. Follow these steps sequentially when building features or adding logic to BotFolio.

## Prerequisites

- Read `todo.md` (Root) to identify the task.

## Workflow Steps

1. **Context & Analysis**
   - Read relevant files in `specs/` to understand the current system behavior and discover where the new feature fits or what needs to change.

2. **Update Specs (The "Plan")**
   - If the task introduces a new feature or changes behavior, update the relevant markdown file in `specs/` _first_.
   - This serves as your "Plan" and ensures documentation never rots.

3. **Test-Driven Development (TDD) - Red Phase**
   - **Logic/Backend:** Write a **failing test** (Unit or Integration) in `__tests__/` that asserts the new behavior defined in the spec.
   - **UI/Frontend:** Prefer standard TDD with component tests. If strictly visual, write a clear **Verification Script**.
   - **Action:** Run the test to confirm it fails.

4. **Implementation - Green Phase**
   - Implement the minimum amount of code required to make the test pass.
   - Do not over-engineer. Solve the immediate problem defined by the test.

5. **Refactor & Verify**
   - Clean up code and test structure. Ensure alignment with BotFolio project conventions.
   - Verify that all tests pass (`npx vitest run`).
   - Final constraint check: The Code must match the Test; The Test must match the Spec.
