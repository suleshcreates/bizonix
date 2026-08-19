import { PillarPanorama } from "./capability-pillars-parts/pillar-panorama";
import { PillarsHeader } from "./capability-pillars-parts/pillars-header";
import { RecordConvergence } from "./capability-pillars-parts/record-convergence";
import { TransactionTimeline } from "./capability-pillars-parts/transaction-timeline";
import styles from "./capability-pillars-grid.module.css";

/**
 * Four pillars, one record.
 *
 * Four layers, in order: editorial header, one panoramic four-pillar strip,
 * the record convergence canvas, and the transaction timeline. The timeline
 * ends the section — nothing follows it.
 */
export function CapabilityPillars() {
  return (
    <section className={styles.section} aria-labelledby="pillars-title">
      <div className={styles.shell}>
        <PillarsHeader />
        <PillarPanorama />
        <RecordConvergence />
        <TransactionTimeline />
      </div>
    </section>
  );
}
