import type { Metadata } from "next";
import { HowBizonixFitsSection } from "@/components/pages/industries/sections/how-bizonix-fits";
import { IndustriesHero } from "@/components/pages/industries/sections/industries-hero";
import { IndustryPainSection } from "@/components/pages/industries/sections/industry-pain-section";
import { IndustryWorkflowSection } from "@/components/pages/industries/sections/industry-workflow-section";
import { ProofSection } from "@/components/pages/industries/sections/proof-section";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Explore how Bizonix supports apparel, imitation jewellery, and franchise networks.",
};

export default function IndustriesPage() {
  return (
    <>
      <IndustriesHero />
      <IndustryPainSection />
      <HowBizonixFitsSection />
      <IndustryWorkflowSection />
      <ProofSection />
    </>
  );
}
