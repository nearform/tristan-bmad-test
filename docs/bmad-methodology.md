# How BMAD guided this implementation

This repository uses the **BMAD** planning layout from [`_bmad/bmm/config.yaml`](../_bmad/bmm/config.yaml): planning artifacts under [`_bmad-output/planning-artifacts`](../_bmad-output/planning-artifacts) and implementation story files under [`_bmad-output/implementation-artifacts/stories`](../_bmad-output/implementation-artifacts/stories).

## Artifact sequence

1. **Canonical PRD** — [`docs/prd-todo-app.md`](prd-todo-app.md) captures the assignment baseline.
2. **Product brief** — [`_bmad-output/planning-artifacts/product-brief.md`](../_bmad-output/planning-artifacts/product-brief.md) sharpens positioning and scope.
3. **Refined PRD** — [`_bmad-output/planning-artifacts/prd-refined.md`](../_bmad-output/planning-artifacts/prd-refined.md) adds numbered FR/NFR and resolved stack choices.
4. **UX spec** — [`_bmad-output/planning-artifacts/ux-design-spec.md`](../_bmad-output/planning-artifacts/ux-design-spec.md) drives empty/loading/error states and accessibility notes in the React UI.
5. **Architecture + API contract** — [`architecture.md`](../_bmad-output/planning-artifacts/architecture.md) and [`api-contract.md`](../_bmad-output/planning-artifacts/api-contract.md) bound the Fastify routes, Prisma model, and health/readiness endpoints.
6. **Epics & stories** — [`epics-and-stories.md`](../_bmad-output/planning-artifacts/epics-and-stories.md) plus per-story files map acceptance criteria to tests.
7. **Implementation readiness** — [`implementation-readiness-report.md`](../_bmad-output/planning-artifacts/implementation-readiness-report.md) confirms traceability before coding.

## Traceability to code

| Spec | Code |
|------|------|
| REST contract `/todos`, `/health`, `/ready` | [`../apps/api/src/routes`](../apps/api/src/routes) |
| UX empty/loading/error | [`../apps/web/src/components/TodoList.tsx`](../apps/web/src/components/TodoList.tsx), [`../apps/web/src/App.tsx`](../apps/web/src/App.tsx) |
| Docker healthchecks | [`../apps/api/Dockerfile`](../apps/api/Dockerfile), [`../apps/web/Dockerfile`](../apps/web/Dockerfile), [`../docker-compose.yml`](../docker-compose.yml) |

## Skills reference (installed BMAD)

Workflows align with installed skills under [`.agents/skills`](../.agents/skills) (e.g. `bmad-product-brief`, `bmad-create-architecture`, `bmad-create-epics-and-stories`, `bmad-check-implementation-readiness`). This delivery materializes their **outputs** as committed artifacts so reviewers can follow the chain PRD → UX → architecture → stories → code.
