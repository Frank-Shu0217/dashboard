# Layout Design

## Layout Goals

- Support desktop and mobile browsers cleanly
- Keep authentication separate from the authenticated app shell
- Make left navigation easy to use for menu-heavy CRUD flows
- Keep the `Get Person` data view readable on small screens

## Top-Level Layouts

### Auth Layout

Used for `/login` and login-related error routes.

- Center the authentication card vertically and horizontally
- On large screens, allow an optional brand/info panel beside the login card
- On mobile, render a single-column layout
- Keep both authentication methods visible without requiring extra navigation

### Dashboard App Shell

Used for all authenticated routes under `/dashboard`.

- Top bar:
  - app title
  - current page title area
  - user/session actions
- Left navigation:
  - Person group
  - Company group
  - Report item
- Main content pane:
  - page header
  - page body

## Responsive Navigation Behavior

### Desktop

- Left navigation is permanently visible
- Person and Company groups can expand and collapse

### Tablet

- Left navigation remains visible
- Width may be reduced, but text labels should remain readable

### Mobile

- Left navigation becomes a drawer or overlay panel
- A menu button in the top bar opens the navigation
- Nested menu items must still support Person and Company expansion
- Bottom tab navigation is not recommended for v1 because the app contains too many nested destinations

This is an intentional change from the earlier generic layout note. A drawer-based mobile navigation fits the specified information architecture better than a bottom tab bar.

## Login Page Layout

The login page should present the two auth methods clearly within one page.

Recommended structure:

1. App title and short description
2. Passkey login card or primary action area
3. Divider with `or`
4. User ID/password form
5. Inline error region for password-login failures

### Interaction Rules

- Passkey sign-in action should be more visually prominent than password sign-in
- Password form must remain visible even if passkey is primary
- On password lockout, disable the password submit action and show explanatory text

## Error Page Layout

For `/error/login`:

- Use a simple centered card layout
- Title: `Login error`
- Message explains password attempts were exceeded
- Provide action to return to `/login`
- If password is still locked, the returned login page reflects that state

## `Get Person` Page Layout

- Page header at top of content pane
- Table container below header
- Pagination below table
- On narrow screens, horizontal overflow is acceptable within the table container
- Do not collapse this dataset into cards for v1 unless explicitly requested

Recommended column order:

1. Person ID
2. Surname
3. First Name
4. Birth Date
5. Gender
6. Company ID
7. Company Name

## Placeholder Page Layout

For unfinished pages in v1:

- Page title
- Short descriptive text
- Optional note such as `Planned for later implementation`

Keep placeholders visually consistent so navigation and routing can still be tested end to end.
