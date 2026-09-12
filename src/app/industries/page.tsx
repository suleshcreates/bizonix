import type { Metadata } from "next";
import { HowBizonixFitsSection } from "@/components/pages/industries/sections/how-bizonix-fits";
import { IndustriesHero } from "@/components/pages/industries/sections/industries-hero";
import { IndustryPainSection } from "@/components/pages/industries/sections/industry-pain-section";
import { IndustryWorkflowSection } from "@/components/pages/industries/sections/industry-workflow-section";
import { ProofSection } from "@/components/pages/industries/sections/proof-section";
import { industryDetails } from "@/lib/content/industries/industry-detail";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getRoute } from "@/lib/seo/routes";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";

export const metadata: Metadata = pageMetadata("/industries");

export default function IndustriesPage() {
  const detail = Object.values(industryDetails).filter(
    (industry) => industry !== undefined,
  );

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
            items: detail.map((industry) => ({
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
