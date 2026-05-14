# Todo App (BMAD-driven)

Full-stack personal todo list: **Vite + React** frontend, **Fastify + Prisma + PostgreSQL** API, **pnpm** monorepo, **Vitest** (unit + API integration), **Playwright** E2E, **Docker Compose** for production-like runs.

## Prerequisites

- Node.js 22+
- [pnpm](https://pnpm.io/) 9 (`corepack enable`)
- Docker Desktop (for Postgres and/or full stack)

## Quick start (local)

1. Start Postgres (host port **55432** to avoid conflicts with a local Postgres on 5432):

   ```bash
   docker compose --profile dev up -d db
   ```

2. Set `DATABASE_URL` and run migrations:

   ```bash
   export DATABASE_URL="postgresql://todo:todo@127.0.0.1:55432/todo?schema=public"
   pnpm install
   pnpm --filter @todo/api run prisma:deploy
   ```

3. Run API and web (two terminals or use a process manager):

   ```bash
   pnpm --filter @todo/api dev
   ```

   ```bash
   pnpm --filter @todo/web dev
   ```

4. Open **http://127.0.0.1:5173** — the Vite dev server proxies `/api/*` to `http://127.0.0.1:4000`.

## Docker Compose (full stack)

Build and run API + web + database:

```bash
docker compose --profile prod up --build
```

- **Web UI:** http://localhost:8080  
- **API (direct):** http://localhost:4000  
- **API via nginx:** http://localhost:8080/api/health  

Environment:

| Variable | Purpose |
|----------|---------|
| `WEB_ORIGIN` | CORS allowlist for the API (default `http://localhost:8080`) |
| `VITE_API_URL` | Build-time API base path for the SPA (default `/api` in Docker) |

### Profiles

- **`dev`:** `db` only — convenient for local `pnpm dev` against a real Postgres.
- **`prod`:** `db`, `api`, `web` — multi-stage images, non-root users, healthchecks.

## Scripts (root)

| Script | Description |
|--------|-------------|
| `pnpm dev` | Runs `@todo/api` and `@todo/web` `dev` in parallel |
| `pnpm build` | Builds all workspace packages |
| `pnpm test` | Unit tests in each package (API excludes DB integration) |
| `pnpm test:integration` | API integration tests (**requires** `DATABASE_URL`) |
| `pnpm test:e2e` | Playwright (**requires** DB; uses default `DATABASE_URL` to port **55432**) |
| `pnpm coverage` | Runs each package’s `coverage` script |

## Project layout

- [`apps/api`](apps/api) — REST API, Prisma schema, Dockerfile  
- [`apps/web`](apps/web) — React SPA, Dockerfile (nginx unprivileged)  
- [`e2e`](e2e/tests) — Playwright specs  
- [`docs`](docs) — PRD, QA reports, methodology notes  
- [`_bmad-output/planning-artifacts`](_bmad-output/planning-artifacts) — BMAD planning outputs  

## Troubleshooting

- **Playwright / integration tests cannot reach DB:** ensure `docker compose --profile dev up -d db` is healthy and `DATABASE_URL` uses port **55432** (see `docker-compose.yml`).
- **Prisma migrate errors in Docker:** API image runs `prisma migrate deploy` on startup; check `docker compose logs api`.
- **CORS errors in browser:** align `WEB_ORIGIN` with the exact origin you use (scheme + host + port).
