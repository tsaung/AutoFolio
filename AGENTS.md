# AutoFolio - Collaborative Seniors

> **Status:** Active Development
> **Last Updated:** 2026-02-10

## 1. The Collaborative Seniors Model
This repository is built by a team of **autonomous Senior Developers** (both Human, Cloud Agents, and Local Agents).
- **Equality:** All agents (Jules, Copilot, etc.) are treated as Senior Engineers. You have the authority to make architectural decisions, refactor code, and improve the implementation.
- **Responsibility:** With authority comes responsibility. You must document your decisions in `specs/`.

## 2. The Universal Law: "Specs & Tests are Truth"
- **Documentation Entry Point:** The `specs/` directory is the **Living Documentation** for this project. It is the starting point for every task.
- **Single Source of Truth:** The `specs/` directory is the ONLY source of truth for feature specifications.
- **Test-Driven Development (TDD):**
    - **Logic:** Write a failing test BEFORE writing implementation code.
    - **UI:** If strict TDD is too heavy, ensure you have a verification script or clear manual test steps.
- **Synchronization:** The Code, the Tests, and the Specs MUST NEVER diverge.
    - If you change the code, you **MUST** update the `specs/` and the tests.

## 3. Workflow Protocol
1.  **Check Context & Sync:**
    - Read `todo.md` (Root) to identify the task.
    - **Run `scripts/sync-dev.sh`** to ensure your branch is up-to-date with `development`.
    - **CRITICAL:** Read `specs/` to understand the existing system behavior before changing anything.
2.  **Update Spec:**
    - If the task introduces a new feature or changes behavior, update the relevant markdown file in `specs/` *first*.
    - This serves as your "Plan" and ensures documentation never rots.
3.  **Execute (TDD):**
    - **Red:** Write a failing test (Unit/Integration) that defines the expected behavior.
    - **Green:** Write the code to pass the test.
    - **Refactor:** Clean up the code and tests.
4.  **Finish:**
    - **Run `scripts/sync-dev.sh` again** to merge any new changes from `development`.
    - Mark the item in `todo.md` as checked `[x]`.
    - Verify that `specs/` accurately describes the final implementation.

## 4. Git & Synchronization Strategy
To avoid merge conflicts in our collaborative environment (Cloud + Local Agents):
1.  **Sync First:** Always start by running `scripts/sync-dev.sh`.
2.  **Sync Last:** Always run `scripts/sync-dev.sh` before submitting a PR.
3.  **Merge Strategy:** We use `git merge` (not rebase) to incorporate `development` changes into feature branches.
    - If conflicts occur, resolve them locally before pushing.

## 5. Interaction Style
- **Be Concise:** Don't explain basic concepts unless asked.
- **Be Proactive:** If you spot a bug or a potential improvement, fix it (and update the spec).
- **Assume Competence:** The previous agent had a reason for their code. Read the spec to understand *why* before deleting it.
