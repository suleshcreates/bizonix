# ─── WEBSITE (Next.js) IMAGE ──────────────────────────────────────────────────
# Multi-stage: builder installs deps & builds Next.js standalone output.
# Runtime serves the standalone bundle.
#
# Networking strategy:
#   NEXT_PUBLIC_API_URL  = http://localhost:3001/api/v1
#     → baked into client bundle at build time (browser-visible)
#     → also used as SSR fallback when INTERNAL_API_URL not set
#   INTERNAL_API_URL     = http://backend:3001/api/v1  (set in docker-compose)
#     → server-only runtime env for SSR/RSC fetches inside the container
#   BIZONIX_API_URL      = http://backend:3001/api/v1  (set in docker-compose)
#     → server-only for /api/demo-request route handler
# ─────────────────────────────────────────────────────────────────────────────

FROM node:24-bookworm-slim AS builder

RUN corepack enable && corepack prepare pnpm@11.19.0 --activate

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY website/package.json ./website/

RUN pnpm install --frozen-lockfile --filter website

COPY website ./website

ARG NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_WHATSAPP_URL=""
ARG NEXT_PUBLIC_LOGIN_URL=""
ARG NEXT_PUBLIC_BROCHURE_URL=/brochure-coming-soon
ARG NEXT_PUBLIC_SALES_EMAIL=""
ARG NEXT_PUBLIC_SALES_PHONE=""
ARG NEXT_PUBLIC_CALENDLY_URL=""

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_WHATSAPP_URL=${NEXT_PUBLIC_WHATSAPP_URL}
ENV NEXT_PUBLIC_LOGIN_URL=${NEXT_PUBLIC_LOGIN_URL}
ENV NEXT_PUBLIC_BROCHURE_URL=${NEXT_PUBLIC_BROCHURE_URL}
ENV NEXT_PUBLIC_SALES_EMAIL=${NEXT_PUBLIC_SALES_EMAIL}
ENV NEXT_PUBLIC_SALES_PHONE=${NEXT_PUBLIC_SALES_PHONE}
ENV NEXT_PUBLIC_CALENDLY_URL=${NEXT_PUBLIC_CALENDLY_URL}

RUN cd website && npx next build

# ──── Stage 2: runtime ────────────────────────────────────────────────────────
FROM node:24-bookworm-slim AS runtime

WORKDIR /app

COPY --chown=node:node --from=builder /app/website/.next/standalone ./
COPY --chown=node:node --from=builder /app/website/.next/static ./website/.next/static
COPY --chown=node:node --from=builder /app/website/.next/static ./.next/static
COPY --chown=node:node --from=builder /app/website/public ./website/public
COPY --chown=node:node --from=builder /app/website/public ./public

USER node

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["sh", "-c", "if [ -f website/server.js ]; then node website/server.js; else node server.js; fi"]
