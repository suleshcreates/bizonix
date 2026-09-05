# Website Audit — Remaining Work

This checklist records the work still required after comparing the 29 August 2026 website audit with the current Bizonix site. Items already implemented are intentionally excluded.

## 1. Business details and public configuration

Provide and configure approved production values for:

- Production domain and canonical URL.
- Tenant/login portal URL.
- Sales email, phone number, WhatsApp number, and office address.
- Legal entity name, CIN, GSTIN, and legal contact details.
- Privacy Policy and Terms owner/contact details.

Do not publish placeholder values or infer these details.

## 2. Public pages and navigation

- Publish a real brochure or remove all brochure references.
- Build and approve Pricing, Customers, and Resources pages before returning them to navigation.
- Export and validate a production Open Graph image for social sharing if the current SVG does not render reliably on target platforms.

## 3. Customer proof and operational figures

- Obtain written customer approval before publishing names, logos, testimonials, deployment figures, transaction volumes, store counts, or outcomes.
- Add approved, redacted product screenshots only after sensitive operational data has been checked.
- Keep representative-model and illustrative-data disclosures until approved proof is available.

## 4. Product and compliance claims

Verify each public claim against the product and operating policy before publishing it:

- Supported POS hardware, scanners, printers, and other device compatibility.
- GST, e-invoice, e-way bill, and other statutory workflow scope.
- Integrations, offline behaviour, audit trail, access roles, and implementation commitments.
- Any claim that cannot be demonstrated in the product should be removed or rewritten as a capability discussion rather than a promise.

## 5. Homepage and contact conversion

- Add a trust strip only after verified customer, footprint, support, or implementation data is approved.
- Enable call and WhatsApp CTAs after real contact details are configured.
- Confirm where demo requests are delivered and document the sales follow-up workflow.

## 6. Content consistency

- Review all industry, feature, module, Privacy, and Terms pages against the same evidence standard.
- Keep terminology consistent across the site, especially references to operations, connected records, representative data, and feature names.
- Remove duplicate or conflicting capability statements.

## 7. Production code and asset cleanup

- Review the unused-source inventory. The project audit currently reports 54 unreachable source files, including 46 components.
- Remove files confirmed to be obsolete; retain reusable components only where a concrete future use is documented.
- Complete page-level CSS consolidation so each page has one clear stylesheet entry point.
- Complete image ownership cleanup so assets are stored under their page/feature/industry directory with shared assets separated clearly.

## Definition of complete

This audit can be closed when all public business details and compliance claims are verified, all published customer evidence has written approval, navigation links lead to complete pages, and the unused-code and asset inventories have been resolved.
