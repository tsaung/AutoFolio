# Plans Directory

This folder contains the **Living Specifications** for the project.

## Folder Structure
- **`active/`**: The CURRENTLY executing tasks.
    - **Rule:** There should only be 1-2 active plans at a time to maintain focus.
    - **Format:** `###-slug.md` (e.g., `004-sidebar-redesign.md`).
- **`completed/`**: Archive of finished tasks.
    - **Rule:** Do not edit these files unless fixing historical inaccuracies. They serve as the "Context Memory" for agents.
- **`future/`**: Drafts and ideas.
    - **Rule:** Feel free to dump rough ideas here. They are not binding until moved to `active/`.
- **`todo.md`**: The Global Backlog.
    - **Rule:** All tasks (big or small) should be listed here first.

## The Lifecycle of a Plan
1.  **Draft:** Created in `active/` (or moved from `future/`).
    - *Content:* High-level User Story, expected behavior, and technical strategy.
2.  **Implementation (The "Living" Phase):**
    - **One Plan = One Branch:** Every active plan MUST correspond to a git branch.
    - **Bundled Fixes:** For multiple small fixes, create a "Maintenance Plan" (e.g., `005-ui-polish.md`) that lists them all.
    - Agents (Cloud or Local) read the plan and start coding.
    - **CRITICAL:** If the agent changes the implementation details (e.g., "Use Redux" -> "Use Context"), they **MUST update this file**.
3.  **Completion:**
    - The feature is fully tested and working.
    - The plan file is moved to `completed/`.