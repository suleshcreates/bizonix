import type { Metadata } from "next";
import { FeaturesIndex } from "@/components/pages/features/features-index";
import { featureSummaries } from "@/lib/content/features/features";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getRoute } from "@/lib/seo/routes";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";

export const metadata: Metadata = pageMetadata("/features");

export default function FeaturesPage() {
  return (
    <>
      <FeaturesIndex />
      <JsonLd
        schema={[
          /* Each entry points at the feature's own page rather than an on-page
             fragment, so the list leads somewhere separately indexable. */
          itemListSchema({
            name: "Bizonix ERP features",
            items: featureSummaries.map((feature) => ({
              name: `${feature.title} — ${feature.discipline}`,
              path: `/features/${feature.id}`,
              description: getRoute(`/features/${feature.id}`).description,
            })),
          }),
          breadcrumbSchema("/features"),
        ]}
      />
    </>
  );
}
