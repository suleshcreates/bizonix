# Bizonix marketing website

Phase 1 of 3 for the Bizonix ERP product website. This phase contains the brand shell, Home, Product, Contact, legal stubs, SEO shell and demo-request API. Module, feature, industry, pricing, customer, resource and company pages are intentionally deferred to Phase 2/3.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Production check

```bash
pnpm lint
pnpm build
pnpm start
```

## Demo-request email

The contact API uses [Resend](https://resend.com). Copy `.env.example` to `.env.local`, add a verified Resend key, recipient and sender identity, and replace every `TBD`/placeholder value. With no transport configured, the form fails gracefully and directs the visitor to WhatsApp.

Basic abuse protection is included: a honeypot and one accepted request per forwarded IP per minute. For multi-instance production hosting, replace the in-memory limiter with a shared store.
