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
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getRoute } from "@/lib/seo/routes";
import { softwareApplicationSchema } from "@/lib/seo/schema";

/* The homepage title already carries the brand, so it opts out of the
   "%s | Bizonix" template rather than naming Bizonix twice. */
export const metadata: Metadata = pageMetadata("/", { absoluteTitle: true });

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
      <JsonLd
        schema={softwareApplicationSchema({
          name: "Bizonix ERP",
          description: getRoute("/").description,
          path: "/",
        })}
      />
    </>
  );
}
