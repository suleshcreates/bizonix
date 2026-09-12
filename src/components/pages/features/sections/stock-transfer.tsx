"use client";

import { Building2, FileText, Store, Truck } from "lucide-react";
import type { CSSProperties } from "react";
import { featureSummaries } from "@/lib/content/features/features";
import {
  transferCheckpoints,
  transferConsignment,
} from "@/lib/content/features/stock-transfer";
import { useStage } from "../use-stage";
import { FeatureMark, RelatedModules } from "./feature-atoms";
import styles from "@/components/pages/features/features.module.css";

const feature = featureSummaries[4];
const inr = new Intl.NumberFormat("en-IN");

/** Which checkpoint each side's stock actually moves on. */
const DISPATCHED = 2;
const RECEIVED = 4;
const IN_TRANSIT = 3;

const ledgerEntries = [
  { at: 2, label: "HQ warehouse", value: "− 48 pcs" },
  { at: 3, label: "In transit", value: "48 pcs held" },
  { at: 4, label: "Franchise outlet", value: "+ 48 pcs" },
  { at: 5, label: "Entity books", value: "Posted both sides" },
] as const;

/**
 * Feature 05 — stock transfer, showcased as a crossing.
 *
 * Desktop keeps the scroll-driven lane. Mobile art-directs the same data into
 * one compact operational record so the two locations, moving consignment,
 * six states and resulting book entries remain readable at handset widths.
 */
export function StockTransfer() {
  const { ref, stage } = useStage<HTMLElement>(transferCheckpoints.length);
  const current = transferCheckpoints[stage];
  const finalCheckpoint = transferCheckpoints.at(-1)!;
  const { from, to } = transferConsignment;

  return (
    <section
      ref={ref}
      id={feature.id}
      className={styles.stockTransfer__section}
      style={{ "--accent": feature.accent } as CSSProperties}
      aria-labelledby="feature-transfer-title"
    >
      <span className={styles.stockTransfer__terrain} aria-hidden="true" />

      <div className={styles.stockTransfer__shell}>
        <header className={styles.stockTransfer__head}>
          <div>
            <FeatureMark
              index={feature.index}
              discipline={feature.discipline}
              tone={feature.tone}
            />
            <h2 id="feature-transfer-title">
              <span className={styles.featuresHeading__blue}>Stock in transit</span>{" "}
              is still
              <br className={styles.stockTransfer__mobileBreak} /> stock you can see.
            </h2>
          </div>
          <p className={styles.stockTransfer__why}>
            Between the dispatch gate and the outlet&apos;s back door, most
            systems go dark, and the difference turns up as a shortage weeks
            later. Bizonix keeps the consignment on the books the whole way,
            with HQ and the outlet reading the same numbers at the same time.
          </p>
        </header>

        <div className={styles.stockTransfer__desktopExperience}>
          <div className={styles.stockTransfer__lane}>
            <TransferNode
              icon={Building2}
              label={from.label}
              place={from.place}
              value={stage >= DISPATCHED ? from.after : from.before}
              moved={stage >= DISPATCHED}
            />

            <div className={styles.stockTransfer__track}>
              <div className={styles.stockTransfer__rail} aria-hidden="true">
                <span className={styles.stockTransfer__railFill} />
              </div>
              <span className={styles.stockTransfer__packet} aria-hidden="true">
                {transferConsignment.reference} · {transferConsignment.pieces} pcs
              </span>
              <CheckpointList stage={stage} />
            </div>

            <TransferNode
              icon={Store}
              label={to.label}
              place={to.place}
              value={stage >= RECEIVED ? to.after : to.before}
              moved={stage >= RECEIVED}
            />
          </div>

          <div className={styles.stockTransfer__foot}>
            <ResultCard checkpoint={current} />
            <LedgerCard stage={stage} />
          </div>
          <RelatedModules id={feature.id} tone={feature.tone} />
        </div>

        <div className={styles.stockTransfer__mobileExperience}>
          <div className={styles.stockTransfer__mobilePanel}>
            <div className={styles.stockTransfer__mobileLocations}>
              <TransferNode
                icon={Building2}
                label={from.label}
                place={from.place}
                value={from.after}
                moved
                mobile
              />

              <div className={styles.stockTransfer__mobileBridge} aria-hidden="true">
                <span className={styles.stockTransfer__mobileSignal} />
                <i><Truck size={24} /></i>
              </div>

              <TransferNode
                icon={Store}
                label={to.label}
                place={to.place}
                value={to.after}
                moved
                mobile
              />
            </div>

            <div className={styles.stockTransfer__mobileTransfer}>
              <span className={styles.stockTransfer__mobilePacket}>
                {transferConsignment.reference} · {transferConsignment.pieces} pcs
              </span>
              <CheckpointList stage={IN_TRANSIT} fixedCurrent />
            </div>
          </div>

          <ResultCard checkpoint={finalCheckpoint} final />
          <LedgerCard stage={transferCheckpoints.length - 1} />
          <RelatedModules id={feature.id} tone={feature.tone} />
        </div>
      </div>
    </section>
  );
}

function TransferNode({
  icon: Icon,
  label,
  place,
  value,
  moved,
  mobile = false,
}: {
  icon: typeof Building2;
  label: string;
  place: string;
  value: number;
  moved: boolean;
  mobile?: boolean;
}) {
  return (
    <article
      className={`${styles.stockTransfer__node} ${
        mobile ? styles.stockTransfer__mobileNode : ""
      }`}
    >
      <p className={styles.stockTransfer__nodeKind}>
        <Icon size={mobile ? 21 : 14} aria-hidden="true" />
        {label}
      </p>
      <p className={styles.stockTransfer__nodePlace}>{place}</p>
      <p className={styles.stockTransfer__nodeCount} data-moved={moved}>
        {inr.format(value)}
        <span>pieces on hand</span>
      </p>
    </article>
  );
}

function CheckpointList({
  stage,
  fixedCurrent = false,
}: {
  stage: number;
  fixedCurrent?: boolean;
}) {
  return (
    <ol className={styles.stockTransfer__checkpoints}>
      {transferCheckpoints.map((checkpoint, index) => (
        <li
          key={checkpoint.key}
          data-on={index <= stage ? "true" : "false"}
          data-current={index === stage ? "true" : "false"}
          data-fixed={fixedCurrent ? "true" : "false"}
        >
          <i aria-hidden="true" />
          <span>{checkpoint.short}</span>
        </li>
      ))}
    </ol>
  );
}

function ResultCard({
  checkpoint,
  final = false,
}: {
  checkpoint: (typeof transferCheckpoints)[number];
  final?: boolean;
}) {
  return (
    <div className={styles.stockTransfer__readout} aria-live="polite">
      <p className={styles.stockTransfer__readoutMeta}>
        <span className={styles.stockTransfer__readoutStep}>
          {final ? "06 / 06" : `${String(transferCheckpoints.indexOf(checkpoint) + 1).padStart(2, "0")} / 06`}
        </span>
        <span className={styles.stockTransfer__readoutActor}>{checkpoint.actor}</span>
      </p>
      {final && (
        <span className={styles.stockTransfer__resultIcon} aria-hidden="true">
          <FileText size={24} />
        </span>
      )}
      <p className={styles.stockTransfer__readoutLabel}>{checkpoint.label}</p>
      <p className={styles.stockTransfer__readoutBody}>{checkpoint.body}</p>
    </div>
  );
}

function LedgerCard({ stage }: { stage: number }) {
  return (
    <div className={styles.stockTransfer__ledger}>
      <p className={styles.stockTransfer__ledgerHead}>What the books do on their own</p>
      <ul>
        {ledgerEntries.map((entry) => (
          <li key={entry.label} data-on={stage >= entry.at}>
            <span>{entry.label}</span>
            <strong>{entry.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}