# ─── BACKEND (NestJS) IMAGE ───────────────────────────────────────────────────
# Multi-stage: builder compiles native addons and builds NestJS.
# Runtime receives the fully resolved app tree with all binaries intact.
# ─────────────────────────────────────────────────────────────────────────────

FROM node:24-bookworm-slim AS builder

RUN corepack enable && corepack prepare pnpm@11.19.0 --activate

# Build tools for native modules (argon2) and openssl for Prisma
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy manifests
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY backend/package.json ./backend/

# Install dependencies
RUN pnpm install --frozen-lockfile --filter backend

# Copy source
COPY backend ./backend

# Generate Prisma client with required binary targets
RUN cd backend && npx prisma generate

# Build NestJS
RUN cd backend && npx nest build

# ──── Runtime stage ────────────────────────────────────────────────────────────
FROM node:24-bookworm-slim AS runtime

# OpenSSL is required at runtime by Prisma Query Engine detection
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the complete prepared workspace to preserve pnpm symlinks & native binaries
COPY --chown=node:node --from=builder /app ./

USER node

WORKDIR /app/backend

EXPOSE 3001

CMD ["node", "dist/main"]
