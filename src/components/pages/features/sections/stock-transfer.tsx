"use client";

import { Building2, Store } from "lucide-react";
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

const ledgerEntries = [
  { at: 2, label: "HQ warehouse", value: "− 48 pcs" },
  { at: 3, label: "In transit", value: "48 pcs held" },
  { at: 4, label: "Franchise outlet", value: "+ 48 pcs" },
  { at: 5, label: "Entity books", value: "Posted both sides" },
] as const;

/**
 * Feature 05 — stock transfer, showcased as a crossing.
 *
 * The consignment is the thing that moves, so the viewport is a lane: HQ on
 * one side, the outlet on the other, and a packet that walks the lane with
 * scroll. The two stock counts only change on the checkpoints where stock
 * really changes hands — dispatch and receipt — because the argument of the
 * section is that the in-between is visible rather than a gap.
 */
export function StockTransfer() {
  const { ref, stage } = useStage<HTMLElement>(transferCheckpoints.length);
  const current = transferCheckpoints[stage];
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
              Stock in transit is still stock you can see.
            </h2>
          </div>
          <p className={styles.stockTransfer__why}>
            Between the dispatch gate and the outlet&apos;s back door, most
            systems go dark, and the difference turns up as a shortage weeks
            later. Bizonix keeps the consignment on the books the whole way,
            with HQ and the outlet reading the same numbers at the same time.
          </p>
        </header>

        <div className={styles.stockTransfer__lane}>
          <article className={styles.stockTransfer__node}>
            <p className={styles.stockTransfer__nodeKind}>
              <Building2 size={14} aria-hidden="true" />
              {from.label}
            </p>
            <p className={styles.stockTransfer__nodePlace}>{from.place}</p>
            <p className={styles.stockTransfer__nodeCount} data-moved={stage >= DISPATCHED}>
              {inr.format(stage >= DISPATCHED ? from.after : from.before)}
              <span>pieces on hand</span>
            </p>
          </article>

          <div className={styles.stockTransfer__track}>
            <div className={styles.stockTransfer__rail} aria-hidden="true">
              <span className={styles.stockTransfer__railFill} />
            </div>

            <span className={styles.stockTransfer__packet} aria-hidden="true">
              {transferConsignment.reference} · {transferConsignment.pieces} pcs
            </span>

            <ol className={styles.stockTransfer__checkpoints}>
              {transferCheckpoints.map((checkpoint, index) => (
                <li
                  key={checkpoint.key}
                  data-on={index <= stage ? "true" : "false"}
                >
                  <i aria-hidden="true" />
                  <span>{checkpoint.short}</span>
                </li>
              ))}
            </ol>
          </div>

          <article className={styles.stockTransfer__node}>
            <p className={styles.stockTransfer__nodeKind}>
              <Store size={14} aria-hidden="true" />
              {to.label}
            </p>
            <p className={styles.stockTransfer__nodePlace}>{to.place}</p>
            <p className={styles.stockTransfer__nodeCount} data-moved={stage >= RECEIVED}>
              {inr.format(stage >= RECEIVED ? to.after : to.before)}
              <span>pieces on hand</span>
            </p>
          </article>
        </div>

        <div className={styles.stockTransfer__foot}>
          <div className={styles.stockTransfer__readout} aria-live="polite">
            <p className={styles.stockTransfer__readoutMeta}>
              <span className={styles.stockTransfer__readoutStep}>
                {String(stage + 1).padStart(2, "0")} /
                {String(transferCheckpoints.length).padStart(2, "0")}
              </span>
              <span className={styles.stockTransfer__readoutActor}>{current.actor}</span>
            </p>
            <p className={styles.stockTransfer__readoutLabel}>{current.label}</p>
            <p className={styles.stockTransfer__readoutBody}>{current.body}</p>
          </div>

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
        </div>

        <RelatedModules id={feature.id} tone={feature.tone} />
      </div>
    </section>
  );
}
