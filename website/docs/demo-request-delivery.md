# Demo-request workflow

The public Contact page sends every valid request to the Bizonix backend. The backend commits the request and its activity record to PostgreSQL before it attempts delivery. Resend credentials are backend-only.

## Local configuration

Set `BIZONIX_API_URL=http://localhost:3001/api/v1` in `website/.env.local`. Set these values in `backend/.env`, never in the website environment:

- `RESEND_API_KEY`
- `DEMO_REQUEST_FROM_EMAIL` — a sender verified in Resend
- `DEMO_REQUEST_TO_EMAIL` — the internal sales inbox

## Lifecycle

1. A visitor submits a consented demo request.
2. PostgreSQL records it as **New** and preserves the submitted context.
3. Resend sends the visitor a confirmation and notifies the internal inbox.
4. An admin claims the request, replies from its detail page, and may attach a demo time.
5. The admin moves it through Contacted, Qualified, Demo Scheduled, Demo Completed, Follow-up, and Converted (or Closed/Spam).
6. Every outbound email and delivery outcome appears in that request's history.

Inbound replies require a future Resend webhook and verified receiving domain; the admin can already send and record outbound responses end-to-end.
