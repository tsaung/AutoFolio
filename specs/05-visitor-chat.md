# Visitor Chat Specs

## Overview

The Visitor Chat interface allows site visitors to interact with the AI assistant. It must provide a polished, glitch-free user experience comparable to the Admin UI.

## UI Requirements

### Chat Interface

- **Input Area**:
  - Must align perfectly with the Send button.
  - Height of single-line input must match the button height (Standard Shadcn `h-9` / 36px).
  - Should mimic the styling of the standard `Input` component (padding, borders).
  - Must grow vertically as the user types (multiline), but start at `h-9`.
- **Message List**:
  - **Empty State**:
    - Must be vertically and horizontally centered.
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

## Mobile Responsiveness

- Input area must remain accessible on mobile keyboards.
- Layout should adapt to smaller screens (100dvh).
