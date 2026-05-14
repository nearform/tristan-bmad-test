---
artifact: ux-design-spec
related: [docs/prd-todo-app.md, _bmad-output/planning-artifacts/prd-refined.md]
date: 2026-05-14
---

# UX Design Specification: Personal Todo App

## Design principles

1. **Scannable list** — one line per task; completion is obvious at a glance.
2. **Progressive disclosure** — no onboarding; primary actions always visible.
3. **Forgiving errors** — non-blocking messages with clear next steps.

## Information architecture

- **Header:** App title + short subtitle (optional, single line).
- **Primary region:** Add todo (text field + submit button).
- **Secondary region:** Filter-free list of todos (v1: show all; completed visually muted/strikethrough + checkbox).
- **Footer (optional):** Version or environment hint for demos only.

## Key screens and states

### Default (has todos)

- Vertical list; newest at top (matches PRD “see list immediately”).
- Each row: checkbox (complete), description text, delete control (icon or “Delete” with confirmation optional—instant delete acceptable for v1 with undo out of scope).

### Empty

- Illustration or simple icon optional; headline “No todos yet”; subcopy “Add your first task above.”

### Loading

- Skeleton rows (3) or single centered spinner with “Loading todos…”.

### Error

- Inline alert at top of list region: message + “Retry” button that refetches.

## Visual design

- **Active todo:** normal contrast body text.
- **Completed todo:** strikethrough or reduced opacity; checkbox checked.
- **Touch targets:** minimum 44px height for row actions on mobile.
- **Focus:** visible focus rings for keyboard users (WCAG AA).

## Responsive behavior

- **Mobile:** full-width input; stack controls; list full width.
- **Desktop:** max-width container (e.g. 32–40rem) centered for readability.

## Microcopy

| Context | Copy |
|---------|------|
| Add placeholder | “What needs doing?” |
| Empty | “No todos yet” |
| Loading | “Loading todos…” |
| Generic API error | “Could not load todos. Check your connection and try again.” |
| Validation (empty submit) | “Enter a task description.” |

## Accessibility

- Semantic `<main>`, `<h1>`, list as `<ul>` / `<li>` or equivalent roles.
- Checkboxes labeled per row; delete buttons have `aria-label`.
- No color-only status: pair color with strikethrough/checkbox state.

## Traceability to PRD

| PRD theme | UX delivery |
|-----------|-------------|
| Instant updates | Optimistic or fast refetch after mutations |
| Completed distinct | Strikethrough + checked checkbox |
| Empty/loading/error | Dedicated UI blocks per above |
