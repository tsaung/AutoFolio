---
description: Automatically create a commit for current changes using Conventional Commits.
---

// turbo

1. Run `git status` to check the current staged and unstaged changes.

// turbo 2. Run `git diff --cached` and `git diff` to view the changes in detail.

3. As the AI, analyze the structural changes and autonomously write a commit message following the **Conventional Commits** format:
   - **Format:** `<type>(<scope>): <subject>`
   - **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`.
   - **Scope:** The module or component affected (e.g., `auth`, `rag`, `ui`).
   - **Subject:** Imperative, present tense (e.g., "add feature" not "added feature"). Keep under 50 chars.
   - **Body (Optional):** Explain _what_ and _why_ (not _how_). Wrap at 72 chars.
   
   > **Note on Windows/pwsh:** Do NOT use multiple `-m` flags (e.g. `git commit -m "sub" -m "body"`) because PowerShell often fails to parse these correctly. Instead, pass the entire message in a single `-m` string, or omit the body if it causes syntax errors. Keep the commit message formatting simple.

4. Propose the commit command (e.g., `git add . && git commit -m "<message>"`) using the `run_command` tool with `SafeToAutoRun: false`. This will automatically present the user with a convenient 'Approve'/'Reject' button in the UI.
