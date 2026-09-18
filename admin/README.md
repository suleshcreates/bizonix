# Bizonix Admin

The private Bizonix operating console. It contains administration UI only: authentication, dashboard, enquiries, publishing controls, audit activity, and settings. It consumes the REST API in `../backend`.

## Development

```sh
pnpm install
pnpm dev
```

Open `http://localhost:3002`. Create `.env.local` with:

```sh
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000
```

The public marketing site lives exclusively in `../website`. Database, authentication, authorization, and content APIs live exclusively in `../backend`.
