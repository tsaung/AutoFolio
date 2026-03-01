---
description: Automatically create a commit for current changes using Conventional Commits.
---

1. Run `git status` to check the current staged and unstaged changes.
2. Run `git diff --cached` and `git diff` to view the changes in detail.
3. As the AI, analyze the structural changes and autonomously write a commit message following the **Conventional Commits** format:
   - **Format:** `<type>(<scope>): <subject>`
   - **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`.
   - **Scope:** The module or component affected (e.g., `auth`, `rag`, `ui`).
   - **Subject:** Imperative, present tense (e.g., "add feature" not "added feature"). Keep under 50 chars.
   - **Body (Optional):** Explain _what_ and _why_ (not _how_). Wrap at 72 chars.
4. Notify the user with the generated commit message for their review and ask for explicit approval.
5. Wait for user approval. Once approved, execute `git add .` and `git commit -m "<message>"`.
