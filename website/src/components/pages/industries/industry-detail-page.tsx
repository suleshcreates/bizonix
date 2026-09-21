import { industryHeroContent } from "@/lib/content/industries/industry-hero-content";
import type { DynamicIndustryDetail } from "@/lib/content/industries/industry-resolver";
import type { IndustryDetail } from "@/lib/content/industries/industry-detail";
import { IndustryHero } from "./industry-hero";
import { BeforeAfter } from "./industry-detail-parts/before-after";
import { ModuleFit } from "./industry-detail-parts/module-fit";
import { OperatingDay } from "./industry-detail-parts/operating-day";
import { PressureList } from "./industry-detail-parts/pressure-list";
import { VariantMatrix } from "./industry-detail-parts/variant-matrix";
import { IndustryDetailMotion } from "./industry-detail-motion";

/** Shared content template and motion boundary for every industry route. */
export function IndustryDetailPage({
  data,
}: {
  data: IndustryDetail | DynamicIndustryDetail;
}) {
  const dynamicData = data as Partial<DynamicIndustryDetail>;
  const hero = dynamicData.heroContent || industryHeroContent[data.slug];

  /* A div, not a <main>: the root layout already owns this page's single
     <main id="main"> landmark, and nesting a second one is invalid. */
  return (
    <IndustryDetailMotion>
      {hero ? <IndustryHero content={hero} /> : null}
      {data.matrix ? <VariantMatrix matrix={data.matrix} /> : null}
      <PressureList
        pains={data.pains}
        intro={dynamicData.painsIntro}
        industryName={data.name}
      />
      <ModuleFit fit={data.fit} />
      <OperatingDay steps={data.workflow} />
      <BeforeAfter proof={data.proof} />
    </IndustryDetailMotion>
  );
}
