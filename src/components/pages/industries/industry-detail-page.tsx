import type { IndustryDetail } from "@/lib/content/industries/industry-detail";
import { BeforeAfter } from "./industry-detail-parts/before-after";
import { DetailCta } from "./industry-detail-parts/detail-cta";
import { DetailHero } from "./industry-detail-parts/detail-hero";
import { ModuleFit } from "./industry-detail-parts/module-fit";
import { OperatingDay } from "./industry-detail-parts/operating-day";
import { PressureList } from "./industry-detail-parts/pressure-list";
import { VariantMatrix } from "./industry-detail-parts/variant-matrix";
import styles from "@/components/pages/industries/industries.module.css";

/*
 * Only the three genuinely interactive sections ship as client components;
 * the rest render on the server.
 */
export function IndustryDetailPage({ data }: { data: IndustryDetail }) {
  return (
    <main className={styles.industryDetailPage__page}>
      <DetailHero data={data} />
      {data.matrix ? <VariantMatrix matrix={data.matrix} /> : null}
      <PressureList pains={data.pains} />
      <ModuleFit fit={data.fit} />
      <OperatingDay steps={data.workflow} />
      <BeforeAfter proof={data.proof} />
      <DetailCta cta={data.cta} />
    </main>
  );
}
