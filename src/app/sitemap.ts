import type { MetadataRoute } from "next";
import { IS_INDEXABLE_BUILD, absoluteUrl } from "@/lib/seo/config";
import { indexableRoutes } from "@/lib/seo/routes";

/**
 * The sitemap, generated from the route registry.
 *
 * Because `indexableRoutes` is the same list the pages take their canonicals
 * from, every URL here is by construction a real, public, self-canonical route
 * — there is no second list to fall out of step with the first.
 *
 * No `lastModified`. The previous version stamped `new Date()` on every entry
 * at build time, which told crawlers the entire site had changed on every
 * deploy; that is a fabricated signal, and Google discounts a sitemap whose
 * dates it learns not to trust. Omitting the field is the honest answer until
 * page content carries a real modification date.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  /* A non-production host publishes nothing. See lib/seo/config.ts. */
  if (!IS_INDEXABLE_BUILD) return [];

  return indexableRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
