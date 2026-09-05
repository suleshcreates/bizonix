import type { Metadata } from "next";
import { AboutHero } from "@/components/pages/about/sections/about-hero";
import { MissionSection } from "@/components/pages/about/sections/mission-section";
import { OriginSection } from "@/components/pages/about/sections/origin-section";
import { PrinciplesSection } from "@/components/pages/about/sections/principles-section";
import { ValuesSection } from "@/components/pages/about/sections/values-section";

export const metadata: Metadata = {
  title: "About Fibonce",
  description:
    "Fibonce Tech Solutions builds Bizonix — an ERP for Indian brands running wholesale, retail and franchise together. Our mission, values and product principles.",
};

/**
 * /about is a scroll narrative rather than a stack of blocks: hero, mission,
 * origin, three values and three product principles each own a full viewport
 * with a visual built specifically for what that section is arguing.
 */
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionSection />
      <OriginSection />
      <ValuesSection />
      <PrinciplesSection />
    </>
  );
}
