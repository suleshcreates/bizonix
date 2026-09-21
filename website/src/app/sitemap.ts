import type { MetadataRoute } from "next";
import { IS_INDEXABLE_BUILD, absoluteUrl } from "@/lib/seo/config";
import { indexableRoutes } from "@/lib/seo/routes";
import { getAllPublicModules } from "@/lib/content/modules/module-resolver";
import { getAllPublicIndustries } from "@/lib/content/industries/industry-resolver";

/**
 * The sitemap, generated from the route registry and dynamic published modules & industries.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* A non-production host publishes nothing. See lib/seo/config.ts. */
  if (!IS_INDEXABLE_BUILD) return [];

  const entries: MetadataRoute.Sitemap = indexableRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const existingPaths = new Set(indexableRoutes.map((r) => r.path));

  try {
    const publicModules = await getAllPublicModules();
    for (const m of publicModules) {
      const modulePath = `/modules/${m.slug}`;
      if (!existingPaths.has(modulePath)) {
        entries.push({
          url: absoluteUrl(modulePath),
          changeFrequency: "weekly",
          priority: 0.8,
        });
        existingPaths.add(modulePath);
      }
    }
  } catch {
    // Graceful fallback to static routes
  }

  try {
    const publicIndustries = await getAllPublicIndustries();
    for (const ind of publicIndustries) {
      const industryPath = `/industries/${ind.slug}`;
      if (!existingPaths.has(industryPath)) {
        entries.push({
          url: absoluteUrl(industryPath),
          changeFrequency: "weekly",
          priority: 0.7,
        });
        existingPaths.add(industryPath);
      }
    }
  } catch {
    // Graceful fallback to static routes
  }

  return entries;
}
