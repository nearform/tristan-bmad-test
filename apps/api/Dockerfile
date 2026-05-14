# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS builder
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile
COPY apps/api apps/api
WORKDIR /repo/apps/api
RUN pnpm exec prisma generate
RUN pnpm run build
WORKDIR /repo
RUN pnpm --filter @todo/api deploy --prod /deploy
RUN cp -r /repo/apps/api/dist /deploy/dist
COPY apps/api/docker-entrypoint.sh /deploy/docker-entrypoint.sh
WORKDIR /deploy
RUN chmod +x docker-entrypoint.sh && ./node_modules/.bin/prisma generate

FROM node:22-bookworm-slim AS runner
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates curl \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd --system --gid 1001 app \
  && useradd --system --uid 1001 --gid app app
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /deploy/ ./
RUN chown -R app:app /app
USER app
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -fsS http://127.0.0.1:4000/health || exit 1
ENTRYPOINT ["./docker-entrypoint.sh"]
