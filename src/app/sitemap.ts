import type { MetadataRoute } from "next";
import { moduleSlugs } from "@/lib/content/modules/module-pages";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const core = ["", "/product", "/modules", "/contact", "/privacy", "/terms"];
  const modules = moduleSlugs.map((slug) => `/modules/${slug}`);

  return [...core, ...modules].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/product" || path === "/modules"
          ? 0.9
          : path.startsWith("/modules/")
            ? 0.8
            : 0.6,
  }));
}
