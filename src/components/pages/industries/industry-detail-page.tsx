import { industryHeroContent } from "@/lib/content/industries/industry-hero-content";
import type { IndustryDetail } from "@/lib/content/industries/industry-detail";
import { IndustryHero } from "./industry-hero";
import { BeforeAfter } from "./industry-detail-parts/before-after";
import { ModuleFit } from "./industry-detail-parts/module-fit";
import { OperatingDay } from "./industry-detail-parts/operating-day";
import { PressureList } from "./industry-detail-parts/pressure-list";
import { VariantMatrix } from "./industry-detail-parts/variant-matrix";
import { IndustryDetailMotion } from "./industry-detail-motion";

/** Shared content template and motion boundary for every industry route. */
export function IndustryDetailPage({ data }: { data: IndustryDetail }) {
  /* A div, not a <main>: the root layout already owns this page's single
     <main id="main"> landmark, and nesting a second one is invalid. */
  return (
    <IndustryDetailMotion>
      <IndustryHero content={industryHeroContent[data.slug]} />
      {data.matrix ? <VariantMatrix matrix={data.matrix} /> : null}
      <PressureList pains={data.pains} />
      <ModuleFit fit={data.fit} />
      <OperatingDay steps={data.workflow} />
      <BeforeAfter proof={data.proof} />
    </IndustryDetailMotion>
  );
}
