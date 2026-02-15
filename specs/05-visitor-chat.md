# Visitor Chat Specs

## Overview

The Visitor Chat interface allows site visitors to interact with the AI assistant. It must provide a polished, glitch-free user experience comparable to the Admin UI.

## UI Requirements

### Chat Interface

- **Header**:
  - Must display **Profile Name** as the primary title.
  - **Minimalist Design**: Do NOT display Profession or YOE in the header to save space.
  - Must handle missing profile data gracefully (fallback to "BotFolio" or generic "AI Assistant").
  - "BotFolio" branding should be removed when profile data is present.
- **Input Area**:
  - Must align perfectly with the Send button.
  - Height of single-line input must match the button height (Standard Shadcn `h-9` / 36px).
  - Should mimic the styling of the standard `Input` component (padding, borders).
  - Must grow vertically as the user types (multiline), but start at `h-9`.
- **Message List**:
  - **Empty State (Profile Hero)**:
    - Must be vertically and horizontally centered.
    - **Reduced Content**: Display only Avatar, Profession, and Welcome Message.
    - **Removed Redundancy**: Do NOT display Name here (Header).
    - **Simplified**: Do NOT display YOE or Field. Just the Profession Title (e.g., "Marketing Manager").
    - **Removed Redundancy**: Do NOT display Name here (it is already in the Header).
    - Must NOT trigger a scrollbar when there is no overflow.
    - Should occupy the full available height of the container.
  - **Messages**:
    - User and Bot messages should be clearly termed.
    - Markdown rendering for bot messages.
  - **Scroll Behavior**:
    - Scrollbar should only appear when content exceeds the viewable area.
    - Auto-scroll to bottom on new message.

## Functional Requirements

- **Typing**:
  - Enter sends message.
  - Shift+Enter inserts new line.
- **Bot Response**:
  - Streamed responses.
  - Loading state indication (or streamed output).

## Backend

- **Chat API** (`POST /api/chat`):
  - Reads model and system prompt from `bot_configs` table (`type = 'public_agent'`) via `adminClient`.
  - Interpolates profile placeholders (`{name}`, `{profession}`, `{experience}`, `{field}`) in the system prompt at runtime.
  - Falls back to `google/gemini-2.0-flash-001` and a generic system prompt if no bot config is found.
  - Streams responses via OpenRouter using the Vercel AI SDK.

## Mobile Responsiveness

- Input area must remain accessible on mobile keyboards.
- Layout should adapt to smaller screens (100dvh).
