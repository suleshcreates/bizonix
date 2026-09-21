import type { Metadata } from "next";
import { ModulesIndex } from "@/components/pages/modules/modules-index";
import {
  moduleIndexItems,
  type ModuleFilter,
  type SerializableModuleIndexItem,
} from "@/lib/content/modules/modules-index";
import {
  getAllPublicModules,
  resolveModuleTheme,
} from "@/lib/content/modules/module-resolver";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";

export const metadata: Metadata = pageMetadata("/modules");

function mapCategoryToFilters(
  category?: string,
): Exclude<ModuleFilter, "all">[] {
  switch (category) {
    case "Supply & Purchasing":
      return ["inventory", "finance"];
    case "Commerce":
      return ["sales", "commerce"];
    case "Finance":
      return ["finance"];
    case "Intelligence & Security":
      return ["network"];
    default:
      return ["inventory", "sales"];
  }
}

export default async function ModulesPage() {
  const publicModules = await getAllPublicModules();
  const catalogModules = publicModules.filter((m) => m.showInCatalog);

  const items: SerializableModuleIndexItem[] = catalogModules.map((m) => {
    const staticMatch = moduleIndexItems.find((s) => s.slug === m.slug);
    const theme = resolveModuleTheme(m.themeKey);

    return {
      slug: m.slug,
      title: m.title,
      summary: m.summary,
      outcome: m.outcome,
      capabilities: staticMatch?.capabilities || [
        "Real-time processing",
        "Multi-entity isolation",
        "Continuous audit ledger",
        "Unified operational trail",
      ],
      filters: staticMatch?.filters || mapCategoryToFilters(m.category),
      accent: theme.accent,
      accentDark: theme.accentDark,
      iconKey: m.iconKey,
    };
  });

  return (
    <>
      <ModulesIndex items={items} />
      <JsonLd
        schema={[
          itemListSchema({
            name: "Bizonix ERP modules",
            items: items.map((module) => ({
              name: module.title,
              path: `/modules/${module.slug}`,
              description: module.summary,
            })),
          }),
          breadcrumbSchema("/modules"),
        ]}
      />
    </>
  );
}
