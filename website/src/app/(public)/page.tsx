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

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ preview_variant?: string; hero?: string; variant?: string }>;
}) {
  let heroConfig: any = undefined;
  const resolvedParams = searchParams ? await searchParams : {};
  const variantQuery =
    resolvedParams?.preview_variant ||
    resolvedParams?.hero ||
    resolvedParams?.variant;

  try {
    const apiBase = (
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"
    ).replace(/\/$/, "");

    let url = `${apiBase}/public/hero/current`;
    if (variantQuery) {
      url = `${apiBase}/public/hero/${encodeURIComponent(variantQuery)}/preview`;
    }

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      heroConfig = {
        key: data.key,
        name: data.name,
        ...(typeof data.config === "object" && data.config !== null ? data.config : {}),
        ...data,
        isPreview: Boolean(variantQuery),
      };
    }
  } catch (e) {
    // console.error(e) - gracefully fallback to default
  }

  return (
    <>
      {variantQuery && (
        <aside className="bg-slate-900 border-b border-amber-500/40 text-amber-200 text-xs px-4 py-2.5 flex items-center justify-between z-50 sticky top-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-medium text-slate-100">
              Hero Preview Mode:{" "}
              <strong className="text-amber-300 font-semibold">{heroConfig?.name || variantQuery}</strong>
              <span className="text-slate-400 font-mono text-[11px] ml-1.5">({variantQuery})</span>
            </span>
          </div>
          <a
            href="/"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded border border-slate-700 transition-colors"
          >
            Exit Preview
          </a>
        </aside>
      )}
      <HomeScrollMotion />
      <HomeHero config={heroConfig} />
      <ModuleShowcase />
      <AudienceSection />
      <ChallengesSection />
      <PlatformSpine />
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
