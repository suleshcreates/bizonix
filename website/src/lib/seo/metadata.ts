import type { Metadata } from "next";
import { IS_INDEXABLE_BUILD, absoluteUrl, seoIdentity } from "./config";
import { getRoute, type SeoRoute } from "./routes";

/**
 * The one function that builds a page's metadata.
 *
 * Every indexable page calls `pageMetadata("/some/path")` and gets a complete,
 * internally consistent head: a unique title and description, a self-
 * referencing canonical, an explicit robots policy, and Open Graph and Twitter
 * cards whose URL matches that same canonical.
 *
 * Doing it centrally is not tidiness. Next.js *replaces* nested metadata
 * objects rather than merging them, so any page that declared its own
 * `openGraph` block silently dropped the root layout's `images` — which is how
 * the homepage, the platform page and all nine module pages ended up with no
 * `og:image` at all. Building the whole object in one place makes that class
 * of bug unrepresentable.
 */

/**
 * Social images are not named here.
 *
 * Every segment carries its own `opengraph-image.tsx`, and Next emits
 * `og:image`, `twitter:image` and their type/width/height tags from it. That
 * has to be the only source: an explicit `images` array in this object would
 * *replace* the generated card rather than back it up, so a "fallback" here
 * silently suppresses all twelve per-page images.
 *
 * The format matters as much as the plumbing. The previous implementation
 * pointed at an SVG, which Facebook, LinkedIn and X all refuse to render —
 * every share of every page on this site produced a blank card.
 */

/** `index, follow` on a production host; hard `noindex` anywhere else. */
function robotsFor(route: SeoRoute): Metadata["robots"] {
  if (!IS_INDEXABLE_BUILD || route.kind === "noindex") {
    return { index: false, follow: false, nocache: true };
  }
  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

/**
 * Complete metadata for a registered route.
 *
 * `titleOverride: "absolute"` suppresses the `| Bizonix` suffix, which the
 * homepage uses because its title already names the brand.
 */
export function pageMetadata(
  path: string,
  options: { absoluteTitle?: boolean } = {},
): Metadata {
  const route = getRoute(path);
  const canonical = absoluteUrl(route.path);

  return {
    title: options.absoluteTitle ? { absolute: route.title } : route.title,
    description: route.description,
    /* Self-referencing, and the same string the sitemap emits. It also folds
       the `?utm_source=` and `?filter=` variants the site links to internally
       back onto one indexable URL. */
    alternates: { canonical },
    robots: robotsFor(route),
    openGraph: {
      type: "website",
      siteName: seoIdentity.siteName,
      locale: seoIdentity.locale,
      url: canonical,
      title: route.ogTitle,
      description: route.ogDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: route.ogTitle,
      description: route.ogDescription,
    },
  };
}
