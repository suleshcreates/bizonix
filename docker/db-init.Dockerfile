# ─── DB-INIT IMAGE ────────────────────────────────────────────────────────────
# Runs: prisma migrate deploy → prisma db seed
# Uses debian-based Node for argon2 native compilation compatibility.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:24-bookworm-slim AS base

# Install pnpm via corepack (version pinned to match packageManager field)
RUN corepack enable && corepack prepare pnpm@11.19.0 --activate

# Install build tools needed for native modules (argon2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ─── Copy workspace manifests first (for layer caching) ──────────────────────
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY backend/package.json ./backend/

# ─── Install backend dependencies only ───────────────────────────────────────
RUN pnpm install --frozen-lockfile --filter backend

# ─── Copy backend source (prisma schema, migrations, seed) ───────────────────
COPY backend/prisma ./backend/prisma
COPY backend/tsconfig.json ./backend/
COPY backend/tsconfig.build.json ./backend/
COPY backend/src ./backend/src

# ─── Generate Prisma client ───────────────────────────────────────────────────
RUN cd backend && npx prisma generate

# ─── Entrypoint: migrate then seed ───────────────────────────────────────────
WORKDIR /app/backend
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed"]
