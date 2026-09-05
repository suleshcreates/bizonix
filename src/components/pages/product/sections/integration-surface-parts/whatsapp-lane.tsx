import { ArrowRight, Check, MessageCircle, User } from "lucide-react";
import styles from "@/components/pages/product/product.module.css";

const capabilities = [
  "Invoice share",
  "Payment reminders",
  "Order updates",
  "Customer chat",
  "Document share",
  "Status alerts",
];

export function WhatsAppLane() {
  return (
    <article className={styles.integrationSurface__lane} aria-labelledby="whatsapp-lane-title">
      <div className={styles.integrationSurface__laneTop}>
        <div className={styles.integrationSurface__laneStatus} style={{ color: "var(--bz-teal)" }}>
          <span
            className={`${styles.integrationSurface__statusDot} ${styles.integrationSurface__statusDotLiveWhatsApp}`}
            aria-hidden="true"
          />
          <span>Live today</span>
        </div>

        <h3 id="whatsapp-lane-title" className={styles.integrationSurface__laneTitle}>
          WhatsApp sharing
        </h3>

        <p className={styles.integrationSurface__laneDescription}>
          Share invoices and updates in the channel your customers already use.
        </p>

        {/* Capabilities — rendered as small inline text groups with subtle checks */}
        <div className={styles.integrationSurface__capabilitiesGrid}>
          {capabilities.map((item) => (
            <div key={item} className={styles.integrationSurface__capabilityItem}>
              <Check
                className={`${styles.integrationSurface__checkIcon} ${styles.integrationSurface__checkTeal}`}
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
          aria-label="Flow: Bizonix to WhatsApp to Your Customer"
        >
          <div className={styles.integrationSurface__miniFlowNode}>
            <span className="font-extrabold text-bz-navy">Bizonix</span>
          </div>

          <div className={styles.integrationSurface__miniFlowConnector} aria-hidden="true">
            <div
              className={`${styles.integrationSurface__miniFlowLine} ${styles.integrationSurface__miniFlowLineTeal}`}
            />
            <ArrowRight size={12} className="text-bz-teal ml-1 flex-shrink-0" />
          </div>

          <div className={styles.integrationSurface__miniFlowNode}>
            <MessageCircle size={14} className="text-bz-teal" aria-hidden="true" />
            <span>WhatsApp</span>
          </div>

          <div className={styles.integrationSurface__miniFlowConnector} aria-hidden="true">
            <div
              className={`${styles.integrationSurface__miniFlowLine} ${styles.integrationSurface__miniFlowLineTeal}`}
            />
            <ArrowRight size={12} className="text-bz-teal ml-1 flex-shrink-0" />
          </div>

          <div className={styles.integrationSurface__miniFlowNode}>
            <User size={14} className="text-bz-navy" aria-hidden="true" />
            <span>Customer</span>
          </div>
        </div>

        <div className={styles.integrationSurface__laneStatusCopy}>
          <span className={styles.integrationSurface__statusLinePrimary}>
            No extra app for your customers.
          </span>
          <span className={styles.integrationSurface__statusLineSecondary}>
            Use the channels they already use every day.
          </span>
        </div>
      </div>
    </article>
  );
}
