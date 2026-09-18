import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ModuleRow } from "@/lib/content/pricing/pricing";
import styles from "@/components/pages/pricing/pricing.module.css";

/**
 * The panel a module row opens into.
 *
 * Everything in it already exists: the summary and the capability list are the
 * module's own approved copy from the canonical module index, and the link
 * points at that module's existing route. Nothing here is written for the
 * pricing page, which is the point — the grid answers "is it in this plan",
 * and this answers "what is it", without either surface inventing a claim the
 * other does not make.
 *
 * The whole panel stays mounted and is collapsed by the row's `data-open`
 * state; see `.pricing__cmpDetailGrid` for why that is a grid row rather than
 * a height animation.
 */
export function PricingModuleDetail({
  module,
  panelId,
  labelId,
}: {
  module: ModuleRow;
  panelId: string;
  labelId: string;
}) {
  return (
    <div
      className={styles.pricing__cmpDetail}
      id={panelId}
      role="region"
      aria-labelledby={labelId}
    >
      <p className={styles.pricing__cmpDetailBody}>{module.summary}</p>

      <ul className={styles.pricing__cmpDetailList}>
        {module.capabilities.map((capability) => (
          <li key={capability}>{capability}</li>
        ))}
      </ul>

      <Link href={module.route} className={styles.pricing__cmpDetailLink}>
        Explore {module.name}
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </div>
  );
}
