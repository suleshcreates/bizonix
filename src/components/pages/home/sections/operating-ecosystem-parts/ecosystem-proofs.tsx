import { Check, PackageCheck, ScanLine, Warehouse, Zap } from "lucide-react";
import styles from "@/components/pages/home/home.module.css";

/**
 * The three operational proof artifacts, one per operating entity.
 *
 * Shared by both renderers so the numbers can never drift: the desktop
 * network positions them on its canvas, the handset flow drops them inside
 * each entity block. Only the wrapper class differs.
 */
type ProofProps = { className: string };

export function AllocationProof({ className }: ProofProps) {
  return (
    <aside className={`${styles.operatingEcosystem__fragment} ${className}`}>
      <header>
        <span>
          <Warehouse size={18} /> Network Allocation
        </span>
        <Zap size={17} />
      </header>
      <div className={styles.operatingEcosystem__kpis}>
        <span>
          <small>Available</small>
          <b>18,420</b>
        </span>
        <span>
          <small>Committed</small>
          <b>6,280</b>
        </span>
      </div>
      <Metric label="Retail network" value="72%" width="72%" />
      <Metric label="Franchise pool" value="48%" width="48%" />
      <footer>
        <Check size={15} /> Purchase plan matched to demand
      </footer>
    </aside>
  );
}

function Metric({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div className={styles.operatingEcosystem__metric}>
      <span>
        {label}
        <b>{value}</b>
      </span>
      <i>
        <em style={{ width }} />
      </i>
    </div>
  );
}

export function CounterProof({ className }: ProofProps) {
  return (
    <aside className={`${styles.operatingEcosystem__fragment} ${className}`}>
      <header>
        <span>
          <ScanLine size={18} /> Counter 04 · Sale
        </span>
        <b>•••</b>
      </header>
      <div className={styles.operatingEcosystem__posBody}>
        <span className={styles.operatingEcosystem__posSignal}>
          <ScanLine size={20} />
        </span>
        <div className={styles.operatingEcosystem__lineItems}>
          <span>
            Classic Oxford Shirt <b>₹2,490</b>
          </span>
          <span>
            Travel Pouch <b>₹1,790</b>
          </span>
        </div>
      </div>
      <div className={styles.operatingEcosystem__totalLine}>
        <span>2 items · GST included</span>
        <b>₹4,280</b>
      </div>
      <footer>
        <Check size={15} /> Paid · stock and books updated
      </footer>
    </aside>
  );
}

export function ReplenishmentProof({ className }: ProofProps) {
  return (
    <aside className={`${styles.operatingEcosystem__fragment} ${className}`}>
      <header>
        <span>Replenishment</span>
        <PackageCheck size={18} />
      </header>
      <div className={styles.operatingEcosystem__orderTitle}>
        <span>
          <small>Suggested order</small>
          <b>24 pieces</b>
        </span>
        <em>Ready</em>
      </div>
      <div className={styles.operatingEcosystem__orderSteps}>
        <span>
          <i>
            <Check size={12} />
          </i>
          Requested
        </span>
        <b />
        <span>
          <i>
            <Check size={12} />
          </i>
          Allocated
        </span>
        <b />
        <span>
          <i /> Dispatch
        </span>
      </div>
      <footer>
        <Check size={15} /> Within outlet permissions
      </footer>
    </aside>
  );
}
