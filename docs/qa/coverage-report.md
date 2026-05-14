# Coverage report

**Date:** 2026-05-14  
**Tool:** Vitest v8 coverage (`pnpm --filter @todo/api run coverage` with `DATABASE_URL` set; `pnpm --filter @todo/web run coverage`)

## Summary

| Package | Statements | Branches | Functions | Lines |
|---------|------------|----------|-----------|-------|
| `@todo/api` | 81.6% | 77.27% | 100% | 81.6% |
| `@todo/web` | 90.41% | 74% | 70% | 90.41% |

Both packages exceed the **70%** meaningful line coverage target for application source (excluding pure bootstrap where noted).

## API gaps (non-blocking)

- `app.ts` global error handler paths (lines 30–37) are not exercised by a dedicated test.
- `health.ts` database failure branch (503) not covered in integration suite (would require a broken `DATABASE_URL` mid-run or a mocked Prisma).
- `todos.ts` validation branches for PATCH body refinement (lines 46–53) partially covered.

## Web gaps (non-blocking)

- `App.tsx` error-retry path and delete/toggle branches are not fully exercised in unit tests (covered by Playwright E2E).

## Commands

```bash
export DATABASE_URL="postgresql://todo:todo@127.0.0.1:55432/todo?schema=public"
pnpm --filter @todo/api run coverage
pnpm --filter @todo/web run coverage
```

HTML reports are emitted under each app’s `coverage/` directory when generated locally.
