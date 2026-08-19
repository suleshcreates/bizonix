# Bizonix website — current-state and content-gap audit

**Audit scope:** the `website/` Next.js marketing app only. This report deliberately does not inspect or infer from the separate product codebase. A claim is marked **BUILT & REAL** only where the marketing repository itself provides a clear, non-placeholder factual anchor. Most capability claims are therefore **BUILT & GENERIC/GUESSED** pending Stage 2 verification, even when they are plausible.

**Status key**

- **BUILT & REAL** — implemented and supported by an explicit, non-placeholder repository fact.
- **BUILT & GENERIC/GUESSED** — implemented, but not independently grounded in this repository; includes illustrative UI data and marketing assertions.
- **NOT YET BUILT** — absent from the Phase 1 app.

## 1. Route inventory

| Route | SRS / scope mapping | Build status | Notes |
|---|---|---|---|
| `/` | Home | Fully built | 11 rendered sections when the hero trust strip is counted separately. |
| `/product` | Product / Platform | Fully built | Seven rendered sections. |
| `/contact` | Contact / Book a demo | Fully built | Contact information plus working-form UI; delivery depends on environment configuration. |
| `/privacy` | Legal | Stub / draft | Explicitly labelled draft and pending legal review. |
| `/terms` | Legal | Stub / draft | Explicitly labelled draft and pending legal review. |
| `/api/demo-request` | Contact form endpoint | Partially built | Validation, honeypot and Resend call are implemented; without required environment variables it returns a configuration error. |
| `/sitemap.xml` | SEO endpoint | Partially built | Generates the five public routes but uses a TBD domain unless configured. |
| `/robots.txt` | SEO endpoint | Partially built | Implemented but uses the same TBD domain in its sitemap URL. |
| Any unmatched path, including `/modules`, `/industries`, `/pricing`, `/customers`, `/resources`, `/about`, `/features`, and nested module/industry paths | Phase 2/3 routes | 404-expected | These are linked in navigation/footer but have no page files. The custom 404 explicitly says they are reserved for a later phase. |

The Phase 1 README explicitly defers module, feature, industry, pricing, customer, resource, and company pages. It does not define a separate FAQ route; FAQ is a Home section. Source: `README.md`, `src/app/`, `src/app/not-found.tsx`, `src/lib/site-config.ts`.

## 2. Per-section audit

### Shared shell → Header, navigation, and footer

- **Status:** BUILT & GENERIC/GUESSED
- **What content currently exists:** Primary navigation advertises Product, Solutions, Industries, Pricing, Customers, Resources, and About; the header also offers Login, Brochure, and Book a demo. The footer repeats those groups, says “Business and Operation Smarter Together,” “Built in India for multi-entity retail operators,” offers a newsletter, and presents a team image.
- **Where content is guessed:** The breadth of the navigation implies pages and solutions that are not built. “Built in India for multi-entity retail operators” is not corroborated here. Newsletter copy (“Get product updates… No spam.”) is unsupported because submit is prevented and no subscription endpoint exists. Login, brochure, and contact values resolve to TBD/placeholder defaults if environment variables are absent.
- **Specific information needed to make this real:**
  - Which public pages and module/industry pages are approved for launch, and which should be hidden until built?
  - What is the production tenant/login URL, brochure asset, WhatsApp number, sales email, phone, company address, and canonical site URL?
  - Is a newsletter actually offered? If so, which provider, consent wording, data use, and confirmation flow apply?
  - Is the team photo current, authorised for public marketing, and accurately described as “The Bizonix team”?

### Home → Hero

- **Status:** BUILT & GENERIC/GUESSED
- **What content currently exists:** “Wholesale, retail & franchise. One operating truth.” The hero claims Bizonix “consolidates inventory, orders and finance across every entity,” with entity scopes “HQ / Shared masters,” “Retail / Branch control,” and “Franchise / Partner scope.”
- **Where content is guessed:** The cross-entity consolidation, shared masters, and branch/partner scope are asserted without an evidence reference in the website repository.
- **Specific information needed to make this real:**
  - What entities and workflows actually share masters, and what data is deliberately isolated?
  - What does “one operating truth” mean in product terms, and where are manual sync/imports still used?

### Home → Trust strip

- **Status:** BUILT & GENERIC/GUESSED
- **What content currently exists:** Four short proof-point labels: “Live with Pratyush,” “GST-ready books,” “Barcode piece stock,” and “Multi-entity RBAC.”
- **Where content is guessed:** All four claims are presented as established proof but no underlying source or customer authorisation is present. “Live with Pratyush” is a named deployment claim, while the remaining labels compress complex capability assertions into unqualified phrases.
- **Specific information needed to make this real:**
  - Is Pratyush a live, named customer that has approved public reference use? What legal name and exact approved wording apply?
  - Does “GST-ready” mean tax invoices only, GST reporting, e-invoicing, e-way bills, or something else?
  - What barcode granularity is supported (individual piece, serial, batch/series), at which steps, and with what exceptions?
  - What RBAC roles and entity-boundary rules actually exist?

### Home → Who it’s for

- **Status:** BUILT & GENERIC/GUESSED
- **What content currently exists:** Three audience cards: Wholesale HQ (“Purchase, allocate and protect working capital”), Company retail/POS (“Scan, sell, return and close the counter”), and Franchise outlets (“replenish and sell… while the brand retains allocation and visibility”). Mini-panels show allocation, POS, and replenishment stories.
- **Where content is guessed:** Claims such as “numbers already reconciled,” “purchase plan matched to demand,” outlet “suggested order,” and the card workflows are unverified. The mini-panel data is illustrative: 18,420 available, 6,280 committed, “Classic Oxford Shirt,” `BX-4021`, ₹2,490, and 24-piece suggested order.
- **Specific information needed to make this real:**
  - What are the actual workflows, permissions, and outcomes for HQ, company stores, and franchisees?
  - Does the product provide replenishment suggestions/auto-indents, allocation controls, cash-session control, and demand/planning signals? Specify rules and field names.
  - Which persona owns purchase, transfer, billing, return, and reconciliation actions?

### Home → Challenges / problem map

- **Status:** BUILT & GENERIC/GUESSED
- **What content currently exists:** Six pains: late visibility, stock in the wrong place, off-system franchise orders, month-end reconciliation, GST re-entry, and lost piece identity. Example badges include “T+24H delay,” “1,248 vs 0,” and “₹30K mismatch.”
- **Where content is guessed:** The six problems are credible positioning hypotheses, but the quoted data and causal statements are not tied to a customer research source. In particular, “T+24H delay,” “1,248 here · 0 there,” and “₹30K unexplained” read as real observations but are fabricated examples in code.
- **Specific information needed to make this real:**
  - Which of these pains are evidenced by target customers or Pratyush, and which should be removed or reframed as conditional?
  - What honest before-state examples can be used, with approval and no fabricated timings, quantities, or rupee values?
  - What gaps does Bizonix demonstrably solve versus merely make visible?

### Home → Operating spine

- **Status:** BUILT & GENERIC/GUESSED
- **What content currently exists:** A six-step story: Purchase/GRN → Barcode → Stock transfer → POS/Wholesale → Returns → Accounting. It claims each handoff retains entity, piece, value, and GST context and ends “Nothing is re-entered.”
- **Where content is guessed:** The flow may be product-shaped but is not verified. All panel records are illustrative, including `PO-1042`, “Meridian Textiles,” “Om Fabrics Co.,” sample barcodes, 220 pieces, ₹1.84L, and the “42 pieces transferred” signal. “Nothing is re-entered” is an absolute claim needing careful qualification.
- **Specific information needed to make this real:**
  - Provide the real GRN-to-barcode-to-transfer-to-sale/return-to-ledger lifecycle, including exact document names, required fields, statuses, and exceptions.
  - Which contexts propagate automatically; which values are entered/edited by users; where are separate postings still required?
  - Can wholesale and POS genuinely use the same sale-flow model? Explain the differences.
  - What accounting entries and GST information are actually created, and when?

### Home → Solutions grid

- **Status:** BUILT & GENERIC/GUESSED
- **What content currently exists:** Nine modules: Inventory, Procurement, Sales & POS, Wholesale, Franchise, Accounting, Ecommerce, Analytics, and Security. The data source promises, for example, “Bill, fulfill, cartonise and dispatch,” “catalog and orders connected to the same inventory truth,” and “roles and entity scope.”
- **Where content is guessed:** Every benefit line is unlinked to product evidence. “Cartonise,” ecommerce storefront/capabilities, cross-entity analytics, and the scope of security controls are especially load-bearing claims that could overstate the product.
- **Specific information needed to make this real:**
  - For each module, list live capabilities, non-capabilities, role access, key documents/reports, and differentiators.
  - Is cartonisation present? What exactly happens in wholesale fulfilment and dispatch?
  - What ecommerce catalog, order, CMS, and storefront functions are live versus roadmap or integration-dependent?
  - What reports exist in Analytics, and can they aggregate across entities?

### Home → Industry band

- **Status:** BUILT & GENERIC/GUESSED
- **What content currently exists:** The site presents Apparel & Footwear, Imitation Jewellery, and Franchise Networks as relevant industries and routes visitors to the unbuilt `/industries` pages.
- **Where content is guessed:** Industry fit is asserted without supported use cases. Links are knowingly 404 in Phase 1.
- **Specific information needed to make this real:**
  - Which industries are currently served, with named/approved customer evidence?
  - What different master data, barcode, pricing, GST, return, or franchise requirements make each vertical a genuine fit?
  - When will the linked industry pages exist, or should links be removed/disabled now?

### Home → Pratyush case-study teaser

- **Status:** BUILT & GENERIC/GUESSED
- **What content currently exists:** A large interactive section declares “Flagship Enterprise Deployment / Production Live,” “Pratyush Retails. 20+ Entities on One Core,” a 3,842-and-rising transaction ticker, four operational nodes, before/after transformations, live transaction stream, and a customer quote/case-study callout.
- **Where content is guessed:** This section contains the strongest fictional-looking claims in the website. Examples include “99.98% sync,” 62,400 pieces, 99.94% GRN accuracy, 840 pcs/hr, 8 stores, 12 franchise partners, 1.2s/item POS speed, 100% UPI clearance, 0-minute reconciliation lag, same-day close, “-90% Close Time,” “100% Audit Ready,” named cities, product/SKU numbers, transaction amounts, synthetic `pratyush://telemetry` IDs, a random incrementing transaction count, automated e-invoices/e-way bills, and the attribution-style quote. None is sourced or marked demo data.
- **Specific information needed to make this real:**
  - Is Pratyush’s name, logo, quote, network shape, operational data, and case study approved for publication? Obtain the exact approved permissions and attribution.
  - What is the truthful baseline, deployment scope, go-live date, actual entities/sites, live modules, and honest outcomes? Use qualitative outcomes if numeric evidence is unavailable.
  - Which claims are measured, over what period, by whom, and can they be disclosed? Provide sources for every KPI.
  - Are e-invoice, e-way bill, bank-feed matching, auto-indent, credit-limit automation, and realtime reconciliation actually live for this customer?
  - Replace simulation-only panels with clearly labelled anonymised workflow examples unless customer data is approved.

### Home → Compliance band

- **Status:** BUILT & GENERIC/GUESSED
- **What content currently exists:** A compliance-oriented band positions tax, financial control, and operational documentation as connected to the daily operating flow.
- **Where content is guessed:** The implied coverage of accounting/GST compliance is not bounded by documented product behavior or legal/compliance review.
- **Specific information needed to make this real:**
  - Enumerate available accounting, GST, invoice, return, and reporting functions, including exclusions and dependency on implementation setup.
  - Confirm whether any statements need tax/legal qualification or jurisdiction-specific wording.

### Home → FAQ

- **Status:** BUILT & GENERIC/GUESSED
- **What content currently exists:** Six answers cover deployment, franchise scope, individual-piece barcodes, accounting/GST, ecommerce inventory, and rollout support. The UI also includes category filters and search.
- **Where content is guessed:** Answers use phrases such as “Bizonix supports piece and series barcode workflows,” “covers tax invoices… and GST-oriented reporting,” and “includes ecommerce catalog, order and storefront capabilities,” without proof. “Designed as” and “should be confirmed” partially qualify claims but do not establish what is live.
- **Specific information needed to make this real:**
  - Give approved, factual answers for deployment/hosting, implementation/migration, franchise permissions, barcode workflow, accounting/GST, ecommerce, support, training, SLAs, and constraints.
  - Which rollout commitments (including timeline, support channels, data migration, and training) may be stated publicly?

### Home → Final CTA

- **Status:** BUILT & GENERIC/GUESSED
- **What content currently exists:** The closing call to action invites a workflow demo and illustrates operating alerts such as “e-Way Bill generated for Wholesale batch #9281.”
- **Where content is guessed:** The sample alerts and implied real-time document generation are fictional unless verified. The CTA promise needs alignment with the actual sales/demo process.
- **Specific information needed to make this real:**
  - What happens after a demo request, who responds, and what type of workflow demonstration can be promised?
  - Which alerts/events are actual product outputs, and what document types (including e-way bill) can the product generate?

### Product → Hero

- **Status:** BUILT & GENERIC/GUESSED
- **What content currently exists:** Product positioning says Bizonix connects warehouse, retail, franchise, ecommerce, and finance “without mixing operating entities.”
- **Where content is guessed:** The breadth of connected surfaces and the assurance about entity separation require product verification.
- **Specific information needed to make this real:**
  - Define tenant, company, branch, warehouse, store, franchise, and user boundaries; identify which data can cross them.
  - Confirm exactly which business surfaces are live and whether ecommerce is native, integrated, or planned.

### Product → Operating model

- **Status:** BUILT & GENERIC/GUESSED
- **What content currently exists:** A visual model depicts shared masters/context with clear entity boundaries across central, retail, franchise, and finance operations.
- **Where content is guessed:** The diagram’s relationships and claims about one shared context are architecture assertions with no accompanying system model.
- **Specific information needed to make this real:**
  - Supply a validated operating/tenancy diagram: what is global, per entity, shared read-only, transferable, or inaccessible?
  - Identify real workflows that demonstrate central oversight and local autonomy.

### Product → Four capability pillars

- **Status:** BUILT & GENERIC/GUESSED
- **What content currently exists:** Inventory lists piece/series barcodes, GRN/transfers/returns, audit/damage/adjustments; Commerce lists POS, wholesale billing/dispatch, ecommerce; Network lists allocation/scope/visibility; Finance lists COA, journals, ledgers, AR/AP, P&L, balance sheet, and GST reports.
- **Where content is guessed:** This is a dense capability catalogue, none of whose exact availability is evidenced in the site repository.
- **Specific information needed to make this real:**
  - Verify every listed capability at feature level and identify important limitations, permissions, and implementation prerequisites.
  - Confirm whether audit/damage adjustments, P&L/balance sheet, and GST reports are live, and provide their actual naming/coverage.

### Product → Day in the system

- **Status:** BUILT & GENERIC/GUESSED
- **What content currently exists:** Four time-based workflows: morning GRN/barcode/stock release, counter sale/session/payment, franchise transfer/receipt, and month-end journals/ledgers/P&L.
- **Where content is guessed:** “Open a controlled billing session,” “sell against live piece identity,” and the staged steps are unverified operational choreography.
- **Specific information needed to make this real:**
  - Provide a real day-in-the-life from an operator, retaining only actual tasks, labels, and sequencing.
  - Explain stock-release, counter-session, transfer receipt, payment posting, and month-end processes; note manual touchpoints and exceptions.

### Product → Security & tenancy

- **Status:** BUILT & GENERIC/GUESSED
- **What content currently exists:** Three claims: roles match responsibility, entity scope stays explicit, and audit-minded operations preserve who did what, where, and against which document. The section responsibly avoids certification claims.
- **Where content is guessed:** “Preserve who did what” implies audit-log coverage whose retention, immutability, actions, and entity visibility are unknown.
- **Specific information needed to make this real:**
  - Document actual permission model, role matrix, entity-scoping semantics, audit events, exports, retention, and admin controls.
  - What security claims can be made publicly (hosting, encryption, backups, certifications), and which must remain unstated?

### Product → Integration surface

- **Status:** BUILT & GENERIC/GUESSED
- **What content currently exists:** Ecommerce is described as catalog/order/CMS/storefront inside the product; WhatsApp can “share invoice context”; APIs are explicitly marked “Coming soon.”
- **Where content is guessed:** Native ecommerce/CMS/storefront and WhatsApp invoice sharing need verification. The API roadmap is deliberately cautious but still needs a public commitment decision.
- **Specific information needed to make this real:**
  - Confirm ecommerce features, deployment model, payment/order/stock behavior, and whether they are production-ready.
  - What exactly can be shared through WhatsApp (file/link/template), by whom, and through which integration?
  - Is an API planned, what scope is safe to mention, and what timeframe/status wording is approved?

### Product → CTA

- **Status:** BUILT & GENERIC/GUESSED
- **What content currently exists:** “Bring the workflow. Leave with a clearer system map,” with demo and unbuilt modules-page links.
- **Where content is guessed:** This commits to a consultation outcome without definition; “Explore modules” is a 404 link.
- **Specific information needed to make this real:**
  - Define the demo/consultation deliverable and qualification process.
  - Build the module page or replace the secondary CTA.

### Contact → Contact promise and channels

- **Status:** BUILT & GENERIC/GUESSED
- **What content currently exists:** The page asks about warehouse, store, and franchise operations; it exposes WhatsApp, email, phone, and promises “We’ll respond within 1 business day.”
- **Where content is guessed:** All external contact values default to placeholders. The one-business-day SLA is not backed by an operational policy. Phone uses `href="#"` even if a number is configured.
- **Specific information needed to make this real:**
  - Provide approved production contact details and ownership/escalation process.
  - Confirm the response-time commitment, business-day timezone, and exceptions.
  - Decide whether phone should be a callable `tel:` link and whether WhatsApp/business inbox is actively monitored.

### Contact → Demo form and submission experience

- **Status:** BUILT & REAL
- **What content currently exists:** A functional form UI captures name, company, phone, optional email/city/industry/company size/message, consent, and a hidden honeypot. It validates locally and sends to `/api/demo-request`; server code validates again, throttles one accepted request/IP/minute, and uses Resend when configured.
- **Where content is guessed:** The success copy repeats the unverified one-business-day response promise. “Calendar booking will be added in Phase 3” is a roadmap statement. Actual lead delivery is unavailable until Resend and recipient/sender environment variables are set.
- **Specific information needed to make this real:**
  - Confirm required/optional lead fields, privacy/consent wording, data controller, retention, and CRM/email routing.
  - Provide verified Resend sender/recipient details and determine whether Calendly is an approved roadmap claim.
  - Decide whether a one-minute/IP throttle is appropriate for the production hosting topology.

### Privacy → Draft legal structure

- **Status:** NOT YET BUILT
- **What content currently exists:** A clearly labelled draft placeholder addressing collection, use, cookies, sharing/retention, and user choices; each expressly says final wording remains subject to legal review.
- **Where content is guessed:** All legal statements are provisional by their own text.
- **Specific information needed to make this real:**
  - Obtain counsel-approved policy covering controller/contact details, lawful bases, processors, hosting location, cookies/analytics, retention, rights process, cross-border transfers, and contact channels.

### Terms → Draft legal structure

- **Status:** NOT YET BUILT
- **What content currently exists:** A clearly labelled draft for website use, product information, IP, liability, and governing law; it says India is intended but jurisdiction remains unconfirmed.
- **Where content is guessed:** All terms are provisional; product promises are expressly non-binding.
- **Specific information needed to make this real:**
  - Obtain counsel-approved terms with correct entity, jurisdiction, disclaimers, permitted use, IP rights, liability language, and enforceable acceptance/presentation requirements.

## 3. Sitewide content-gap summary

### Highest-priority gaps

1. **Pratyush case study:** remove, label as illustrative, or replace only after customer permission and source-backed outcomes. It currently presents invented-looking telemetry as live production evidence.
2. **Core differentiation and workflow claims:** verify the hero, operating spine, product operating model, and capability pillars. These make the principal purchase promise.
3. **Module benefits and ecommerce/accounting claims:** substantiate every module or trim it to verified scope, especially cartonisation, storefront/CMS, GST/e-invoice/e-way-bill, accounting reports, and integrations.
4. **Contact and launch facts:** replace every TBD external value; validate response-time promise, demo process, email delivery, and consent language.
5. **Navigation integrity:** hide or replace links to intentionally absent Phase 2/3 routes to avoid presenting unavailable material as current.
6. **Legal and SEO launch readiness:** complete counsel-approved legal content and replace TBD site domain before indexing.

### Consolidated Stage 2 product-audit checklist

#### Product architecture and entity model

- What are the real tenant/company/brand/branch/warehouse/store/franchise relationships and their data boundaries?
- Which masters, stock, pricing, catalog, documents, financial records, and reports are shared versus scoped?
- What roles exist, what can each role do, and what audit events are captured?

#### Inventory, procurement, barcode, and transfers

- Give the actual lifecycle from purchase order/GRN to labels/barcodes, stock availability, transfer, sale, return, damage, and adjustment.
- Which barcode modes exist (piece/serial/batch/series), what data is encoded, and what exceptions can users process?
- What are real document/status/field names and how do receiving, transfer dispatch, and destination receipt work?

#### Sales, wholesale, retail, and franchise

- What POS counter/session, pricing, payment, cash-drawer, return, and invoice workflows are live?
- What wholesale fulfilment, dispatch, cartonisation, credit, and billing features exist?
- What franchise allocation, indent/replenishment, approval, credit-limit, and partner-visibility rules are actually implemented?

#### Finance, tax, and reporting

- Which operational events create which financial records, and what still requires manual entry or review?
- What COA, journal, ledger, AR/AP, receipt, P&L, balance-sheet, and GST reports are live?
- Is e-invoicing, e-way bill, bank-feed matching, GSTR preparation, or continuous reconciliation supported? State scope, dependencies, and exclusions precisely.

#### Ecommerce, WhatsApp, APIs, and integrations

- Are catalog, orders, CMS, storefront, and stock synchronisation native and production-ready? What payment/fulfilment scope exists?
- What invoice context can be sent through WhatsApp, via what mechanism, and with what permissions?
- What integrations/APIs are live, planned, or explicitly out of scope?

#### Deployment and service delivery

- What deployment/hosting options, migration process, implementation phases, training, support channels, SLAs, and customer responsibilities can be promised publicly?
- What demo result is actually delivered after a lead submits the contact form?

#### Customer evidence

- Is Pratyush an approved public customer? What factual deployment scope, quote, names, location labels, outcomes, and assets have written approval?
- What customer evidence can support industry fit for apparel/footwear, imitation jewellery, and franchise networks?
- For any numeric claim, what is the source, period, definition, and approval status?

### Placeholder and fictional data to review later

| Location | Placeholder / fictional content |
|---|---|
| `src/lib/site-config.ts` | `BIZONIX_DOMAIN_TBD`, `TENANT_PORTAL_URL_TBD`, WhatsApp, phone, sales email, and brochure defaults. |
| `src/components/sections/case-study-teaser.tsx` | All Pratyush topology metrics, outcomes, cities, SKU/product names, IDs, event stream, random transaction counter, quote/case-study framing, and “Production Live” telemetry. |
| `src/components/sections/platform-spine.tsx` | Meridian/Om/Vantage supplier names, POs, quantities, barcodes, products, amounts, and illustrated workflow signals. |
| `src/components/sections/audience-section.tsx` | Allocation numbers/percentages, product/SKU/prices, counter number, and replenishment quantities/statuses. |
| `src/components/sections/challenges-section.tsx` | “T+24H,” “1,248 vs 0,” “₹30K mismatch,” and all scenario labels that resemble customer evidence. |
| `src/components/sections/final-cta.tsx` | Sample operational alert/event text, including e-way bill batch reference. |
| `src/lib/content/home.ts` | A duplicate/unconsumed set of marketing claims and FAQs; it can drift from rendered components and should be consolidated or removed after verification. |
| `src/components/layout/footer.tsx` | Newsletter presentation has no delivery/subscription behavior; team image requires rights/accuracy check. |
| `src/components/sections/demo-form.tsx`, `src/app/contact/page.tsx` | One-business-day promise and Phase 3 calendar roadmap. |
| `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/components/legal-page.tsx` | Explicit legal drafts, not production policies. |
| `src/app/sitemap.ts`, `src/app/robots.ts` | Canonical/sitemap URLs depend on the unresolved site-domain configuration. |

## Verification checklist

- [x] Every current filesystem route and generated endpoint is inventoried.
- [x] Every rendered Home, Product, Contact, and legal-page section is explicitly tagged.
- [x] Guessed content is called out with concrete claims/examples.
- [x] Each section includes answerable information requests.
- [x] The consolidated checklist is organised for a focused Stage 2 audit.
