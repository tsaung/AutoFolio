# Profile Settings Spec

## Overview

The Profile Settings page allows users to manage their public profile information.
The `profiles` table is being cleaned up to match the UI and remove unused fields.

## Database Schema

### `profiles` (Modified)

- **Remove Columns**:
  - `website` (Text)
  - `username` (Text) - _Unused_
- **Rename Column**: `full_name` -> `name` (Text)
- **Existing Columns**:
  - `id` (UUID, PK)
  - `name` (Text) - _Renamed from `full_name`_
  - `profession` (Text)
  - `experience` (Integer)
  - `field` (Text)
  - `welcome_message` (Text)
  - `professional_summary` (Text)
  - `avatar_url` (Text)

## UI Requirements

### Profile Form

- Fields:
  - Email (Read-Only, from Auth)
  - Name (Maps to `name`)
  - Profession
  - Experience
  - Field/Industry
  - Professional Summary
  - Welcome Message
- Actions: Save Profile.

## API / Actions

### `profile`

- `getProfile()`: Returns profile data.
- `getProfile()`: Returns profile data.
- `updateProfile(data)`: Upserts profile data (Creates new if not exists).
