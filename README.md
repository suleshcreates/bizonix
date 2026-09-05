# Bizonix marketing website

Next.js App Router site with Home, Product, Features, Modules, Industries, About, Contact, legal pages and a demo-request API. Detail routes use typed content and reusable templates.

## Development

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`. Run commands from this directory.

## Project guide

- [Directory structure and conventions](docs/project-structure.md)
- [Images by consuming section](docs/image-inventory.md)
- [Unused component candidates](docs/unused-code.md)
- [Content gaps](docs/content-gaps.md)

Page styles live in `src/components/pages/<page>/<page>.module.css`. Images live in `public/images/`, grouped by page and section. Shared branding and product screenshots live in `public/images/shared/`. Design references belong in `references/`.

## Verification and production

```sh
pnpm audit:project:write
pnpm check
pnpm start
```

The audit refreshes the inventories. `check` validates structure, lint, types and the production build. Review the remaining release checks in the structure guide before deployment.

## Demo-request email

The API uses Resend. Configure variables expected by `src/app/api/demo-request/route.ts` with a verified sender, recipient and transport key. Store secrets in `.env.local` or the hosting environment. Without transport, the form directs visitors to the alternative contact channel.

Abuse protection includes a honeypot and in-memory per-IP rate limiting. Use a shared store for multi-instance hosting.
