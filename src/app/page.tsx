import type { Metadata } from "next";
import { AudienceSection } from "@/components/sections/audience-section";
import { CaseStudyTeaser } from "@/components/sections/case-study-teaser";
import { ChallengesSection } from "@/components/sections/challenges-section";
import { ComplianceBand } from "@/components/sections/compliance-band";
import { FAQSection } from "@/components/sections/faq-section";
import { FinalCTA } from "@/components/sections/final-cta";
import { HomeHero } from "@/components/sections/home-hero";
import { IndustryBand } from "@/components/sections/industry-band";
import { PlatformSpine } from "@/components/sections/platform-spine";
import { SolutionsGrid } from "@/components/sections/solutions-grid";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "ERP for wholesale, retail & franchise brands",
  description:
    "Connect warehouse, stores, franchise operations and books with Bizonix ERP—built for Indian multi-entity retail brands.",
  openGraph: {
    title: "Wholesale, retail & franchise. One operating truth.",
    description:
      "Bizonix connects every operating entity without fragmenting the business.",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Bizonix ERP",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: siteConfig.description,
};

export default function Home() {
  return (
    <>
      <HomeHero />
      <AudienceSection />
      <ChallengesSection />
      <PlatformSpine />
      <SolutionsGrid />
      <IndustryBand />
      <CaseStudyTeaser />
      <ComplianceBand />
      <FAQSection />
      <FinalCTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
    </>
  );
}
