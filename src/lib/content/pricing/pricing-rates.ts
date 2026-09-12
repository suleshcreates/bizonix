import "server-only";

/**
 * Internal pricing inputs. NOT PUBLIC.
 *
 * These are the substitution slots for commercial terms that have not been
 * settled. They are preserved here so real figures can be dropped in later
 * without redesigning anything, and they are deliberately kept out of the
 * public content model so that no build can render them by accident.
 *
 * `import "server-only"` is the enforcement, not a convention: if any file
 * carrying `"use client"` ever imports this module — directly or through a
 * chain — the build fails rather than quietly shipping the table inside a
 * JavaScript chunk. That is exactly how the tokens leaked before this split:
 * `pricing-tiers.tsx` is a client component, so importing the content module
 * bundled every token into `static/chunks`, including the annual rates the
 * page never rendered.
 *
 * When real pricing is approved:
 *   1. replace the token strings below with the agreed figures
 *   2. decide, as a separate and explicit decision, whether the public page
 *      should show them — see `priceDisclosure` in ./pricing.ts
 *
 * Nothing in this file reaches the browser until step 2 is taken.
 */

export type BillingPeriodKey = "monthly" | "annual";

/** Per-tier rate slots, by billing period. Enterprise is always quoted. */
export const internalTierRates: Record<
  string,
  Partial<Record<BillingPeriodKey, string>>
> = {
  starter: {
    monthly: "{{price_starter_monthly}}",
    annual: "{{price_starter_annual}}",
  },
  growth: {
    monthly: "{{price_growth_monthly}}",
    annual: "{{price_growth_annual}}",
  },
  enterprise: {},
};

/** Per-tier capacity slots. Seat and entity counts are commercial terms too. */
export const internalTierLimits: Record<
  string,
  { entities?: string; users?: string }
> = {
  starter: { entities: "1", users: "{{users_starter}}" },
  growth: { entities: "{{entities_growth}}", users: "{{users_growth}}" },
  enterprise: {},
};

/** Add-on rate slots, keyed by the add-on id in ./pricing.ts. */
export const internalAddOnRates: Record<string, string> = {
  entity: "{{price_addon_entity}}",
  franchise: "{{price_addon_franchise}}",
  ecommerce: "{{price_addon_ecommerce}}",
  counter: "{{price_addon_counter}}",
  migration: "{{price_addon_migration}}",
};

/** The annual discount, once there is one to state. */
export const internalAnnualSaving = {
  percentage: "{{annual_pct}}",
  perTier: {
    starter: "{{annual_saving_starter}}",
    growth: "{{annual_saving_growth}}",
  },
} as const;

/**
 * Commercial terms the FAQ will spell out once they are agreed. Held here
 * rather than appended to the published answers, which is where they were
 * previously rendering as visible `{{…}}` fragments.
 */
export const internalPendingTerms: Record<string, string> = {
  counted: "{{pricing_basis_note}}",
  switch: "{{tier_change_terms}}",
  annual: "{{annual_billing_terms}}",
  implementation: "{{implementation_terms}}",
  trial: "{{trial_terms}}",
  support: "{{support_sla}}",
  contract: "{{contract_terms}}",
};
