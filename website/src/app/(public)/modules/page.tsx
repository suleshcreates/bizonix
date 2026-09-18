import type { Metadata } from "next";
import { ModulesIndex } from "@/components/pages/modules/modules-index";
import { moduleIndexItems } from "@/lib/content/modules/modules-index";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getRoute } from "@/lib/seo/routes";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";

/* The deck's filter lives in `?filter=`, but the server always renders all
   nine modules, so every `?filter=` URL serves identical HTML. The canonical
   folds those five variants back onto a single indexable /modules. */
export const metadata: Metadata = pageMetadata("/modules");

export default function ModulesPage() {
  return (
    <>
      <ModulesIndex />
      <JsonLd
        schema={[
          itemListSchema({
            name: "Bizonix ERP modules",
            items: moduleIndexItems.map((module) => ({
              name: module.title,
              path: `/modules/${module.slug}`,
              description: getRoute(`/modules/${module.slug}`).description,
            })),
          }),
          breadcrumbSchema("/modules"),
        ]}
      />
    </>
  );
}
