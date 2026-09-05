import { FeatureRail } from "./feature-rail";
import { BarcodeIdentity } from "./sections/barcode-identity";
import { CounterSessions } from "./sections/counter-sessions";
import { FeaturesHero } from "./sections/features-hero";
import { GstCompliance } from "./sections/gst-compliance";
import { SeriesPricing } from "./sections/series-pricing";
import { StockTransfer } from "./sections/stock-transfer";
import styles from "@/components/pages/features/features.module.css";

/**
 * /features — the hero states the argument, then each of the five details
 * takes a full viewport and is shown through its own mechanism: a scan, a
 * shift, a document, a ladder, a crossing. Tone alternates light/dark down the
 * page so no two adjacent viewports read the same way, and the rail keeps the
 * five legible as a set once you are inside one of them.
 */
export function FeaturesIndex() {
  return (
    <>
      <div className={styles.features__featuresIndex__page}>
        <FeaturesHero />
        <BarcodeIdentity />
        <CounterSessions />
        <GstCompliance />
        <SeriesPricing />
        <StockTransfer />
      </div>
      {/* Outside the clipped page shell, so the fixed rail is never trimmed. */}
      <FeatureRail />
    </>
  );
}
