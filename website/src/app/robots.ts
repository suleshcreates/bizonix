import type { MetadataRoute } from "next";
import { IS_INDEXABLE_BUILD, absoluteUrl } from "@/lib/seo/config";

/**
 * robots.txt, served from the host root at `/robots.txt`.
 *
 * Crawling is allowed everywhere except `/api/`, which holds the demo-request
 * handler and has nothing for a crawler to read. Nothing else is disallowed:
 * robots.txt governs *crawl access*, not indexing, and a URL blocked here can
 * still surface in results without a snippet. The pages that must stay out of
 * the index — the draft legal pages — carry a `noindex` meta tag instead,
 * which only works because the crawler is allowed to fetch them and read it.
 *
 * On a non-production host the whole site is closed and no sitemap is
 * advertised, so a preview deployment cannot be crawled or indexed.
 */
export default function robots(): MetadataRoute.Robots {
  if (!IS_INDEXABLE_BUILD) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
