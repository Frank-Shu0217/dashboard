# Dashboard

`dashboard` is a responsive React + TypeScript web application for desktop and mobile browsers. It supports dual authentication modes on the login page:

- Passkey authentication as the primary login flow
- User ID and password as a secondary login flow

This folder contains the implementation specification for the application before code scaffolding begins.

## Scope

Version 1 focuses on:

- Authentication entry flow
- Session management and route protection
- A dashboard shell with responsive navigation
- Person and Company management placeholders
- A working `Get Person` list page with pagination
- Unified error handling for login and application failures

## Core Decisions

- Application name: `dashboard`
- Frontend stack: React 18 + TypeScript + Vite
- Routing: React Router
- App state: Zustand
- API client: Axios
- Styling: Tailwind CSS v4
- Component approach: local components following shadcn/ui patterns
- Testing: Vitest + Testing Library
- Mock backend for early development: MSW

## Authentication Modes

The login page must present two explicit sign-in options:

1. Sign in with passkey
2. Sign in with user ID and password

Passkey is the primary and preferred flow. User ID/password exists as a fallback and for mock development.

### Passkey Flow

1. User clicks `Sign in with Passkey`
2. Frontend requests authentication options from backend
3. Browser executes WebAuthn authentication
4. Frontend posts assertion result to backend
5. Backend returns session tokens
6. User is redirected to the dashboard home page

### User ID and Password Flow

For mock mode, the initial accepted credential is:

- User ID: `tester1`
- Password: `p0ssw0rd`

For Spring Boot authentication testing, start `springboot_test` on `http://localhost:8080`, then run:

```bash
npm run springboot
```

This disables MSW and enables the backend passkey stub at `/auth/login/passkey`.

Flow:

1. User selects password login
2. User enters credentials
3. Frontend validates against mock API or mock handler
4. On success, session is created and user is redirected to the dashboard home page

### Login Failure Rules

- Failed login attempts are counted only for the user ID/password flow in v1
- Maximum allowed failed attempts: 3
- On each failed attempt before lockout, the UI shows an inline error and preserves the login page
- On the third failed attempt, the app routes to a dedicated error page
- Error page message: `Login error`
- After lockout, password login is disabled until the browser session is refreshed in mock mode
- Passkey login remains available unless the backend explicitly rejects it

## Session Management

- Access token stored in memory
- Refresh token stored in secure httpOnly cookie when backend exists
- Mock mode may emulate this behavior in frontend state only
- Protected routes redirect unauthenticated users to `/login`
- Logout clears local session state and returns to `/login`

## Initial Application Pages

- `/login`
- `/error/login`
- `/dashboard`
- `/dashboard/person/get`
- `/dashboard/person/add`
- `/dashboard/person/update`
- `/dashboard/person/delete`
- `/dashboard/company/get`
- `/dashboard/company/add`
- `/dashboard/company/update`
- `/dashboard/company/delete`
- `/dashboard/report`

## Navigation Summary

- Left navigation groups: `Person`, `Company`, `Report`
- `Person` expands to `Get Person`, `Add Person`, `Update Person`, `Delete Person`
- `Company` expands to `Get Company`, `Add Company`, `Update Company`, `Delete Company`
- `Report` is a single top-level item in v1

## Data Strategy For V1

- `Get Person` is the only fully specified data page in v1
- Other CRUD pages may be scaffolded as placeholders with headings and future-action notes
- Person and Company data are mocked first, then replaced by backend APIs later

## Deliverables Expected Before Implementation

- Finalized product request
- Finalized screen and page definitions
- Confirmed login error behavior
- Confirmed mock data contracts for person and company records

## Related Documents

- `Product_Request.md`
- `design.md`
- `layout_design.md`
- `css_design.md`
- `application.md`
