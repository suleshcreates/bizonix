import type { Metadata } from "next";
import { HomeScrollMotion } from "@/components/pages/home/home-scroll-motion";
import { AudienceSection } from "@/components/pages/home/sections/audience-section";
import { CaseStudyTeaser } from "@/components/pages/home/sections/case-study-teaser";
import { ChallengesSection } from "@/components/pages/home/sections/challenges-section";
import { ComplianceBand } from "@/components/pages/home/sections/compliance-band";
import { FAQSection } from "@/components/pages/home/sections/faq-section";
import { FinalCTA } from "@/components/pages/home/sections/final-cta";
import { HomeHero } from "@/components/pages/home/sections/home-hero";
import { IndustryBand } from "@/components/pages/home/sections/industry-band";
import { PlatformSpine } from "@/components/pages/home/sections/platform-spine";
import { ModuleShowcase } from "@/components/pages/home/sections/module-showcase/module-showcase";
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
      <HomeScrollMotion />
      <HomeHero />
      <AudienceSection />
      <ChallengesSection />
      <PlatformSpine />
      <ModuleShowcase />
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
