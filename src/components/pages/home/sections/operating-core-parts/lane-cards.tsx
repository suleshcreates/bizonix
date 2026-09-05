import { Check, PackageCheck, ScanLine, Warehouse } from "lucide-react";
import type { CSSProperties } from "react";
import {
  allocation,
  counterSale,
  replenishment,
} from "@/lib/content/home/operating-core-data";
import styles from "@/components/pages/home/home.module.css";

/**
 * Persistent, always-visible provenance chip. Every illustrative card in this
 * section carries one; none of them are ever allowed to read as live data.
 */
function SampleChip() {
  return <span className={styles.operatingCore__sampleChip}>Sample data</span>;
}

/** Header shared by all three cards: title, sample chip, document id. */
function CardHead({
  icon,
  title,
  doc,
}: {
  icon: React.ReactNode;
  title: string;
  doc: string;
}) {
  return (
    <header className={styles.operatingCore__cardHead}>
      <span className={styles.operatingCore__cardTitle}>
        {icon}
        {title}
      </span>
      <SampleChip />
      <b className={styles.operatingCore__cardDoc}>{doc}</b>
    </header>
  );
}

/**
 * Wholesale HQ. The two split rows derive from Committed, so the card is
 * arithmetically checkable: 6,280 × 72% = 4,522 and × 28% = 1,758, and those
 * two add back to 6,280.
 */
export function AllocationCard({ doc }: { doc: string }) {
  return (
    <div className={styles.operatingCore__laneCard}>
      <CardHead
        icon={<Warehouse size={15} strokeWidth={2} aria-hidden="true" />}
        title="Network allocation"
        doc={doc}
      />

      <div className={styles.operatingCore__kpiRow}>
        <span>
          <small>Available</small>
          <b>{allocation.available}</b>
        </span>
        <span>
          <small>Committed</small>
          <b>{allocation.committed}</b>
        </span>
      </div>

      <dl className={styles.operatingCore__splitList}>
        {allocation.splits.map((split, index) => (
          <div key={split.label} className={styles.operatingCore__split}>
            <dt>{split.label}</dt>
            <dd>
              <b>{split.pct}</b>
              <span aria-hidden="true"> · </span>
              {split.pieces}
            </dd>
            <i className={styles.operatingCore__splitTrack} aria-hidden="true">
              <em
                className={styles.operatingCore__splitFill}
                style={
                  {
                    "--v": split.share,
                    "--fill-delay": `${index * 0.03}`,
                  } as CSSProperties
                }
              />
            </i>
          </div>
        ))}
      </dl>

      <footer className={styles.operatingCore__cardFoot}>
        <Check size={14} aria-hidden="true" /> Committed stock is reserved, not
        just counted
      </footer>
    </div>
  );
}

/**
 * Company retail / POS. Both lines sit in the 12% apparel slab so a single
 * CGST/SGST pair is honest, and line amounts are shown exclusive of tax so the
 * total is derivable on screen.
 */
export function CounterCard({ doc }: { doc: string }) {
  return (
    <div className={styles.operatingCore__laneCard}>
      <CardHead
        icon={<ScanLine size={15} strokeWidth={2} aria-hidden="true" />}
        title={`${counterSale.counter} · Sale`}
        doc={doc}
      />

      <ul className={styles.operatingCore__lineItems}>
        {counterSale.lines.map((line) => (
          <li key={line.name}>
            <span>{line.name}</span>
            <b>{line.amount}</b>
          </li>
        ))}
      </ul>

      <dl className={styles.operatingCore__taxRows}>
        <div>
          <dt>Taxable value</dt>
          <dd>{counterSale.taxable}</dd>
        </div>
        <div>
          <dt>CGST 6%</dt>
          <dd>{counterSale.cgst}</dd>
        </div>
        <div>
          <dt>SGST 6%</dt>
          <dd>{counterSale.sgst}</dd>
        </div>
        <div className={styles.operatingCore__taxTotal}>
          <dt>Total payable</dt>
          <dd>{counterSale.total}</dd>
        </div>
      </dl>

      <footer className={styles.operatingCore__cardFoot}>
        <Check size={14} aria-hidden="true" /> One entry — stock, ledger and
        return
      </footer>
    </div>
  );
}

/** Franchise outlets. A replenishment request moving inside its permissions. */
export function ReplenishmentCard({ doc }: { doc: string }) {
  return (
    <div className={styles.operatingCore__laneCard}>
      <CardHead
        icon={<PackageCheck size={15} strokeWidth={2} aria-hidden="true" />}
        title="Replenishment"
        doc={doc}
      />

      <div className={styles.operatingCore__orderHead}>
        <span>
          <small>{replenishment.item}</small>
          <b>{replenishment.pieces}</b>
        </span>
        <em className={styles.operatingCore__orderState}>{replenishment.state}</em>
      </div>

      <ol className={styles.operatingCore__steps}>
        {replenishment.steps.map((step) => (
          <li key={step.label} data-done={step.done ? "yes" : "no"}>
            <i aria-hidden="true">
              {step.done ? <Check size={11} strokeWidth={3} /> : null}
            </i>
            {step.label}
          </li>
        ))}
      </ol>

      <footer className={styles.operatingCore__cardFoot}>
        <Check size={14} aria-hidden="true" /> Inside this outlet&rsquo;s stock
        and pricing rules
      </footer>
    </div>
  );
}
