# Public Profile View Spec

## Overview

The main landing page (Visitor View) should display the user's public profile information before the chat interface. This establishes trust and context for the visitor.

## UI Requirements

### Hero Section

- **Location**: Top of the page, above the Chat Interface.
- **Content**:
  - **Avatar**: `avatar_url` (if available, else fallback).
  - **Name**: `name`.
  - **Headline**: "{Profession} | {Experience}+ Years in {Field}".
  - **Bio**: `welcome_message`.
- **Styling**: Clean, professional, centered layout.

### Layout

- **Container**: Max-width wrapper (centered).
- **Spacing**: Adequate space between Hero and Chat.

## Data Fetching

- **Method**: Server Component (`page.tsx`).
- **Source**: `getProfile()` action (or direct DB call if preferred for public read).
- **Fallback**: Handle case where no profile exists (show generic greeting or loading state).
