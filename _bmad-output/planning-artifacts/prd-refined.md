---
artifact: prd-refined
source: docs/prd-todo-app.md
stepsCompleted: [discovery, refinement]
date: 2026-05-14
---

# PRD (Refined): Personal Todo Application

## 1. Goals

1. Deliver a **minimal** full-stack todo product that feels complete.
2. Ensure **durability** of todos across sessions and browser refresh.
3. Keep the system **extensible** for future auth and multi-user without redesigning the core domain model boundaries.

## 2. Personas

- **Primary:** Individual knowledge worker or student using the app for personal capture on web.

## 3. Functional requirements

| ID | Requirement |
|----|-------------|
| FR-1 | User can **create** a todo with a non-empty text description (reasonable max length enforced server-side). |
| FR-2 | User can **view** all todos sorted by creation time (newest first unless empty). |
| FR-3 | User can **toggle completion** for any todo. |
| FR-4 | User can **delete** any todo. |
| FR-5 | UI shows **created** timestamp in a human-readable form (locale-aware optional; ISO fallback acceptable). |
| FR-6 | **Empty state** when there are no todos. |
| FR-7 | **Loading state** on initial fetch. |
| FR-8 | **Error state** when API unreachable or returns error; user can retry or continue after recovery. |

## 4. Non-functional requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | API responds quickly on local hardware for trivial CRUD (target under 200ms p95 when measured locally). |
| NFR-2 | **Input validation** on API; structured error bodies for 4xx. |
| NFR-3 | **CORS** configured for known web origin(s). |
| NFR-4 | **Health** endpoint for orchestration without hitting DB; **readiness** may check DB where applicable. |
| NFR-5 | Codebase structured for **future auth** (e.g. optional userId column not required in v1). |

## 5. Data model (conceptual)

- **Todo:** `id` (UUID), `description` (string), `completed` (boolean), `createdAt` (datetime), optional `updatedAt`.

## 6. Acceptance themes (release)

- E2E journeys: create, complete, delete, empty list, error path.
- Integration tests cover every REST endpoint.
- Component tests cover list, empty, loading, error presentation.

## 7. Out of scope (unchanged)

Accounts, sharing, priorities, deadlines, notifications, offline-first PWA.

## 8. Open decisions (resolved for implementation)

- **Stack:** TypeScript monorepo—Vite + React web, Node + Fastify API, Prisma + PostgreSQL.
- **Deployment:** Docker Compose with separate `web`, `api`, `db` services.
