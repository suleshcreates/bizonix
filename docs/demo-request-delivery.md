# Demo request delivery runbook

## Current production state

The Vercel production project has no environment variables configured. The Contact page therefore keeps its form, calendar, email, and WhatsApp conversion controls unavailable. This avoids accepting a lead that cannot be delivered.

## Required production configuration

Set these variables in the Vercel **Production** environment:

- `RESEND_API_KEY`: Resend API key for the verified sending domain.
- `DEMO_REQUEST_TO_EMAIL`: approved shared sales inbox that receives lead notifications.
- `DEMO_REQUEST_FROM_EMAIL`: verified Resend sender, for example `Bizonix Website <website@your-domain>`.
- `NEXT_PUBLIC_DEMO_REQUESTS_ENABLED=true`: public release switch. Set it only after sending a real test request.

Optional:

- `SLACK_WEBHOOK_URL`: posts a copy of each lead to the approved sales channel. Email remains the source of record.
- `NEXT_PUBLIC_CALENDLY_URL`: approved scheduling URL. Leave blank to use the form-first flow.
- `NEXT_PUBLIC_SALES_EMAIL`, `NEXT_PUBLIC_WHATSAPP_URL`, and `NEXT_PUBLIC_SALES_PHONE`: publish only approved public contact values.

## Delivery and follow-up flow

1. A visitor completes the consented demo form.
2. `/api/demo-request` validates the request, blocks common bot patterns, and assigns a lead priority from role, timeline, selected priorities, and phone availability.
3. Resend sends the complete request to `DEMO_REQUEST_TO_EMAIL` with the visitor email as the reply-to address.
4. If configured, Slack receives the same summary as a secondary notification.
5. The sales team replies from the approved inbox, confirms the session, and records the chosen time and outcome in its approved sales system.

## Release check

Before enabling the public flag, confirm all of the following in production:

1. A real test submission arrives in the approved shared inbox.
2. The reply-to address is the test visitor's address.
3. The optional Slack notification arrives in the intended private channel.
4. The success page is shown only after delivery succeeds.
5. Calendar, email, phone, and WhatsApp links use approved business values.

Do not set `NEXT_PUBLIC_DEMO_REQUESTS_ENABLED=true` if the inbox, sender, or sales follow-up owner is not ready.
