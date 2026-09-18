import { siteConfig } from "@/lib/site-config";

/**
 * Where the public site lives, and whether that answer can be trusted.
 *
 * Canonicals, the sitemap, robots.txt, Open Graph URLs and every JSON-LD `@id`
 * are absolute URLs, so all of them resolve through this module and nothing
 * else. That is what keeps them from disagreeing with one another.
 *
 * The second job here is refusing to publish a development or preview host as
 * if it were production. `NEXT_PUBLIC_SITE_URL` is `http://localhost:3000`
 * during development, and a build that inherited it would otherwise emit
 * localhost canonicals and a localhost sitemap — the single most damaging
 * thing a "finished" SEO pass can ship. So the origin is classified, and when
 * it is not a real production host the site marks itself `noindex`, robots.txt
 * disallows everything and the sitemap comes back empty.
 *
 * Failing closed this way is recoverable: set the production domain and the
 * whole system turns on. Failing open is not — a poisoned index takes months
 * to clear.
 */

/** Hosts that must never be presented to a crawler as the canonical site. */
const NON_PRODUCTION_HOST =
  /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$|\.local$|\.example$|\.test$|\.vercel\.app$/i;

/** Placeholder markers left in `.env.example` until the domain is registered. */
const PLACEHOLDER = /_TBD|placeholder/i;

type ResolvedSite = {
  /** Origin with no trailing slash, e.g. `https://bizonix.com`. */
  origin: string;
  /** True only for an https production host with no placeholder markers. */
  isProduction: boolean;
  reason: string;
};

function resolveSite(): ResolvedSite {
  const raw = siteConfig.url.trim().replace(/\/+$/, "");

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return {
      origin: raw,
      isProduction: false,
      reason: `NEXT_PUBLIC_SITE_URL is not a valid URL (${raw || "empty"})`,
    };
  }

  const origin = `${parsed.protocol}//${parsed.host}`;

  if (parsed.protocol !== "https:")
    return { origin, isProduction: false, reason: `not https (${origin})` };
  if (NON_PRODUCTION_HOST.test(parsed.hostname))
    return {
      origin,
      isProduction: false,
      reason: `development or preview host (${parsed.hostname})`,
    };
  if (PLACEHOLDER.test(raw))
    return {
      origin,
      isProduction: false,
      reason: `placeholder domain (${parsed.hostname})`,
    };

  return { origin, isProduction: true, reason: "production host" };
}

const site = resolveSite();

/** Production origin, no trailing slash. Absolute URLs are built from this. */
export const SITE_ORIGIN = site.origin;

/**
 * Whether this build may present itself to search engines.
 *
 * When false every page renders `noindex, nofollow`, robots.txt disallows all
 * crawling and the sitemap is empty — see the module comment.
 */
export const IS_INDEXABLE_BUILD = site.isProduction;

/* One loud line during `next build` rather than a silent, un-indexable
   production deploy. Next builds pages across several worker processes and
   this module is evaluated in each, so it is kept to a single line: the
   repetition is unavoidable, the noise does not have to be. */
if (!site.isProduction && process.env.NODE_ENV === "production") {
  console.warn(
    `[seo] ${site.reason} — this build is noindex, robots.txt disallows all ` +
      `crawling and the sitemap is empty. Set NEXT_PUBLIC_SITE_URL to the ` +
      `live https domain to publish the site to search engines.`,
  );
}

/**
 * Absolute URL for an internal path.
 *
 * `/` resolves to the bare origin (no trailing slash) so the homepage canonical,
 * its sitemap entry and its `og:url` are byte-identical.
 */
export function absoluteUrl(path: string): string {
  if (path === "/" || path === "") return SITE_ORIGIN;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Identity used by metadata and structured data. Facts only. */
export const seoIdentity = {
  siteName: siteConfig.name,
  legalName: siteConfig.company,
  /** Bare `%s | Bizonix` suffix cost, accounted for when writing titles. */
  titleTemplate: `%s | ${siteConfig.name}`,
  defaultTitle: `${siteConfig.name} ERP — Wholesale, Retail & Franchise Software`,
  locale: "en_IN",
  logoPath: "/images/shared/brand/logo.svg",
} as const;
