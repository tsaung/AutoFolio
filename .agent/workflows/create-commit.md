---
description: Create a commit for current changes using Conventional Commits.
---

1. Run `git status` to check the current changes.
2. Run `git diff` to view the changes.
3. Draft a commit message following the **Conventional Commits** format:
   - **Format:** `<type>(<scope>): <subject>`
   - **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`.
   - **Scope:** The module or component affected (e.g., `auth`, `kb`, `dashboard`).
   - **Subject:** Imperative, present tense (e.g., "add feature" not "added feature").
   - **Body (Optional):** Explain _what_ and _why_ (not _how_).
4. Run `git add .` to stage all changes.
5. Run `git commit -m "<message>"` using the drafted message.
