"use client";

import { useCallback, useState } from "react";
import { comparisonModules, pricingTiers } from "@/lib/content/pricing/pricing";
import { PricingComparisonHeader } from "./pricing-comparison-parts/comparison-header";
import { PricingComparisonLegend } from "./pricing-comparison-parts/comparison-legend";
import { PricingComparisonRow } from "./pricing-comparison-parts/comparison-row";
import { PricingPlanHeader } from "./pricing-comparison-parts/plan-header";
import styles from "@/components/pages/pricing/pricing.module.css";

/**
 * The module-by-tier grid.
 *
 * A real `<table>`: column headers are `<th scope="col">`, each module is a
 * `<th scope="row">`, and a visually hidden `<caption>` names the whole thing.
 * A screen reader announces "Wholesale, Growth, included" rather than reading a
 * wall of loose checkmarks, which is the entire reason not to build this out
 * of divs.
 *
 * Two pieces of state, and no more. `open` is the slug of the one expanded
 * module — a single value rather than a set, because only one detail may be
 * open and that rule is better enforced by the shape of the state than by a
 * handler remembering to close the last one. `hoveredPlan` is written once, on
 * the table, and every cell in that column lights from a single attribute
 * selector; the alternative — a handler and a class on twenty-seven cells —
 * re-renders the whole grid to change one column's tint.
 *
 * Motion: GSAP still reveals each row on scroll (`data-reveal="row"`). The row
 * and column highlights are CSS transitions, and the detail expansion is a
 * grid-row transition, so nothing here needs an animation library and nothing
 * fights GSAP for a property.
 */
export function PricingComparison() {
  const [open, setOpen] = useState<string | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<string>("");

  const toggle = useCallback((slug: string) => {
    setOpen((current) => (current === slug ? null : slug));
  }, []);

  /* One delegated handler for the whole grid. Every header and body cell in a
     plan column carries the same `data-plan`, so the column under the pointer
     is whatever the nearest one says. */
  const onPointerMove = useCallback((event: React.MouseEvent) => {
    const cell = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-plan]",
    );
    setHoveredPlan(cell?.dataset.plan ?? "");
  }, []);

  /* Escape closes the open detail and puts focus back on the row that opened
     it. Without the second half, focus is left on a control that has just
     collapsed and a keyboard reader loses their place in a nine-row grid. */
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key !== "Escape" || !open) return;
      event.stopPropagation();
      const trigger = document.getElementById(`pricing-module-${open}`);
      setOpen(null);
      trigger?.focus();
    },
    [open],
  );

  return (
    <section
      className={styles.pricing__compare}
      aria-labelledby="pricing-compare"
    >
      <div className={styles.pricing__shell}>
        <PricingComparisonHeader />

        <div
          className={styles.pricing__cmpSurface}
          onKeyDown={onKeyDown}
          onMouseOver={onPointerMove}
          onMouseLeave={() => setHoveredPlan("")}
        >
          <table className={styles.pricing__cmpTable} data-hover={hoveredPlan}>
            <caption>
              Bizonix modules included in the Starter, Growth and Enterprise
              plans. Select a module to read what it does.
            </caption>

            <thead>
              <tr>
                <th scope="col" className={styles.pricing__cmpModuleHead}>
                  Module
                </th>
                {pricingTiers.map((tier) => (
                  <PricingPlanHeader key={tier.id} tier={tier} />
                ))}
              </tr>
            </thead>

            {comparisonModules.map((module) => (
              <PricingComparisonRow
                key={module.slug}
                module={module}
                tiers={pricingTiers}
                open={open === module.slug}
                onToggle={toggle}
                ids={{
                  trigger: `pricing-module-${module.slug}`,
                  panel: `pricing-module-panel-${module.slug}`,
                  label: `pricing-module-label-${module.slug}`,
                }}
              />
            ))}
          </table>
        </div>

        <PricingComparisonLegend />
      </div>
    </section>
  );
}
