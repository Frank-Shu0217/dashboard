# Application Specification

## Main Shell

- The authenticated application uses a two-pane layout:
  - left navigation pane
  - right content pane
- On desktop and tablet, the left navigation remains visible.
- On mobile, the navigation is opened through a menu trigger or drawer.

## Navigation Structure

### Person

- Get Person
- Add Person
- Update Person
- Delete Person

### Company

- Get Company
- Add Company
- Update Company
- Delete Company

### Report

- Report Home

## Default Landing Behavior

- After successful login, route to `/dashboard`
- The dashboard landing page can show a simple welcome panel and quick links to:
  - Get Person
  - Get Company
  - Report

## Page Behavior

### Get Person

- Route: `/dashboard/person/get`
- Show a data table in the right content pane
- Default page size: 10 rows
- Show pagination controls below the table when total rows exceed 10
- Required columns:
  - Person ID
  - Surname
  - First Name
  - Birth Date
  - Gender
  - Company ID
  - Company Name
- V1 may use mocked data
- Empty state must show a clear message when no persons are available
- Loading state must exist even in mock mode so real API integration can reuse the same view

### Add Person

- Route: `/dashboard/person/add`
- V1 can be a placeholder page with heading and future implementation note

### Update Person

- Route: `/dashboard/person/update`
- V1 can be a placeholder page with heading and future implementation note

### Delete Person

- Route: `/dashboard/person/delete`
- V1 can be a placeholder page with heading and future implementation note

### Get Company

- Route: `/dashboard/company/get`
- V1 can be a placeholder page unless mock company list is later specified

### Add Company

- Route: `/dashboard/company/add`
- V1 can be a placeholder page

### Update Company

- Route: `/dashboard/company/update`
- V1 can be a placeholder page

### Delete Company

- Route: `/dashboard/company/delete`
- V1 can be a placeholder page

### Report Home

- Route: `/dashboard/report`
- V1 can be a placeholder page describing future reports

## Login And Error Routes

### Login

- Route: `/login`
- Present both authentication methods on one page
- Passkey action must be shown first or more prominently
- Credential form must include:
  - User ID
  - Password
  - Submit action

### Login Error

- Route: `/error/login`
- Show title and message `Login error`
- Explain that maximum password attempts were reached
- Provide action to return to login
- If returned to login in the same browser session, password login remains disabled

## Mock Data Notes

- Mock person dataset should include at least 12 records so pagination can be validated
- Mock company references should map correctly from person rows
- Mock authentication should support both:
  - passkey success stub
  - user ID/password success and failure flows
