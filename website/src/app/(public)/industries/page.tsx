import type { Metadata } from "next";
import { HowBizonixFitsSection } from "@/components/pages/industries/sections/how-bizonix-fits";
import { IndustriesHero } from "@/components/pages/industries/sections/industries-hero";
import { IndustryPainSection } from "@/components/pages/industries/sections/industry-pain-section";
import { IndustryWorkflowSection } from "@/components/pages/industries/sections/industry-workflow-section";
import { ProofSection } from "@/components/pages/industries/sections/proof-section";
import { getAllPublicIndustries } from "@/lib/content/industries/industry-resolver";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getRoute } from "@/lib/seo/routes";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";

export const metadata: Metadata = pageMetadata("/industries");

export default async function IndustriesPage() {
  const allIndustries = await getAllPublicIndustries();
  const overviewIndustries = allIndustries.filter((ind) => ind.showInOverview);

  return (
    <>
      <IndustriesHero />
      <IndustryPainSection />
      <HowBizonixFitsSection />
      <IndustryWorkflowSection />
      <ProofSection />
      <JsonLd
        schema={[
          itemListSchema({
            name: "Industries Bizonix ERP serves",
            items: overviewIndustries.map((industry) => ({
              name: industry.name,
              path: `/industries/${industry.slug}`,
              description: getRoute(`/industries/${industry.slug}`).description,
            })),
          }),
          breadcrumbSchema("/industries"),
        ]}
      />
    </>
  );
}
