# Bizonix — Docker Local Development

Run the complete Bizonix stack locally with a single command.  
No PostgreSQL installation required. No manual database setup required.

---

## Prerequisites

| Tool | Minimum Version | Notes |
|---|---|---|
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | 4.x | Must be running |
| Docker Compose | v2 (bundled with Docker Desktop) | Use `docker compose` not `docker-compose` |

No Node.js, pnpm, or PostgreSQL installation required on the host.

---

## Quick Start

```bash
git clone <repository-url>
cd Bizonix
docker compose up --build
```

First startup takes several minutes (builds all images, runs migrations, seeds the database).

### Services after startup

| Service | URL |
|---|---|
| Website | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| Admin panel | http://localhost:3002 |
| Swagger docs | http://localhost:3001/api/docs |

### Default admin credentials

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `admin_bizonix123` |

---

## How It Works

Docker Compose starts services in the correct dependency order:

```
db (PostgreSQL 16)
  ↓ healthy
db-init (migrate + seed)
  ↓ exits 0
backend (NestJS :3001)
  ↓ healthy (/health/ready)
admin (Next.js :3002)
website (Next.js :3000)
```

### db-init behavior
- Runs `prisma migrate deploy` against the existing migration history
- Runs `prisma db seed` (all seed operations use upsert — safe to run again)
- Exits `0` on success, non-zero on failure (blocks the backend from starting)
- Will NOT create duplicate roles, users, heroes, or plans on restart

---

## Common Commands

```bash
# First run — builds all images, starts everything
docker compose up --build

# Subsequent runs (no rebuild)
docker compose up

# Start in background
docker compose up -d

# Stop containers (preserves database)
docker compose down

# Check service status
docker compose ps

# View logs
docker compose logs db
docker compose logs db-init
docker compose logs backend
docker compose logs admin
docker compose logs website

# Follow logs live
docker compose logs -f backend

# Rebuild a single service
docker compose build backend
docker compose up -d backend
```

---

## Database

### Persistence

The PostgreSQL database is stored in a named Docker volume (`bizonix_pgdata`).

```bash
docker compose down        # Stops containers — DATABASE IS PRESERVED
docker compose up          # Restarts — existing data is intact
```

### Full reset (destructive)

> [!CAUTION]
> This deletes all data in the Docker database. There is no undo.

```bash
docker compose down -v     # Stops containers AND deletes the volume
docker compose up --build  # Fresh start — runs migrations and seed from zero
```

### Migrations

Migrations run automatically via `prisma migrate deploy` inside `db-init`.  
Never run `prisma migrate dev` in this environment. That command is for local development only.

---

## Environment Variables

### Docker defaults (built into docker-compose.yml)

The `docker-compose.yml` includes safe development defaults. You do not need to create `.env` files for Docker.

If you want to override any variable, create a `docker-compose.override.yml` in the repo root:

```yaml
services:
  backend:
    environment:
      RESEND_API_KEY: your_real_key_here
      DEMO_REQUEST_TO_EMAIL: sales@yourdomain.com
```

### Optional integrations

The following integrations are disabled by default in Docker but the application starts normally without them:

| Integration | Variable | Purpose |
|---|---|---|
| Resend | `RESEND_API_KEY` | Email delivery for demo requests |
| EmailJS | `EMAILJS_*` | OTP delivery for password reset |

### Real secrets

Never commit real API keys to `docker-compose.yml`. Use `docker-compose.override.yml` (which is gitignored) or Docker secrets for production.

---

## Architecture Notes

### API networking inside Docker

| Request origin | URL used | Why |
|---|---|---|
| Browser (client components) | `http://localhost:3001/api/v1` | Browser runs on host, not in Docker network |
| Next.js SSR / RSC (server-side) | `http://backend:3001/api/v1` | Runs inside container, uses Docker service name |
| Next.js route handlers | `http://backend:3001/api/v1` | Same — server-side only |

The `NEXT_PUBLIC_API_URL` is baked into the browser bundle at build time (`http://localhost:3001/api/v1`).  
The `INTERNAL_API_URL` is a server-only runtime variable pointing to the backend container.  
This separation means browser calls and server calls both work correctly.

### Image strategy

| Service | Base image | Why |
|---|---|---|
| backend | `node:24-bookworm-slim` | Debian required for `argon2` native module compilation |
| db-init | `node:24-bookworm-slim` | Same — runs Prisma + seed with argon2 |
| admin | `node:24-bookworm-slim` | Next.js standalone output |
| website | `node:24-bookworm-slim` | Next.js standalone output |

---

## Troubleshooting

### `db-init` exits with non-zero

```bash
docker compose logs db-init
```

Common causes:
- PostgreSQL not yet healthy when db-init started (should not happen with healthcheck)
- Migration conflict (check migration files)
- Seed error (check `backend/prisma/seed.ts`)

### Backend fails healthcheck

```bash
docker compose logs backend
```

Common causes:
- `db-init` did not complete successfully
- Database URL unreachable (check `db` service is healthy)

### Admin or website shows "Cannot connect to API"

The browser calls `http://localhost:3001/api/v1` — verify:
1. The backend container is running: `docker compose ps`  
2. Port 3001 is published: you should see `0.0.0.0:3001->3001/tcp`
3. No other process is using port 3001 on your host

### Port conflict

If ports 3000, 3001, or 3002 are in use on your host:

```bash
# Stop other local services first, then:
docker compose up --build
```

Or edit `docker-compose.yml` to change the host port (left side of `host:container`).

### Clean rebuild

```bash
docker compose down -v
docker compose build --no-cache
docker compose up
```
