# Technical Design

## Project Identity

- Project name: `dashboard`
- Base folder: `/Users/frank/source_code/projects/kimi/web_app/dashboard`
- Goal: provide an implementation-ready specification for a responsive dashboard web app with dual authentication

## Recommended Stack

- React 18
- TypeScript
- Vite
- React Router
- Zustand
- Axios
- Tailwind CSS v4
- `@simplewebauthn/browser` for passkey support
- MSW for mock APIs during early development
- Vitest + Testing Library for tests

## Architecture Principles

- Keep business logic out of page components where possible
- Separate auth, session, API, layout, and page concerns
- Prefer mock-service compatibility from day one so backend integration is a replacement step, not a rewrite
- Make desktop and mobile behavior explicit in layout decisions
- Keep docs aligned with actual product decisions rather than generic options

## Proposed Frontend Structure

```text
src/
├── api/              # Axios client, service modules, mock adapters
├── app/              # App bootstrap, providers, router
├── auth/             # Passkey and password login flows
├── components/       # Shared UI and composed widgets
├── config/           # Environment handling
├── data/             # Mock data seeds for local development
├── errors/           # Error types, boundaries, route-level fallback views
├── hooks/            # Shared hooks
├── layouts/          # Auth layout and dashboard shell
├── pages/            # Route pages
├── session/          # Session store and auth guards
├── styles/           # Global CSS and theme tokens
├── test/             # Test setup and helpers
└── types/            # Shared TypeScript types
```

## Authentication Design

The login page supports two modes:

1. Passkey login
2. User ID and password login

### Passkey

- Primary authentication option
- Uses browser WebAuthn flow
- Frontend requests challenge/options from backend or mock handler
- Frontend submits assertion result for verification
- On success, session store is initialized and user is redirected

### User ID and Password

- Secondary authentication option
- Used for mock development and fallback access
- Initial mock credential:
  - user ID `tester1`
  - password `p0ssw0rd`
- Failed attempts tracked in frontend session state for v1 mock mode

### Lockout Behavior

- Lockout applies only to password login in v1
- Maximum failed attempts: 3
- First two failures stay on login page with inline feedback
- Third failure routes to `/error/login`
- Lockout survives route changes within the same browser session
- Full persistence strategy can be revisited once backend rules exist

## Session Design

- Session state stored in Zustand
- Access token stored in memory
- Refresh token expected in httpOnly cookie when backend exists
- Mock mode may store a simulated session object only
- Route guard protects all `/dashboard/**` routes

## Error Handling Design

Three layers:

1. API/service error normalization
2. Route and component render boundaries
3. User-facing feedback and dedicated error pages

### Login Errors

- Invalid password login before lockout: inline form error
- Lockout: dedicated route `/error/login`
- Generic unexpected auth error: remain on login page if recoverable, otherwise route to a safe error view

## Data Design For V1

### Person Record

- `personId`
- `surname`
- `firstName`
- `birthDate`
- `gender`
- `companyId`
- `companyName`

### Company Record

- `companyId`
- `companyName`

V1 requires enough mock person data to demonstrate pagination.

## Routing Model

Public routes:

- `/login`
- `/error/login`

Protected routes:

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

## Implementation Guidance

- Build the login page and auth state first
- Then build the dashboard shell and protected routing
- Then implement `Get Person` using mocked data
- Then scaffold placeholder routes for the remaining pages
- Keep passkey integration behind a service boundary so mock and real backends can share the same page logic
