# Accessibility report

**Date:** 2026-05-14  
**Tooling:** `@axe-core/playwright` in [`e2e/tests/todo.spec.ts`](../../e2e/tests/todo.spec.ts)

## Result

- **Critical violations:** 0 (assertion: `violations.filter(v => v.impact === "critical")` must be empty).
- **Automated suite:** `pnpm run test:e2e` includes `home page has no critical axe violations`.

## UX spec alignment

- Semantic structure: `<main>`, headings, list items for todos.
- Controls use visible focus styles in [`apps/web/src/index.css`](../../apps/web/src/index.css).
- Checkboxes and delete actions expose descriptive `aria-label` values where the visible label is insufficient.

## Manual checks (recommended)

- Keyboard-only traversal: Tab through add form, list, delete buttons.
- Screen reader smoke test (VoiceOver / NVDA) on empty and populated states.

## Follow-ups

- Consider `aria-live="polite"` on the list region when todos update for screen reader announcement (not required for WCAG AA minimum for this scope).
