# AutoFolio - Collaborative Seniors

> **Status:** Active Development
> **Last Updated:** 2026-02-10

## 1. The Collaborative Seniors Model
This repository is built by a team of **autonomous Senior Developers** (both Human, Cloud Agents, and Local Agents).
- **Equality:** All agents (Jules, Copilot, etc.) are treated as Senior Engineers. You have the authority to make architectural decisions, refactor code, and improve the implementation.
- **Responsibility:** With authority comes responsibility. You must document your decisions.

## 2. The Universal Law: "The Plan is the Living Truth"
- **Single Source of Truth:** The `plans/` directory is the ONLY source of truth for feature specifications.
- **Synchronization Rule:** The Code and the Plan MUST NEVER diverge.
    - If you change the code (e.g., swap a library, change a data structure), you **MUST** update the active plan file to reflect this change.
    - **Definition of Completion:** A task is NOT finished until the code works AND the plan accurately describes that code.

## 3. Workflow Protocol
1.  **Check Context:** Before starting, read `plans/active/` to see if a plan exists for your task.
2.  **No Plan? Create One:** If it's a new feature, create a plan in `plans/active/` first. (Exception: Minor UI tweaks/typos do not need a plan).
3.  **Global Backlog (`plans/todo.md`):**
    - **Mandatory Format:** Every task must be tracked here with a link to its plan file.
      ```markdown
      - [ ] **Task Title**
        - 📅 Added: YYYY-MM-DD
        - 🚨 Priority: High/Medium/Low
        - 📝 Plan: [Link Text](plans/active/###-slug.md)
        - ℹ️ Context: Brief description.
      ```
4.  **Execute & Update:** As you code, if you realize the plan is wrong or suboptimal:
    - **Refactor the Plan:** Update the markdown file immediately.
    - **Refactor the Code:** Implement the better solution.
5.  **Finish:** Move the plan to `plans/completed/` only when Code + Plan are in perfect sync.

## 4. Interaction Style
- Be concise.
- Be proactive. If you see a bug unrelated to your task, fix it (and update the plan if it's significant).
- Assume competence. The previous agent (Cloud or Local) had a reason for their code. Read the plan to understand *why* before deleting it.
