# ─── ADMIN (Next.js) IMAGE ────────────────────────────────────────────────────
# Multi-stage: builder installs deps & builds Next.js standalone output.
# Runtime serves the standalone bundle.
# ─────────────────────────────────────────────────────────────────────────────

FROM node:24-bookworm-slim AS builder

RUN corepack enable && corepack prepare pnpm@11.19.0 --activate

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY admin/package.json ./admin/

RUN pnpm install --frozen-lockfile --filter @bizonix/admin

COPY admin ./admin

ARG NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN cd admin && npx next build

# ──── Stage 2: runtime ────────────────────────────────────────────────────────
FROM node:24-bookworm-slim AS runtime

WORKDIR /app

COPY --chown=node:node --from=builder /app/admin/.next/standalone ./
COPY --chown=node:node --from=builder /app/admin/.next/static ./admin/.next/static
COPY --chown=node:node --from=builder /app/admin/.next/static ./.next/static
COPY --chown=node:node --from=builder /app/admin/public ./admin/public
COPY --chown=node:node --from=builder /app/admin/public ./public

RUN mkdir -p ./public/uploads ./admin/public/uploads && chown -R node:node /app

USER node

ENV NODE_ENV=production
ENV PORT=3002
ENV HOSTNAME=0.0.0.0

EXPOSE 3002

CMD ["sh", "-c", "if [ -f admin/server.js ]; then node admin/server.js; else node server.js; fi"]
