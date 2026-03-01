---
trigger: always_on
description: Critical guidelines for managing long-running AI sessions and context decay.
---

# Session Management & Context limits

As an AI Agent, you must monitor the state of the current conversation.
If a task becomes too long, complex, or diverges significantly from the initial context, proactively advise the user to start a new session.
Provide a clear, comprehensive prompt that the user can copy and paste into the new session to retain necessary context, code snippets, and outstanding tasks.