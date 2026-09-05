"use client";

import { useState } from "react";
import {
  BarChart3,
  Boxes,
  Network,
  ShoppingBag,
  Truck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import type { IndustryDetail } from "@/lib/content/industries/industry-detail";
import styles from "@/components/pages/industries/industries.module.css";

const MODULE_ICONS: Record<string, LucideIcon> = {
  Inventory: Boxes,
  "Sales & POS": ShoppingBag,
  Wholesale: Warehouse,
  Franchise: Network,
  Analytics: BarChart3,
  Procurement: Truck,
};

/*
 * One record along the top, the modules that write to it underneath, each
 * joined by a tick. Hovering a module lights its share of the record — the
 * point being that these are views of one object, not five integrations.
 */
export function ModuleFit({ fit }: { fit: IndustryDetail["fit"] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className={styles.industryDetailPage__fit} id="fits" aria-labelledby="fit-title">
      <div className={styles.industryDetailPage__shell}>
        <div className={styles.industryDetailPage__fitHead}>
          <p className={styles.industryDetailPage__eyebrow}>
            <span className={styles.industryDetailPage__eyebrowDot} aria-hidden="true" />
            How Bizonix fits
          </p>
          <h2 id="fit-title">{fit.title}</h2>
          <p className={styles.industryDetailPage__fitLede}>{fit.body}</p>
        </div>

        <div className={styles.industryDetailPage__recordBar} aria-hidden="true">
          <span className={styles.industryDetailPage__recordLabel}>
            <span className={styles.industryDetailPage__recordDot} />
            One operating record
          </span>
          <span className={styles.industryDetailPage__recordTrack}>
            {fit.modules.map((item, index) => (
              <span
                key={item.name}
                className={styles.industryDetailPage__recordSegment}
                data-active={active === index ? "true" : undefined}
              />
            ))}
          </span>
        </div>

        <ul className={styles.industryDetailPage__moduleRail}>
          {fit.modules.map((item, index) => {
            const Icon = MODULE_ICONS[item.name] ?? Boxes;
            return (
              <li
                key={item.name}
                className={styles.industryDetailPage__moduleCard}
                data-active={active === index ? "true" : undefined}
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
              >
                <span className={styles.industryDetailPage__moduleTick} aria-hidden="true" />
                <span className={styles.industryDetailPage__moduleIcon} aria-hidden="true">
                  <Icon size={18} strokeWidth={1.9} />
                </span>
                <h3>{item.name}</h3>
                <p>{item.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
