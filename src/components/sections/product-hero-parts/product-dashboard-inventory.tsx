import { Boxes } from "lucide-react";
import { heroInventory } from "@/lib/content/product-hero-demo-data";
import styles from "./product-hero-dashboard.module.css";

export function ProductDashboardInventory() {
  return (
    <section className={styles.inventoryStrip}>
      <div className={styles.inventoryTitle}>
        <span className={styles.cardIcon} aria-hidden="true">
          <Boxes size={12} strokeWidth={2.3} />
        </span>
        <span>Inventory intelligence</span>
      </div>

      {heroInventory.map((item) => (
        <div key={item.label} className={styles.inventoryItem} data-tone={item.tone}>
          <div className={styles.inventoryTop}>
            <small>{item.label}</small>
            <strong>{item.value}</strong>
          </div>
          <div className={styles.inventoryTrack}>
            <i className={styles.inventoryFill} style={{ width: `${item.pct}%` }} />
          </div>
        </div>
      ))}
    </section>
  );
}
