import { Boxes } from "lucide-react";
import { heroInventory } from "@/lib/content/product/product-hero-demo-data";
import styles from "@/components/pages/product/product.module.css";

export function ProductDashboardInventory() {
  return (
    <section className={styles.productHeroDashboard__inventoryStrip}>
      <div className={styles.productHeroDashboard__inventoryTitle}>
        <span className={styles.productHeroDashboard__cardIcon} aria-hidden="true">
          <Boxes size={12} strokeWidth={2.3} />
        </span>
        <span>Inventory intelligence</span>
      </div>

      {heroInventory.map((item) => (
        <div key={item.label} className={styles.productHeroDashboard__inventoryItem} data-tone={item.tone}>
          <div className={styles.productHeroDashboard__inventoryTop}>
            <small>{item.label}</small>
            <strong>{item.value}</strong>
          </div>
          <div className={styles.productHeroDashboard__inventoryTrack}>
            <i className={styles.productHeroDashboard__inventoryFill} style={{ width: `${item.pct}%` }} />
          </div>
        </div>
      ))}
    </section>
  );
}
