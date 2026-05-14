# AI integration log (Phase 3)

**Project:** BMAD-driven Todo monorepo  
**Date:** 2026-05-14

## Agent usage

| Task | AI assistance | What worked |
|------|----------------|-------------|
| Planning artifacts | Generated PRD refinement, UX, architecture, epics/stories, readiness report from the assignment PRD | Clear phased structure; linking FR IDs to stories |
| API implementation | Fastify + Prisma + zod routes | Single `createApp` with injectable Prisma for tests |
| Web UI | React state machine for load/error/data | Proxy `/api` in Vite simplified local dev |
| Docker | Multi-stage images, `pnpm deploy` for API runtime layout | `pnpm deploy --filter @todo/api` produced a runnable `node_modules` with `prisma` CLI |
| Debugging Prisma in Docker | Added `binaryTargets` for OpenSSL 3 on `linux-arm64` | Prisma error message spelled out the exact target string |
| Coverage target | Added `api.test.ts`, `App.test.tsx`, kept integration in coverage run | Integration tests raised API route coverage above 70% |

## MCP server usage

- **Maestro MCP:** Not used (Playwright covers browser automation for this stack).
- **Postman / Chrome DevTools MCP:** Not available in this environment; API contracts validated via **Vitest integration tests** and manual `curl` against Docker Compose.

## Test generation

- **Unit/component:** Vitest + Testing Library for list form behaviors and API client `fetch` mocking.
- **Integration:** Fastify `inject()` per route with a real Postgres (Docker on port **55432**).
- **E2E:** Six Playwright tests including `@axe-core/playwright` for critical a11y violations.
- **Gaps AI initially missed:** Vitest CLI glob for `**/*.integration.test.ts` did not match when combined with `include` in config — fixed by explicit file paths in `test:integration`. Coverage run initially picked up integration files without `DATABASE_URL` — documented requirement and split `coverage` expectations in QA doc.

## Debugging highlights

- Docker API exit `127`: Prisma CLI not present in copied `node_modules`; resolved with **`pnpm deploy`** bundle.
- Prisma query engine mismatch in container: fixed with **`binaryTargets`** in `schema.prisma`.
- Playwright `getByPlaceholder` vs Testing Library `getByPlaceholderText` naming mismatch.

## Limitations / human judgment

- **Host port selection** (`55432`) required human choice because default `5432`/`5433` were already bound on the dev machine.
- **Threat modeling** for a public deployment (TLS, rate limits, headers) documented but not implemented for v1 scope.
- **Lighthouse scores** not collected automatically in CI (noted as follow-up in performance doc).

## Prompt patterns that were effective

- “Implement the attached plan without editing the plan file; complete all todos.”
- “Fix Prisma OpenSSL binaryTargets for Docker arm64.”
- “Use pnpm deploy for production node_modules layout.”
