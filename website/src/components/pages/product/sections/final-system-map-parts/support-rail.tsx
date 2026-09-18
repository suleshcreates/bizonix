import { supportRailItems } from "@/lib/content/product/system-map-data";
import { SupportRailItem } from "./support-rail-item";
import styles from "@/components/pages/product/product.module.css";

export function SupportRail() {
  return (
    <div
      className={styles.finalSystemMap__supportRailContainer}
      aria-label="Bizonix operating platform advantages"
    >
      <div className={styles.finalSystemMap__supportRailGrid}>
        {supportRailItems.map((item) => (
          <SupportRailItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
