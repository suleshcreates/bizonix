/**
 * Provider-agnostic event layer.
 *
 * Events are pushed onto `window.dataLayer`, which is the contract GTM (and
 * therefore GA4, Ads, Meta, LinkedIn) already reads. If no container is
 * installed the push is simply buffered on the array and nothing else happens,
 * so this file adds **no third-party script to the critical path** and no
 * tracking runs until a provider is deliberately configured.
 *
 * The privacy policy currently states that production analytics must be
 * documented before launch — installing the GTM snippet is that decision, and
 * it belongs in `layout.tsx` behind consent, not here.
 */

export type AnalyticsEvent =
  | "contact_page_view"
  | "contact_track_selected"
  | "contact_field_engaged"
  | "contact_field_abandoned"
  | "contact_form_submitted"
  | "contact_form_failed"
  | "contact_calendly_opened"
  | "contact_calendly_booked"
  | "contact_whatsapp_clicked"
  | "contact_email_clicked"
  | "contact_faq_opened";

/**
 * Module deep-page events. Kept in their own union so a component cannot fire
 * a contact-funnel event by accident, and so the module pages never reach for
 * a vendor SDK directly — everything still goes through `track`.
 */
export type ModuleAnalyticsEvent =
  | "module_cta_clicked"
  | "module_screenshot_viewed"
  | "module_screenshot_selected"
  | "module_video_played"
  | "module_faq_opened"
  | "module_related_clicked";

type Payload = Record<string, string | number | boolean | string[] | undefined>;

declare global {
  interface Window {
    dataLayer?: Payload[];
  }
}

export function track(event: AnalyticsEvent, payload: Payload = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}

/** Same transport as `track`, typed to the module-page event set. */
export function trackModuleEvent(
  event: ModuleAnalyticsEvent,
  payload: Payload = {},
) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

/** Reads UTM parameters, falling back to the ones stored on first landing. */
export function readUtmParams(search: URLSearchParams): UtmParams {
  const fromUrl: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = search.get(key);
    if (value) fromUrl[key] = value.slice(0, 120);
  }
  if (Object.keys(fromUrl).length > 0) {
    try {
      sessionStorage.setItem("bz_utm", JSON.stringify(fromUrl));
    } catch {
      // Storage can be unavailable in private modes; attribution is optional.
    }
    return fromUrl;
  }
  try {
    const stored = sessionStorage.getItem("bz_utm");
    return stored ? (JSON.parse(stored) as UtmParams) : {};
  } catch {
    return {};
  }
}

/**
 * Warm traffic is anything that arrived from our own funnel already knowing the
 * product — a demo CTA on the site, or a campaign explicitly tagged as such.
 */
export function isWarmSource(utm: UtmParams, referrer: string): boolean {
  const campaign = `${utm.utm_campaign ?? ""} ${utm.utm_content ?? ""}`.toLowerCase();
  if (/demo|book|pricing|trial/.test(campaign)) return true;
  if (utm.utm_medium === "internal") return true;
  if (!referrer) return false;
  try {
    return new URL(referrer).host === window.location.host;
  } catch {
    return false;
  }
}
