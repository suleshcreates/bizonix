import { absoluteUrl, seoIdentity } from "./config";
import { getRoute } from "./routes";

/**
 * Structured data builders.
 *
 * Two rules govern everything in this file.
 *
 * First, only facts the site actually shows. Bizonix has no published pricing,
 * no review corpus, no rating, no verified postal address and no confirmed
 * social profiles, so none of those properties appear here — not even as empty
 * shells. Google's guidance is explicit that structured data must represent
 * visible page content, and inventing an `aggregateRating` is the fastest way
 * to earn a manual action.
 *
 * Second, every URL is absolute. A relative `url` in JSON-LD is not resolved
 * against `metadataBase` the way a metadata field is — it is simply an invalid
 * value, which is what the previous `/features#barcode` ItemList was emitting.
 */

type JsonLd = Record<string, unknown>;

/** Stable `@id`s so the graph can reference one Organization, not many. */
const ORGANIZATION_ID = `${absoluteUrl("/")}/#organization`;
const WEBSITE_ID = `${absoluteUrl("/")}/#website`;

/**
 * Fibonce Tech Solutions, the publisher. Emitted once, in the root layout.
 *
 * `name`, `legalName`, `url` and `logo` are the only properties the site can
 * support today. When a verified phone number, registered address or official
 * social profile exists, this is the one place it belongs.
 */
export function organizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: seoIdentity.legalName,
    legalName: seoIdentity.legalName,
    url: absoluteUrl("/"),
    logo: absoluteUrl(seoIdentity.logoPath),
    brand: {
      "@type": "Brand",
      name: seoIdentity.siteName,
      url: absoluteUrl("/"),
    },
  };
}

/**
 * The site itself. No `SearchAction` — Bizonix has no site-search endpoint, and
 * declaring one that does not exist is a fabricated capability.
 */
export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: seoIdentity.siteName,
    url: absoluteUrl("/"),
    inLanguage: "en-IN",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/**
 * The product, as one application. Category and operating system are the only
 * `SoftwareApplication` facts the site establishes; `offers` is deliberately
 * absent because no price is published anywhere on it.
 */
export function softwareApplicationSchema(options: {
  name: string;
  description: string;
  path: string;
  /** Present on module pages, which are parts of the wider application. */
  partOf?: boolean;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: options.name,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Enterprise Resource Planning",
    operatingSystem: "Web",
    url: absoluteUrl(options.path),
    description: options.description,
    publisher: { "@id": ORGANIZATION_ID },
    ...(options.partOf
      ? {
          isPartOf: {
            "@type": "SoftwareApplication",
            name: `${seoIdentity.siteName} ERP`,
            url: absoluteUrl("/"),
          },
        }
      : {}),
  };
}

/**
 * Breadcrumb trail for a registered route.
 *
 * Built from the same `breadcrumb` array the visible `<nav>` renders, so the
 * markup and the structured data describe one hierarchy by construction.
 * Returns `null` for a route with no ancestors — a one-item BreadcrumbList
 * describes nothing.
 */
export function breadcrumbSchema(path: string): JsonLd | null {
  const route = getRoute(path);
  if (!route.breadcrumb?.length) return null;

  const trail = [
    ...route.breadcrumb.map((crumb) => ({
      name: crumb.label,
      path: crumb.path,
    })),
    { name: route.breadcrumbLeaf, path: route.path },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(entry.path),
    })),
  };
}

/** FAQ markup, only ever built from questions the page actually renders. */
export function faqSchema(
  items: readonly { question: string; answer: string }[],
): JsonLd | null {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** An index page's list of children. Every `url` absolute. */
export function itemListSchema(options: {
  name: string;
  items: readonly { name: string; path: string; description?: string }[];
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: options.name,
    itemListElement: options.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}
