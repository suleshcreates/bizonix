import { ArrowRight, Check, RefreshCw, ShoppingBag } from "lucide-react";
import styles from "@/components/pages/product/product.module.css";

const capabilities = [
  "Catalog sync",
  "Order import",
  "CMS & content",
  "Inventory sync",
  "Stock visibility",
  "Storefront data",
];

export function EcommerceLane() {
  return (
    <article className={styles.integrationSurface__lane} aria-labelledby="ecommerce-lane-title">
      <div className={styles.integrationSurface__laneTop}>
        <div className={styles.integrationSurface__laneStatus} style={{ color: "var(--bz-blue)" }}>
          <span
            className={`${styles.integrationSurface__statusDot} ${styles.integrationSurface__statusDotLiveEcommerce}`}
            aria-hidden="true"
          />
          <span>Live today</span>
        </div>

        <h3 id="ecommerce-lane-title" className={styles.integrationSurface__laneTitle}>
          Ecommerce
        </h3>

        <p className={styles.integrationSurface__laneDescription}>
          Integrate your online store and back office. Keep catalog, orders and
          content in sync.
        </p>

        {/* Capabilities — rendered as small inline text groups with subtle checks */}
        <div className={styles.integrationSurface__capabilitiesGrid}>
          {capabilities.map((item) => (
            <div key={item} className={styles.integrationSurface__capabilityItem}>
              <Check
                className={`${styles.integrationSurface__checkIcon} ${styles.integrationSurface__checkBlue}`}
                aria-hidden="true"
              />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Flow & Status Statement */}
      <div className={styles.integrationSurface__laneBottom}>
        <div
          className={styles.integrationSurface__miniFlow}
          aria-label="Flow: Your Store to Sync to Bizonix"
        >
          <div className={styles.integrationSurface__miniFlowNode}>
            <ShoppingBag size={14} className="text-bz-blue" aria-hidden="true" />
            <span>Your store</span>
          </div>

          <div className={styles.integrationSurface__miniFlowConnector} aria-hidden="true">
            <div
              className={`${styles.integrationSurface__miniFlowLine} ${styles.integrationSurface__miniFlowLineBlue}`}
            />
            <ArrowRight size={12} className="text-bz-blue ml-1 flex-shrink-0" />
          </div>

          <div className={styles.integrationSurface__miniFlowNode}>
            <RefreshCw size={13} className="text-bz-blue" aria-hidden="true" />
            <span>Sync</span>
          </div>

          <div className={styles.integrationSurface__miniFlowConnector} aria-hidden="true">
            <div
              className={`${styles.integrationSurface__miniFlowLine} ${styles.integrationSurface__miniFlowLineBlue}`}
            />
            <ArrowRight size={12} className="text-bz-blue ml-1 flex-shrink-0" />
          </div>

          <div className={styles.integrationSurface__miniFlowNode}>
            <span className="font-extrabold text-bz-navy">Bizonix</span>
          </div>
        </div>

        <div className={styles.integrationSurface__laneStatusCopy}>
          <span className={styles.integrationSurface__statusLinePrimary}>
            Works with leading platforms you already trust.
          </span>
          <span className={styles.integrationSurface__statusLineSecondary}>
            Already live and proven in real businesses.
          </span>
        </div>
      </div>
    </article>
  );
}
