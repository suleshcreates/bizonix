import { FourPillarsHeader } from "./four-pillars-parts/four-pillars-header";
import { PillarPanorama } from "./four-pillars-parts/pillar-panorama";
import { OperatingModelRail } from "./four-pillars-parts/operating-model-rail";
import { RecordConvergence } from "./four-pillars-parts/record-convergence";
import { TransactionTimeline } from "./four-pillars-parts/transaction-timeline";
import styles from "./four-pillars-record.module.css";

/**
 * Four pillars, one record — asymmetric editorial composition.
 *
 * LEFT  ~34%  header copy + operating model rail
 * RIGHT ~66%  panoramic pillar strip + record convergence + timeline
 *
 * The two-column grid keeps the left editorial aligned with the right visual
 * story. The section ends after the timeline — nothing else follows.
 */
export function FourPillarsRecordSection() {
  return (
    <section className={styles.section} aria-labelledby="pillars-title">
      <div className={styles.shell}>
        <div className={styles.sectionGrid}>
          {/* Row 1: header left + panorama right */}
          <FourPillarsHeader />
          <PillarPanorama />

          {/* Spacer row */}
          <div className={styles.headerGap} aria-hidden="true" />

          {/* Row 2: operating model left + record visuals right */}
          <OperatingModelRail />
          <div className={styles.bodyRight}>
            <RecordConvergence />
            <TransactionTimeline />
          </div>
        </div>
      </div>
    </section>
  );
}
