# Book demo design research

Reviewed official ERP demo pages for the September 2026 Book Demo redesign.

## Observed patterns

- [SAP Cloud ERP demo](https://www.sap.com/products/erp/cloud-erp-private/request-a-demo.html): outcome-led introduction explaining what the buyer will explore.
- [Microsoft Dynamics 365 Commerce demo](https://info.microsoft.com/ww-landing-Request-a-Demo-Dynamics365-Commerce.html): a live, one-to-one walkthrough connecting back-office, store and digital commerce. Page text was available in search; a direct fetch failed.
- [Oracle NetSuite](https://go.netsuite.com/TimeIsNow_2025): product-tour calls to action supported by customer evidence. Its linked personalised-tour form collects contact and business context.

These observations concern messaging and conversion structure; they are not a pixel-level visual audit or evidence of conversion performance.

## Bizonix implementation

The demo studio pairs a navy editorial introduction with a white two-stage request form. A lightweight interactive operating model connects warehouse, stores, franchise and books. Pointer-responsive depth and short transitions add dimension without requiring a WebGL runtime.

The existing 30-minute agenda becomes a four-part editorial timeline. On mobile, the request form precedes the exploratory model. The form retains validation, contact fields, consent, UTM capture and its existing API contract. Switching to the calendar preserves the draft.

GSAP handles entrance, scroll reveals and pointer tilt; Framer Motion transitions the workflow explanation. Reduced-motion preferences disable decorative movement. No customer logos, proof metrics or availability claims were invented. Email delivery remains a separate, previously deferred integration.
