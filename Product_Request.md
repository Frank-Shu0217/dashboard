# Product Request

## Product Name

`dashboard`

## Objective

Build a responsive web application that works on desktop and mobile browsers, provides secure authentication, and offers a dashboard shell for future business workflows around person and company management.

## Version 1 Goals

1. Implement a login page with two authentication methods:
   - Passkey login as the primary method
   - User ID and password login as the fallback method
2. Support mock authentication for early development.
3. Implement protected routing and session-aware navigation.
4. Implement the dashboard layout with left navigation and main content pane.
5. Implement `Get Person` as the first working business page.
6. Provide placeholder pages for the remaining Person, Company, and Report routes.
7. Implement a dedicated login error page for password lockout behavior.

## Authentication Requirements

### Passkey Login

- The login page must provide a clear `Sign in with Passkey` action.
- Passkey is the preferred login method and should be visually emphasized.
- The implementation must support browser-based WebAuthn flows for desktop and mobile browsers.

### User ID / Password Login

- The login page must also provide a standard credential form.
- For mock mode, the accepted credential is:
  - User ID: `tester1`
  - Password: `p0ssw0rd`
- Invalid credentials count as failed login attempts.

### Failed Login Handling

- Password login attempts are limited to 3 failures per browser session in v1.
- First and second failures:
  - remain on the login page
  - show an error message explaining that login failed
  - show remaining attempts
- Third failure:
  - route user to the login error page
  - show the message `Login error`
  - disable further password login attempts for the current browser session
- Passkey login is not disabled by password lockout in v1.

## Application Requirements

- The application must support mobile browser access and desktop browser access.
- The application must use a responsive layout.
- The application must provide unified error handling for expected failures and unexpected page errors.
- The application must be maintainable for open source contributors.

## Navigation Requirements

- Left menu groups:
  - Person
  - Company
  - Report
- Person submenu items:
  - Get Person
  - Add Person
  - Update Person
  - Delete Person
- Company submenu items:
  - Get Company
  - Add Company
  - Update Company
  - Delete Company
- Report is a single page in v1.

## Business Page Requirements

### Get Person

- Display persons in a tabular list, not a free-form input form.
- Render 10 persons per page.
- If more than 10 persons exist, show pagination at the bottom.
- Columns:
  - Person ID
  - Surname
  - First Name
  - Birth Date
  - Gender
  - Company ID
  - Company Name

### Remaining Pages In V1

- `Add Person`, `Update Person`, `Delete Person`
- `Get Company`, `Add Company`, `Update Company`, `Delete Company`
- `Report`

These may be scaffolded as placeholder pages in v1 if detailed workflows are not yet finalized.

## Non-Functional Requirements

- Use mock data and mock auth first so UI can be implemented before backend integration.
- Keep architecture modular so mock services can later be replaced by real APIs.
- Keep documentation aligned with actual product scope.
