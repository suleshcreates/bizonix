# Bizonix — Enterprise Commerce Operating System

<div align="center">

![Bizonix Platform](https://img.shields.io/badge/Bizonix-Enterprise%20OS-0B1F3A?style=for-the-badge&logoColor=white)
![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js&logoColor=white)
![NestJS 11](https://img.shields.io/badge/NestJS-11.0-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16.0-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma ORM](https://img.shields.io/badge/Prisma-6.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Docker Ready](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**The unified operating system for multi-outlet retail, distribution, and enterprise commerce.**

[Architecture](#monorepo-architecture) • [Quick Start (Docker)](#quick-start-docker) • [Local Development](#local-development) • [Environment Setup](#environment-configuration) • [Security](#security--governance) • [API Reference](#api-documentation)

</div>

---

## Overview

**Bizonix** is an enterprise-grade commercial operating system engineered to unify physical retail storefronts, warehouse inventory, billing/POS networks, customer loyalty programs, and digital conversion channels under a single centralized platform. 

The codebase is organized as a high-performance **pnpm monorepo** containing three core tiers:
1. **Storefront & Conversion Engine (`/website`)**: Next.js 15 App Router application delivering sub-second SSR performance, interactive product simulators, industry capability pillars, and demo acquisition workflows.
2. **Management Console (`/admin`)**: Next.js 15 private administrative back-office with granular Role-Based Access Control (RBAC), live CMS management (Hero variants, Navigation trees, Modules, Industries, FAQs, Partners), enquiry lead pipelines, and tamper-evident audit logging.
3. **Core Services API (`/backend`)**: NestJS 11 REST API engine backed by PostgreSQL 16 and Prisma ORM, featuring Argon2id credential hashing, HttpOnly session cookie rotation, multi-layer rate limiting, and automated Swagger OpenAPI documentation.

---

## Monorepo Architecture

```
Bizonix Monorepo
├── website/                     # Public storefront & marketing conversion engine (Port 3000)
│   ├── src/app/                 # Next.js App Router (Public routes, layout, SEO metadata)
│   ├── src/components/          # Interactive visual decks, simulators, responsive mega-menus
│   └── src/lib/content/         # Content resolvers (Dynamic modules, industries, fallback layers)
│
├── admin/                       # Enterprise back-office management console (Port 3002)
│   ├── src/app/                 # Admin console routes (Dashboard, CMS, Users, RBAC, Enquiries)
│   ├── src/components/          # Admin UI components, layout shell, data tables, modal editors
│   └── src/middleware.ts        # Route authentication & permission guards
│
├── backend/                     # Core NestJS business logic & persistence API (Port 3001)
│   ├── prisma/                  # Prisma schema, migrations history, and seed scripts
│   ├── src/auth/                # Dual-identifier login, Argon2id, JWT rotation, OTP lifecycle
│   ├── src/hero/                # Hero variants CMS (Publish, preview, draft workflows)
│   ├── src/modules/             # Product modules CMS and public catalog endpoints
│   ├── src/industries/          # Industry vertical solutions and public resolvers
│   ├── src/navigation/          # Dynamic navigation configuration engine
│   ├── src/enquiries/           # Demo requests, lead processing, and audit trails
│   ├── src/partners/            # Partner ecosystem management & marquee feeds
│   ├── src/faqs/                # Structured FAQ categories & Q&A endpoints
│   └── src/common/              # Guards (Auth, RBAC, Throttler), interceptors, filters
│
├── docker/                      # Multi-stage production container recipes
│   ├── backend.Dockerfile       # Node 24 Debian bookworm-slim multi-stage image
│   ├── admin.Dockerfile         # Next.js standalone output builder & runtime
│   ├── website.Dockerfile       # Next.js standalone conversion engine runtime
│   └── db-init.Dockerfile       # Automated migration & database seed runner
│
└── docker-compose.yml           # Unified orchestration with healthy dependency chains
```

---

## Technology Stack

| Layer | Technology | Version | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| **Monorepo Engine** | `pnpm` Workspaces | 11.x | Workspace isolation, frozen dependency lockfile, package sharing |
| **Website Front-end** | Next.js, React, Tailwind CSS | 15.1 / 19.2 | Public marketing pages, SSR/RSC rendering, lead booking forms |
| **Admin Console** | Next.js, Radix UI, Lucide Icons | 15.1 / 19.2 | Private administrative CMS, lead triage, permission manager |
| **Backend API** | NestJS, Express | 11.0 | RESTful services, dependency injection, validation pipes |
| **Database & ORM** | PostgreSQL, Prisma ORM | 16 / 6.0 | ACID transactions, strict relational schema, auto-migrations |
| **Authentication** | Argon2id, JWT, Secure Cookies | RFC 9106 | Password hashing ($m=65536, t=3, p=4$), HttpOnly cookie sessions |
| **Containerization** | Docker, Docker Compose | v2+ | Healthchecked, reproducible local and staging environments |

---

## Quick Start (Docker)

The fastest way to spin up the entire Bizonix ecosystem without installing PostgreSQL or Node dependencies locally is via Docker Compose:

### 1. Clone the Repository
```bash
git clone https://github.com/suleshcreates/bizonix.git
cd bizonix
```

### 2. Launch the Stack
```bash
docker compose up --build
```

### 3. Startup Orchestration
Docker Compose manages a deterministic dependency chain:
```
postgres:16 (Health check: pg_isready)
    ↓
db-init (Prisma migrate deploy + Prisma db seed)
    ↓
backend (NestJS 11 — Health check: /health/ready)
    ↓
admin (Port 3002) & website (Port 3000)
```

### 4. Verified Endpoints
Once initialized, access the following services:
- **Public Website**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **Swagger Documentation**: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)
- **Admin Console**: [http://localhost:3002](http://localhost:3002)

---

## Local Development (Native)

For active feature development and debugging, you can run services natively on your workstation:

### Prerequisites
- **Node.js**: `v20.x` or `v22.x` / `v24.x`
- **pnpm**: `v9.x` or `v11.x` (`corepack enable`)
- **PostgreSQL**: `16.x` running locally on port `5432`

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Database Setup & Migrations
Configure your PostgreSQL connection in `backend/.env`:
```bash
DATABASE_URL="postgresql://postgres:bizonix123@localhost:5432/bizonix"
```

Run Prisma migrations and seed the initial dataset:
```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
cd ..
```

### 3. Start Development Servers
You can start all three applications simultaneously from the monorepo root:
```bash
# Start all packages in dev mode
pnpm dev
```

Or run individual applications selectively:
```bash
# Backend API (Port 3001)
pnpm --filter backend run start:dev

# Admin Console (Port 3002)
pnpm --filter @bizonix/admin run dev

# Website (Port 3000)
pnpm --filter website run dev
```

---

## Environment Configuration

Copy the example configuration files and tailor them to your environment:

### Backend (`backend/.env`)
```ini
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:bizonix123@localhost:5432/bizonix

# Cryptographic Secrets (Minimum 32 characters in production)
JWT_ACCESS_SECRET=your_super_secret_jwt_access_key_min_32_characters_long
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key_min_32_characters_long
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Cross-Origin Policies
FRONTEND_ORIGIN=http://localhost:3000
ADMIN_ORIGIN=http://localhost:3002
CORS_ORIGINS=http://localhost:3000,http://localhost:3002

# Seed Credentials (Used by prisma/seed.ts)
SEED_ADMIN_EMAIL=suleshwaghmare7875@gmail.com
SEED_ADMIN_PASSWORD=Sulesh@2511
```

### Admin Console (`admin/.env.local`)
```ini
PORT=3002
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
INTERNAL_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000
```

### Public Website (`website/.env.local`)
```ini
PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
INTERNAL_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email Delivery (Resend - Optional in dev, required in prod)
RESEND_API_KEY=re_your_api_key_here
DEMO_REQUEST_TO_EMAIL=sales@bizonix.com
DEMO_REQUEST_FROM_EMAIL=Bizonix <contact@yourdomain.com>
```

---

## Security & Governance

Bizonix incorporates defense-in-depth architectural security controls:

### Authentication & Sessions
- **Argon2id Hashing**: Passwords hashed using industry-standard parameters ($m=65536, t=3, p=4$). Trimming issues and whitespace truncation vulnerabilities have been fully closed.
- **Cookie-Based JWT Rotation**: Short-lived access tokens (15 minutes) and rotating single-use refresh tokens (7 days) stored exclusively in `HttpOnly`, `SameSite=Lax`, `Secure` cookies.
- **Account Lockout Protection**: Automatic account lockout triggered upon 5 consecutive failed login attempts, preventing automated credential stuffing.

### Role-Based Access Control (RBAC)
Granular permission enforcement using NestJS parameter decorators (`@RequirePermissions('module.write')`):
- `SUPER_ADMIN`: Root authority with implicit bypass across all administrative operations. Protected by hierarchy checks preventing lower administrators from modifying, disabling, or resetting root users.
- `SITE_ADMIN`: Comprehensive content management access (CMS, Modules, Enquiries, Settings).
- `EDITOR`: Content editing without publishing authority.
- `VIEWER`: Read-only reporting access across dashboard metrics.

### Abuse Prevention & Rate Limiting
- **Multi-Window Throttling**: Throttled via `@nestjs/throttler` with tiered time-to-live buckets (`short: 10/s`, `medium: 50/10s`, `long: 120/60s`).
- **Sensitive Route Lockout**: Authentication endpoints (`/auth/login`, `/auth/forgot-password`, `/auth/verify-otp`) and lead submission endpoints enforce strict rate limits to eliminate brute-force and DDoS vectors.
- **Honeypot & Anti-Bot Filtering**: Public inquiry forms validate hidden form trap fields, client interaction timing, and RFC email compliance.

---

## API Documentation

The backend includes auto-generated **OpenAPI (Swagger)** documentation.

Start the backend and visit:  
👉 **`http://localhost:3001/api/docs`**

### Key REST Route Families

| Prefix | Scope | Description |
| :--- | :--- | :--- |
| `/api/v1/auth/*` | Public / Session | Login, token rotation, logout, me, password reset OTP flows |
| `/api/v1/public/*` | Public (Unauthenticated) | Fetch published heroes, module catalog, industry solutions, FAQs, partners |
| `/api/v1/admin/hero/*` | Protected (`hero.*`) | Draft hero variants, staging previews, activation and publishing |
| `/api/v1/admin/modules/*` | Protected (`modules.*`) | Product module visual decks, simulation configs, capability builders |
| `/api/v1/admin/industries/*` | Protected (`industries.*`) | Vertical industry blueprints, pressure points, before/after cards |
| `/api/v1/admin/navigation/*` | Protected (`navigation.*`) | Mega-menu hierarchy, dynamic callouts, link configurations |
| `/api/v1/admin/enquiries/*` | Protected (`enquiries.*`) | Inbound demo requests, lead statuses, notes, and activity timeline |
| `/api/v1/admin/users/*` | Protected (`users.*`) | User provisioning, role assignments, account lockout management |
| `/api/v1/admin/roles/*` | Protected (`roles.*`) | Role and permission matrix management |
| `/api/v1/admin/audit/*` | Protected (`audit.read`) | Tamper-evident administrative audit log inspection |

---

## Testing & Quality Assurance

```bash
# Run unit & integration tests in backend
pnpm --filter backend test

# Run security regression suite
pnpm --filter backend test:e2e

# Run monorepo type-checking across all packages
pnpm -r exec tsc --noEmit

# Lint codebase
pnpm -r run lint
```

---

## Production Deployment Checklist

Before deploying Bizonix into production environments:
1. **Rotate Secrets**: Set unique, high-entropy cryptographic strings ($\ge 32$ characters) for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.
2. **Reverse Proxy Configuration**: Ensure reverse proxies (Cloudflare, Nginx, AWS ALB) strip or sanitize untrusted `X-Forwarded-For` headers to guarantee client IP attribution integrity.
3. **Cookie Attributes**: In production (`NODE_ENV=production`), cookies automatically enforce `Secure=true` requiring HTTPS transport.
4. **Database Backups**: Schedule automated PostgreSQL WAL archiving and snapshots.

---

## License

This project is proprietary and confidential. All rights reserved &copy; Bizonix Operating Systems.
