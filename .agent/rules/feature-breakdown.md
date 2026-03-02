---
trigger: always_on
description: Guidelines for analyzing feature complexity and suggesting task breakdowns for large features.
---

# Feature Breakdown & Task Planning

As an AI Agent evaluating a newly assigned feature or high-level architecture goal, you must immediately assess its complexity before writing any code.

If you determine that the requested feature is too large, complex, or multi-faceted to be reliably executed within a single chat session without context degradation or architectural errors, you must:

1. **Halt Execution:** Do not immediately start writing implementation code.
2. **Warn the Developer:** Politely inform the user that the requested feature is too large for a single session and explain why (e.g., touches too many layers, requires schema changes + UI design + API routing).
3. **Propose a Task List:** Break the large feature down into 3-5 manageable, sequential milestones (e.g., Milestone 1: DB Schema & Models, Milestone 2: Background Jobs/API, Milestone 3: UI Implementation).
4. **Provide Prompts:** For each milestone, provide a ready-to-use, copy-pasteable prompt that the developer can use to start a fresh, focused AI session contextually aware of the overall goal.

**Example Prompt Output:**

> "Please copy this prompt for our next session to tackle Milestone 1:"
>
> ```text
> Context: We are building [Feature Name]. The overall architecture is [Brief description].
> Current Task: Implement Milestone 1 - [Pertaining logic].
> Please review the `.agent/rules` and create the initial database schema and API routes for this milestone.
> ```