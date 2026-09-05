import { Network, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import type { SupportRailItemData } from "@/lib/content/product/system-map-data";
import styles from "@/components/pages/product/product.module.css";

interface SupportRailItemProps {
  item: SupportRailItemData;
}

export function SupportRailItem({ item }: SupportRailItemProps) {
  const getIcon = (iconName: SupportRailItemData["iconName"]) => {
    switch (iconName) {
      case "network":
        return <Network size={16} />;
      case "zap":
        return <Zap size={16} />;
      case "trending":
        return <TrendingUp size={16} />;
      case "shield":
        return <ShieldCheck size={16} />;
    }
  };

  return (
    <div className={styles.finalSystemMap__supportRailItem}>
      <div className={styles.finalSystemMap__railItemHeader}>
        <div className={styles.finalSystemMap__railIconWrap} aria-hidden="true">
          {getIcon(item.iconName)}
        </div>
        <span className={styles.finalSystemMap__railTitle}>{item.title}</span>
      </div>

      <p className={styles.finalSystemMap__railDescription}>{item.description}</p>
    </div>
  );
}
