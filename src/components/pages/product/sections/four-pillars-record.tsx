import { FourPillarsHeader } from "./four-pillars-parts/four-pillars-header";
import { PillarPanorama } from "./four-pillars-parts/pillar-panorama";
import { OperatingModelRail } from "./four-pillars-parts/operating-model-rail";
import { RecordConvergence } from "./four-pillars-parts/record-convergence";
import { TransactionTimeline } from "./four-pillars-parts/transaction-timeline";
import styles from "@/components/pages/product/product.module.css";

/**
 * Four pillars, one record — asymmetric editorial composition.
 *
 * LEFT  ~34%  header copy + operating model rail
 * RIGHT ~66%  panoramic pillar strip + record convergence
 *
 * The two-column grid keeps the left editorial aligned with the right visual
 * story. The record journey then breaks out to the full shell: it is one
 * record travelling the whole operation, and squeezing it into the right-hand
 * column made it read as a widget beside the argument rather than as the
 * conclusion of it. The section ends there — nothing else follows.
 */
export function FourPillarsRecordSection() {
  return (
    <section className={styles.fourPillarsRecord__section} aria-labelledby="pillars-title">
      <div className={styles.fourPillarsRecord__shell}>
        <div className={styles.fourPillarsRecord__sectionGrid}>
          {/* Row 1: header left + panorama right */}
          <FourPillarsHeader />
          <PillarPanorama />

          {/* Spacer row */}
          <div className={styles.fourPillarsRecord__headerGap} aria-hidden="true" />

          {/* Row 2: operating model left + record visuals right */}
          <OperatingModelRail />
          <div className={styles.fourPillarsRecord__bodyRight}>
            <RecordConvergence />
          </div>

          {/* Row 3: the record journey, across the full content width */}
          <div className={styles.fourPillarsRecord__journeyRow}>
            <TransactionTimeline />
          </div>
        </div>
      </div>
    </section>
  );
}
