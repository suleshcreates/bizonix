"use client";

import { BadgeCheck } from "lucide-react";
import type { CSSProperties } from "react";
import { featureSummaries } from "@/lib/content/features/features";
import {
  gstCaptures,
  invoiceLines,
  invoiceParty,
  invoiceTax,
} from "@/lib/content/features/gst-invoice";
import { useStage } from "../use-stage";
import { FeatureMark, RelatedModules } from "./feature-atoms";
import styles from "@/components/pages/features/features.module.css";

const feature = featureSummaries[2];

/**
 * Feature 03 — GST, showcased as a document assembling itself.
 *
 * The invoice is the hero object here, and it is built in the order the data
 * is actually captured: party first, then place of supply, then the lines, and
 * only then the tax split that falls out of them. Nothing on it is typed at
 * month-end, which is the whole argument — so the last thing to land is the
 * stamp, not a number.
 */
export function GstCompliance() {
  const { ref } = useStage<HTMLElement>();

  return (
    <section
      ref={ref}
      id={feature.id}
      className={styles.gstCompliance__section}
      style={{ "--accent": feature.accent } as CSSProperties}
      aria-labelledby="feature-gst-title"
    >
      <span className={styles.gstCompliance__ledger} aria-hidden="true" />

      <div className={styles.gstCompliance__shell}>
        <div className={styles.gstCompliance__stage}>
          <article className={styles.gstCompliance__invoice} aria-hidden="true">
            <header className={styles.gstCompliance__invoiceHead}>
              <div>
                <p className={styles.gstCompliance__invoiceType}>Tax invoice</p>
                <p className={styles.gstCompliance__invoiceNo}>
                  BZX / 25-26 / 01184
                </p>
              </div>
              <p className={styles.gstCompliance__invoiceDate}>24 Aug 2026</p>
            </header>

            <div className={styles.gstCompliance__party}>
              <div className={styles.gstCompliance__partyRow}>
                <span>Billed to</span>
                <strong>{invoiceParty.name}</strong>
              </div>
              <div
                className={styles.gstCompliance__partyRow}
                data-verified="true"
              >
                <span>GSTIN</span>
                <strong>
                  {invoiceParty.gstin}
                  <BadgeCheck
                    className={styles.gstCompliance__verified}
                    size={14}
                  />
                </strong>
              </div>
              <div className={styles.gstCompliance__partyRow}>
                <span>Place of supply</span>
                <strong>{invoiceParty.place}</strong>
              </div>
              <p className={styles.gstCompliance__supplyFlag}>
                {invoiceParty.supply}
              </p>
            </div>

            <table className={styles.gstCompliance__lines}>
              <thead>
                <tr>
                  <th>HSN</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Taxable</th>
                </tr>
              </thead>
              <tbody>
                {invoiceLines.map((line, index) => (
                  <tr key={line.item} style={{ "--i": index } as CSSProperties}>
                    <td>{line.hsn}</td>
                    <td>{line.item}</td>
                    <td>{line.qty}</td>
                    <td>{line.rate}</td>
                    <td>{line.taxable}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <dl className={styles.gstCompliance__totals}>
              {invoiceTax.map((row, index) => (
                <div
                  key={row.label}
                  style={{ "--i": index } as CSSProperties}
                  data-emphasis={
                    "emphasis" in row && row.emphasis ? "true" : "false"
                  }
                >
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>

            <span className={styles.gstCompliance__stamp}>
              <span>GST</span>
              <span>ready</span>
            </span>
          </article>

          <p className={styles.gstCompliance__stageNote}>
            The same capture runs behind a ₹900 counter bill and a ₹9 lakh
            wholesale dispatch.
          </p>
        </div>

        <div className={styles.gstCompliance__copy}>
          <FeatureMark
            index={feature.index}
            discipline={feature.discipline}
            tone={feature.tone}
          />
          <h2 id="feature-gst-title">
            <span className={styles.featuresHeading__blue}>The invoice is</span>{" "}
            <span className={styles.featuresHeading__violet}>
              a by-product,
            </span>{" "}
            <span className={styles.featuresHeading__teal}>
              not a monthly project.
            </span>
          </h2>
          <p className={styles.gstCompliance__why}>
            Month-end pain is almost always a capture problem: the tax data was
            never on the transaction, so somebody rebuilds it from bills weeks
            later. Bizonix takes it where the transaction happens — GSTIN from
            the party master, HSN from the item, place of supply from the bill —
            so the return is a read, not a reconstruction.
          </p>

          <ul className={styles.gstCompliance__captures}>
            {gstCaptures.map((capture, index) => (
              <li key={capture.label} style={{ "--i": index } as CSSProperties}>
                <p className={styles.gstCompliance__captureLabel}>
                  {capture.label}
                </p>
                <p className={styles.gstCompliance__captureBody}>
                  {capture.body}
                </p>
              </li>
            ))}
          </ul>

          <RelatedModules id={feature.id} tone={feature.tone} />
        </div>
      </div>
    </section>
  );
}
