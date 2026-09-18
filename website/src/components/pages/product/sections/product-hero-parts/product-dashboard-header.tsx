import { Building2, ChevronDown } from "lucide-react";
import { heroNav, heroWorkspace } from "@/lib/content/product/product-hero-demo-data";
import styles from "@/components/pages/product/product.module.css";

export function ProductDashboardHeader() {
  return (
    <div className={styles.productHeroDashboard__chrome}>
      <div className={styles.productHeroDashboard__brand}>
        <span className={styles.productHeroDashboard__brandMark} aria-hidden="true">
          B
        </span>
        <span className={styles.productHeroDashboard__brandText}>
          <strong>Bizonix</strong>
          <span>{heroWorkspace.title}</span>
        </span>
      </div>

      <div className={styles.productHeroDashboard__chromeNav}>
        {heroNav.map((item, index) => (
          <span
            key={item}
            className={index === 0 ? styles.productHeroDashboard__chromeNavActive : undefined}
          >
            {item}
          </span>
        ))}
      </div>

      <div className={styles.productHeroDashboard__chromeRight}>
        <span className={styles.productHeroDashboard__entityChip}>
          <Building2 size={12} strokeWidth={2.1} />
          {heroWorkspace.scope}
          <ChevronDown size={11} strokeWidth={2.4} />
        </span>

        <span className={styles.productHeroDashboard__segmented}>
          {heroWorkspace.periods.map((period) => (
            <span
              key={period}
              className={
                period === heroWorkspace.activePeriod
                  ? styles.productHeroDashboard__segmentedActive
                  : undefined
              }
            >
              {period}
            </span>
          ))}
        </span>

        <span className={styles.productHeroDashboard__livePill}>
          <i className={styles.productHeroDashboard__liveDot} />
          {heroWorkspace.status}
        </span>
      </div>
    </div>
  );
}
