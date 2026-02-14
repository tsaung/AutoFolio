# Admin UI Specifications

## 1. Sidebar

- **Collapsible**: The sidebar should be collapsible to maximize screen real estate.
- **State**: The collapsed state should be persisted (e.g., in localStorage) so the user preference is remembered.
- **Responsiveness**: The sidebar is hidden on mobile and shown on desktop (lg breakpoint). On mobile, it should be accessible via a hamburger menu (already implemented in header?).

## 2. Settings Page

## 2. Settings Page

- **Structure**: A settings layout (`/admin/settings/layout.tsx`) containing a secondary sidebar for navigation.
- **Routes**:
  - `/admin/settings/profile`: User profile (Name, Profession, YOE, Field) & Welcome Message.
  - `/admin/settings/bot`: Bot Configuration (Model, Persona, Prompts).
- **Sidebar**:
  - Should be responsive (collapsible or hidden on mobile).
  - Links to the above routes.
- **UI**:
  - Use "Card" components for settings forms.
  - Ensure consistent layout with the main admin dashboard.
