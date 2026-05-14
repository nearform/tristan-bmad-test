---
stepsCompleted: [validate-prerequisites, design-epics, create-stories, final-validation]
inputDocuments: [docs/prd-todo-app.md, _bmad-output/planning-artifacts/prd-refined.md, _bmad-output/planning-artifacts/ux-design-spec.md, _bmad-output/planning-artifacts/architecture.md, _bmad-output/planning-artifacts/api-contract.md]
---

# Todo-app — Epic Breakdown

## Requirements inventory

### Functional requirements

- FR-1 Create todo with description
- FR-2 View all todos (newest first)
- FR-3 Toggle completion
- FR-4 Delete todo
- FR-5 Show created timestamp
- FR-6 Empty state
- FR-7 Loading state
- FR-8 Error state + recovery

### Non-functional requirements

- NFR API validation, CORS, health/readiness, extensibility for auth

### UX requirements

- Responsive layout, accessible controls, distinct completed styling, microcopy per UX spec

### FR coverage map

| FR | Epic |
|----|------|
| FR-1, FR-2, FR-5 | E1 Backend + E2 Frontend list |
| FR-3, FR-4 | E2 Frontend interactions + E1 API |
| FR-6–FR-8 | E2 Frontend states |

## Epic list

1. **E1 — API and persistence** — REST CRUD, Prisma/Postgres, health endpoints, integration tests.
2. **E2 — Web client** — React UI, states, component tests, E2E journeys.
3. **E3 — Delivery** — Docker Compose, profiles, documentation.

---

## Epic 1: API and persistence

**Goal:** Durable todos via Fastify + Prisma + PostgreSQL with full test coverage at route level.

### Story 1.1: Project scaffold and database

See implementation artifact `stories/1.1-project-scaffold.md`.

### Story 1.2: Todo CRUD routes

See `stories/1.2-todo-crud-api.md`.

### Story 1.3: Health and readiness

See `stories/1.3-health-endpoints.md`.

---

## Epic 2: Web client

**Goal:** Usable SPA matching UX spec with tests.

### Story 2.1: Todo UI and API integration

See `stories/2.1-todo-ui.md`.

### Story 2.2: E2E user journeys

See `stories/2.2-e2e-journeys.md`.

---

## Epic 3: Delivery

**Goal:** `docker compose` up with healthchecks and README.

### Story 3.1: Containerization

See `stories/3.1-docker-delivery.md`.
