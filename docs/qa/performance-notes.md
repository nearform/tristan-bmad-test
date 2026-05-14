# Performance notes

**Date:** 2026-05-14  
**Scope:** Vite production build and local Docker Compose stack

## Observations

- **Vite production bundle** for the web app is a single JS chunk (~200 kB uncompressed, ~63 kB gzip per build output). No heavy client frameworks beyond React 19.
- **API** serves JSON over Fastify with minimal middleware (CORS + routes). CRUD operations are single round-trips to PostgreSQL with indexed primary key lookups by `id`.
- **Docker Compose (`--profile prod`)** starts `db` → `api` (migrations + listen) → `web` with health-gated dependencies; cold start dominated by Postgres readiness and Prisma migrate deploy on first boot.

## Recommended follow-ups (out of scope for v1)

- Add Lighthouse CI in GitHub Actions for trend tracking on LCP, TTI, and bundle size budgets.
- Enable HTTP caching headers for static assets at the nginx layer if a CDN is not used.

## Manual Lighthouse

Run locally after `docker compose --profile prod up`:

1. Open `http://localhost:8080` in Chrome.
2. DevTools → Lighthouse → Performance + Accessibility categories.
3. Record scores and any regressions in this file when iterating.

_No Lighthouse numeric scores were captured in this automated run; the stack is sized for classroom/demo traffic._
