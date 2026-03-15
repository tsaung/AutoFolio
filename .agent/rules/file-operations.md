---
description: Constraints for file modifications to prevent runaway refactoring.
---

# File Operations & Blast Radius Constraints

To prevent unintended cascading changes and destructive wide-scale file overwrites, you must adhere to the following constraints when executing modifications:

1. **Contextual Blast Radius:** Evaluate the expected "blast radius" of a task based on its scope:
   - *Isolated tasks* (e.g., adding a single component, fixing a localized bug) should only touch 1-5 files.
   - *Cross-cutting tasks* (e.g., structural refactoring, consolidating features, API changes) may naturally touch 10-20+ files.

2. **Proactive Confirmation:** If a task unexpectedly requires modifying a significantly larger number of files than the initial scope implied, or if you intend to perform wide-scale unprompted refactoring outside the explicitly targeted files, you must **pause execution**. Use the `message_user` tool to explicitly ask the user for permission to proceed, outlining the files that will be affected and the justification.

3. **Deletion Guardrails:** Never perform destructive file overwrites or bulk file deletions without first reading the corresponding documentation (`specs/` or `AGENTS.md`) to understand the code's purpose. If in doubt about whether a file is still necessary, verify with the user before deleting it.