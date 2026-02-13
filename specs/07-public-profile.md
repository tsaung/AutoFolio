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

## Onboarding State

If the user account is created but the profile is incomplete (specifically missing `name`), the public view should display a **Getting Started Checklist** instead of the Chat Interface.

### Checklist Steps

1.  **Create Account**: Validated by existence of a profile record.
2.  **Setup Profile**: Validated by presence of `name` field in profile.

### UI Reference

- Card-based layout with progress bar.
- List of steps with completion status (CheckCircle2 vs Circle).
- Action buttons for incomplete steps:
  - Step 1: Login/Sign-up.
  - Step 2: Navigate to Profile Settings.
