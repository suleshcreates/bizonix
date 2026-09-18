# Bizonix backend

## Activate demo requests locally

1. Set working PostgreSQL `DATABASE_URL` and `DIRECT_URL` values in `.env`.
2. Set `RESEND_API_KEY`, `DEMO_REQUEST_FROM_EMAIL`, and `DEMO_REQUEST_TO_EMAIL` in `.env`. The sender must be verified in Resend.
3. Apply the database migration:

   ```powershell
   .\node_modules\.bin\prisma.cmd migrate deploy
   ```

4. Create the initial administrator if needed by setting `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`, then run:

   ```powershell
   .\node_modules\.bin\ts-node.cmd prisma/seed.ts
   ```

5. Start the API:

   ```powershell
   .\node_modules\.bin\nest.cmd start --watch
   ```

The website posts to `http://localhost:3001/api/v1/enquiries` by default. The admin console uses the same API for assignment, status changes, replies, scheduling, and recorded delivery history.
