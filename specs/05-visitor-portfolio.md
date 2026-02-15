# Visitor Portfolio Spec

## Overview

The visitor experience will be transformed from a simple chat interface to a comprehensive portfolio page. This page will showcase the user's profile, projects, experience, and skills, while keeping the AI chat accessible via a floating action button.

## UI Structure

### 1. Navigation (Sticky/Fixed)

- **Links**: Home, Projects, Experience, Skills.
- **Action**: "Chat with AI" (optional, mainly covered by FAB).
- **Behavior**: Smooth visual scrolling to sections.
- **Impl**: `VisitorNav` component.

### 2. Hero Section (`ProfileHero`)

- **Content**:
  - Avatar (Centered or Left-aligned).
  - Name (H1).
  - Profession / Headline (H2, animated gradient).
  - Bio / Welcome Message.
  - Social Links (Row of icons).
- **Design**: Modern, clean, focused.
- **Impl**: Extend existing `ProfileHero`.

### 3. Projects Section

- **Layout**: Grid of cards.
- **Card Content**:
  - Thumbnail (if available) or standard placeholder.
  - Title (Link to `project_url` or `demo_url`).
  - Description (Truncated).
  - Tags (Badge list).
  - Links (GitHub, Live Demo).
- **Impl**: `ProjectsList` component.

### 4. Experience Section

- **Layout**: Vertical timeline or clean list.
- **Item Content**:
  - Role (`position`).
  - Company (`company`).
  - Date Range (`start_date` - `end_date`).
  - Description (Bullet points).
- **Impl**: `ExperienceList` component.

### 5. Skills Section

- **Layout**: Grouped by Category (Frontend, Backend, Tools, etc.).
- **Item Content**:
  - Skill Name.
  - Proficiency (Optional: Progress bar or Dots).
  - Icon (if applicable/available, text fallback for now).
- **Impl**: `SkillsList` component.

### 6. Floating Chat (FAB)

- **Position**: Fixed Bottom-Right.
- **Icon**: Message/Chat icon.
- **Interaction**: Opens a Sheet (Side Drawer) or Dialog containing the `ChatInterface`.
- **State**: Persist chat state if possible, or reset on close (acceptable for v1).
- **Impl**: `FloatingChat` component.

## Data Fetching

- **Server Component**: `src/app/(visitor)/page.tsx`.
- **Actions**:
  - `getPublicProfile`
  - `getPublicProjects`
  - `getPublicExperiences`
  - `getPublicSkills`
  - `getPublicSocialLinks`
  - `getPublicBotConfig` (passed to Chat)

## Fallback State

- If `profile.name` is missing, show `SetupChecklist` (existing logic).

## Mobile Responsiveness

- Stacked layout for all grids.
- Sticky Nav might collapse to hamburger or bottom bar (or just simple links).
- Floating Chat button remains accessible.

## Chat Interface Component

_(Formerly defined in 05-visitor-chat.md)_

The `ChatInterface` component is reused within the floating sheet/dialog.

### UI Requirements

- **Header**:
  - Must display **Profile Name** as primary title.
  - **Minimalist**: Do NOT display Profession/YOE here.
  - Handle missing profile (fallback to "BotFolio").
- **Input Area**:
  - Aligns with Send button.
  - Base height `h-9` (36px).
  - Auto-grow multiline.
- **Message List**:
  - **Empty State (Profile Hero)**:
    - Vertically/Horizontally centered.
    - **Reduced Content**: Avatar + Profession + Welcome Message.
    - **No Redundancy**: No Name (it's in header), No YOE/Field.
  - **Scroll Behavior**:
    - Auto-scroll to bottom on new message.

### Backend & Logic

- **API**: `POST /api/chat`
- **Config**: Uses `public_agent` from `bot_configs`.
- **Context**: Interpolates profile placeholders (`{name}`, `{profession}`, etc.).
