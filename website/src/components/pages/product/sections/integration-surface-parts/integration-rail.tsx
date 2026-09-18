import { ApiLane } from "./api-lane";
import { EcommerceLane } from "./ecommerce-lane";
import { WhatsAppLane } from "./whatsapp-lane";
import styles from "@/components/pages/product/product.module.css";

export function IntegrationRail() {
  return (
    <div
      className={styles.integrationSurface__surfaceContainer}
      aria-label="Bizonix continuous integration surface"
    >
      <div className={styles.integrationSurface__lanesGrid}>
        <EcommerceLane />
        <WhatsAppLane />
        <ApiLane />
      </div>
    </div>
  );
}
