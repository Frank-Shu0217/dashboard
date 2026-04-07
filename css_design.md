# CSS Design

## Styling Decision

Use Tailwind CSS v4 as the primary styling system for `dashboard`.

Reasons:

- fast implementation for an app with many screens
- responsive design is straightforward
- utility classes reduce context switching for contributors
- works well with local component ownership

## Styling Rules

- Use mobile-first classes by default
- Prefer inline utility classes for one-off layout and spacing
- Extract shared primitives only when the same pattern is repeated several times
- Keep tokens and theme values centralized
- Avoid mixing multiple styling paradigms unless there is a strong reason

## CSS Layers

### Global Base

- global reset and Tailwind import
- app background and text defaults
- safe-area handling for mobile browsers

### Theme Tokens

- colors
- spacing
- radius
- typography
- shadows

### Component Primitives

- buttons
- inputs
- cards
- table wrappers
- status and error messages

## Recommended Style Files

```text
src/styles/
├── main.css
├── tokens.css
└── components.css
```

## Responsive Requirements

- Minimum touch target size: 44x44 pixels
- Preserve readable spacing on mobile screens
- Allow horizontal scrolling for wide tables instead of breaking columns unpredictably
- Ensure nav drawer, login card, and pagination are usable on small devices

## Authentication Styling Guidance

- Passkey login action should look primary
- Password login area should look secondary but still fully usable
- Failed password attempts should show a visible inline error state
- Locked password state should clearly disable the submit action

## Table Styling Guidance

For the `Get Person` page:

- keep consistent row height
- keep header visually distinct
- support overflow within a bounded container
- keep pagination visually separated from the table body

## What To Avoid

- Avoid CSS Modules for routine page styling in this project
- Avoid large custom stylesheet blocks when utilities are sufficient
- Avoid introducing a heavy component framework that fights Tailwind
- Avoid speculative theming work before core screens exist
