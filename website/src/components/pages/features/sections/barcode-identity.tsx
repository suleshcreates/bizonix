"use client";

import { Printer, RefreshCcw, ScanLine } from "lucide-react";
import type { CSSProperties } from "react";
import {
  barcodeAside,
  barcodeSteps,
  pieceRecord,
} from "@/lib/content/features/barcode-identity";
import { featureSummaries } from "@/lib/content/features/features";
import { useStage } from "../use-stage";
import { FeatureMark, RelatedModules } from "./feature-atoms";
import styles from "@/components/pages/features/features.module.css";

const feature = featureSummaries[0];
const stepIcons = [Printer, ScanLine, RefreshCcw];

/** A fixed, irregular bar pattern — deterministic so server and client agree. */
const bars = Array.from({ length: 46 }, (_, index) => {
  const seed = Math.abs(Math.sin(index * 12.9898) * 43758.5453) % 1;
  return 2 + Math.floor(seed * 7);
});

/**
 * Feature 01 — barcode, showcased as a read.
 *
 * The mechanism is literal: a beam crosses a wall of bars as the section
 * scrolls in, and everything downstream of the beam resolves — the bars go
 * from grey to ink, the piece number types itself out, and the record fields
 * land one at a time. Scroll position is the scanner. `--p` from `useStage`
 * drives all of it in CSS; nothing here animates on a timer.
 */
export function BarcodeIdentity() {
  const { ref } = useStage<HTMLElement>();

  return (
    <section
      ref={ref}
      id={feature.id}
      className={styles.features__barcodeIdentity__section}
      style={{ "--accent": feature.accent } as CSSProperties}
      aria-labelledby="feature-barcode-title"
    >
      <span
        className={styles.features__barcodeIdentity__rule}
        aria-hidden="true"
      />
      <span
        className={styles.features__barcodeIdentity__ghost}
        aria-hidden="true"
      >
        {feature.index}
      </span>

      <div className={styles.features__barcodeIdentity__shell}>
        <div className={styles.features__barcodeIdentity__copy}>
          <FeatureMark
            index={feature.index}
            discipline={feature.discipline}
            tone={feature.tone}
          />
          <h2 id="feature-barcode-title">
            <span className={styles.featuresHeading__blue}>Every piece</span>{" "}
            <span className={styles.featuresHeading__cyan}>has to</span>{" "}
            <span className={styles.featuresHeading__teal}>
              answer for itself.
            </span>
          </h2>
          <p className={styles.features__barcodeIdentity__why}>
            A style code tells you <em>what</em> something is. A piece barcode
            tells you <em>which one</em> — which purchase series it arrived on,
            which outlet holds it, which bill it left on. Identity at the piece
            level is what stops a stock count from being an argument.
          </p>

          <ol className={styles.features__barcodeIdentity__steps}>
            {barcodeSteps.map((step, index) => {
              const Icon = stepIcons[index];
              return (
                <li
                  key={step.step}
                  style={{ "--i": index } as CSSProperties}
                  className={styles.features__barcodeIdentity__step}
                >
                  <span className={styles.features__barcodeIdentity__stepIcon}>
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <p className={styles.features__barcodeIdentity__stepHead}>
                      <span
                        className={styles.features__barcodeIdentity__stepKicker}
                      >
                        {step.step}
                      </span>
                      {step.title}
                    </p>
                    <p className={styles.features__barcodeIdentity__stepBody}>
                      {step.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <p className={styles.features__barcodeIdentity__aside}>
            <strong>{barcodeAside.title}</strong> {barcodeAside.body}
          </p>

          <RelatedModules id={feature.id} tone={feature.tone} />
        </div>

        <div className={styles.features__barcodeIdentity__stage}>
          <div className={styles.features__barcodeIdentity__scanner}>
            <div className={styles.features__barcodeIdentity__scannerHead}>
              <span
                className={styles.features__barcodeIdentity__scannerDot}
                aria-hidden="true"
              />
              Piece scan · label read
            </div>

            <div
              className={styles.features__barcodeIdentity__bars}
              aria-hidden="true"
            >
              <div className={styles.features__barcodeIdentity__barLayer}>
                {bars.map((weight, index) => (
                  <i key={index} style={{ flexGrow: weight }} />
                ))}
              </div>
              <div className={styles.features__barcodeIdentity__barLayerRead}>
                {bars.map((weight, index) => (
                  <i key={index} style={{ flexGrow: weight }} />
                ))}
              </div>
              <span className={styles.features__barcodeIdentity__beam} />
            </div>

            <p
              className={styles.features__barcodeIdentity__code}
              aria-hidden="true"
            >
              <span>BZX</span>
              <span>2451</span>
              <span>0187</span>
              <span className={styles.features__barcodeIdentity__codeCheck}>
                ✓
              </span>
            </p>
          </div>

          <div className={styles.features__barcodeIdentity__record}>
            <p className={styles.features__barcodeIdentity__recordHead}>
              Resolved piece record
            </p>
            <dl>
              {pieceRecord.map((row, index) => (
                <div
                  key={row.label}
                  className={styles.features__barcodeIdentity__recordRow}
                  style={{ "--i": index } as CSSProperties}
                >
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
