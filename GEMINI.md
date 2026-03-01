# Gemini AI Assistant Entrypoint

Welcome to the BotFolio project!

This project uses a modular architecture for AI instructions. Instead of reading rules from this single massive file, please read the specific rules and workflows from the dedicated directories:

- **Rules (`.agent/rules/*.md`)**: Rules for the tech stack, database, git strategy, RAG pipeline, and core persona. Read these before starting tasks related to those domains.
- **Workflows (`.agent/workflows/*.md`)**: Step-by-step procedures. For example, `tdd-workflow.md` enforces our mandatory 5-step process.

Before writing any code or tests, please scan the `.agent/rules` folder for context relevant to your current task.
