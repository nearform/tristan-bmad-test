# Security review (lightweight)

**Date:** 2026-05-14  
**Scope:** Todo monorepo — React client, Fastify API, Prisma/PostgreSQL, Docker deployment

## Findings and mitigations

| Area | Risk | Mitigation in codebase |
|------|------|-------------------------|
| XSS | Reflected/stored HTML in todo text | React escapes text nodes by default; no `dangerouslySetInnerHTML`. |
| Injection | SQL injection | Prisma parameterized queries only; no raw SQL with user strings. |
| CORS | Overly permissive origins | `@fastify/cors` restricted to `WEB_ORIGIN` env (single origin). |
| Transport | Cleartext in production | Compose exposes HTTP for local demo; production should terminate TLS at a reverse proxy or load balancer. |
| Secrets | DB password in compose | Use Docker secrets or external secret manager for real deployments; `.env` files gitignored. |
| Rate limiting | Abuse of public API | Not implemented in v1; add if exposed to the internet. |
| Headers | Missing security headers | Add `helmet`-style headers at nginx or Fastify for production hardening. |

## Dependency hygiene

- Lockfile committed (`pnpm-lock.yaml`); run `pnpm audit` periodically in CI.

## Conclusion

No critical issues identified for the **intended classroom/local-demo** threat model. Hardening items above should be addressed before a public multi-tenant deployment.
