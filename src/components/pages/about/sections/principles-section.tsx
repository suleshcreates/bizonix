"use client";

import type { ReactNode } from "react";
import { Check, ShieldCheck } from "lucide-react";
import {
  aboutPrinciples,
  barcodeCheckpoints,
  booksEvents,
  entityEnvironments,
  sampleBarcodeId,
  type AboutPrinciple,
} from "@/lib/content/about/about-page";
import { useReveal, useStageProgress } from "../about-motion";
import styles from "@/components/pages/about/about.module.css";

/* ---------------------------------------------------------------------------
 * Shared chrome
 *
 * Principles use the opposite composition to the values above: a wide header
 * band across the top and a full-width canvas beneath it, so the page changes
 * rhythm as it moves from what we believe to how the product is built.
 * ------------------------------------------------------------------------ */

function PrincipleFrame({
  principle,
  chapter,
  tone,
  children,
  stageRef,
}: {
  principle: AboutPrinciple;
  chapter?: string;
  tone: string;
  children: ReactNode;
  stageRef: React.Ref<HTMLElement>;
}) {
  return (
    <section
      ref={stageRef}
      id={principle.id}
      className={`${styles.about__principles__stage} ${tone}`}
      aria-labelledby={`${principle.id}-title`}
    >
      <div className={styles.about__principles__frame}>
        <header className={styles.about__principles__head}>
          <div>
            {chapter && (
              <p className={styles.about__principles__chapter}>
                <span aria-hidden="true" />
                {chapter}
              </p>
            )}
            <p className={styles.about__principles__marker}>
              <b>{principle.number}</b>
              <i aria-hidden="true" />
              {principle.label}
            </p>
            <h2 id={`${principle.id}-title`} className={styles.about__principles__headline}>
              {principle.headlinePrimary}
              <em>{principle.headlineAccent}</em>
            </h2>
          </div>
          <div className={styles.about__principles__headBody}>
            <p>{principle.body}</p>
            <p className={styles.about__principles__frameTag}>
              <span aria-hidden="true" />
              {principle.frame}
            </p>
          </div>
        </header>

        <div className={styles.about__principles__canvas}>{children}</div>

        <p className={styles.about__principles__caption}>{principle.caption}</p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * 01 Entity isolation — three sealed lanes under one consolidated view
 *
 * Ambient rather than scrubbed: records circulate continuously inside their own
 * environment and are turned back at the boundary, while summary lines feed
 * upward into the brand view. Isolation is a standing property, so it is shown
 * as a loop instead of something the reader drives.
 * ------------------------------------------------------------------------ */

function IsolationVisual() {
  const { ref, revealed } = useReveal<HTMLDivElement>(0.25);

  return (
    <div
      ref={ref}
      className={`${styles.about__principles__isolation} ${revealed ? styles.about__principles__live : ""}`}
    >
      <div className={styles.about__principles__rollup}>
        <span className={styles.about__principles__rollupIcon} aria-hidden="true">
          <ShieldCheck size={16} strokeWidth={1.9} />
        </span>
        <b>Brand view</b>
        <em>Consolidated totals roll up. Entity ledgers never cross.</em>
      </div>

      <div className={styles.about__principles__lanes}>
        {entityEnvironments.map((environment, index) => (
          <div
            key={environment.id}
            className={styles.about__principles__lane}
            style={{ "--i": index } as React.CSSProperties}
          >
            <span className={styles.about__principles__feed} aria-hidden="true" />

            <div className={styles.about__principles__laneHead}>
              <b>{environment.name}</b>
              <em>{environment.scope}</em>
            </div>

            <ul className={styles.about__principles__laneRows}>
              {environment.rows.map((row) => (
                <li key={row}>
                  <span aria-hidden="true" />
                  {row}
                </li>
              ))}
            </ul>

            <span className={styles.about__principles__packet} aria-hidden="true" />
            <span className={styles.about__principles__wall} aria-hidden="true" />
            <span className={styles.about__principles__deflect} aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * 02 Barcode truth — one piece, four checkpoints
 *
 * Scrubbed: the reader physically moves the piece through receiving, transfer,
 * counter and books. The identity chip below never changes, which is the whole
 * claim.
 * ------------------------------------------------------------------------ */

/** Deterministic bar widths — a barcode that looks scanned, not random noise. */
const bars = Array.from({ length: 44 }, (_, index) =>
  [1, 3, 2, 1, 4, 1, 2, 3][index % 8],
);

function BarcodeVisual({ step }: { step: number }) {
  return (
    <div className={styles.about__principles__barcodeScene}>
      <div className={styles.about__principles__checkpointRail}>
        <span className={styles.about__principles__railBase} aria-hidden="true">
          <i />
        </span>

        <ol className={styles.about__principles__checkpoints}>
          {barcodeCheckpoints.map((checkpoint, index) => (
            <li
              key={checkpoint.id}
              style={{ "--i": index } as React.CSSProperties}
            >
              <span className={styles.about__principles__checkDot} aria-hidden="true" />
              <b>{checkpoint.label}</b>
              <em>{checkpoint.note}</em>
              <span className={styles.about__principles__stamp}>{sampleBarcodeId}</span>
            </li>
          ))}
        </ol>

        <div className={styles.about__principles__carrier} aria-hidden="true">
          <div className={styles.about__principles__piece}>
            <div className={styles.about__principles__bars}>
              {bars.map((weight, index) => (
                <i key={index} style={{ "--w": weight } as React.CSSProperties} />
              ))}
            </div>
            <span className={styles.about__principles__scanLine} />
          </div>
        </div>
      </div>

      <p className={styles.about__principles__identity}>
        <span>Identity</span>
        <b>{sampleBarcodeId}</b>
        <em>unchanged at checkpoint {step + 1} of {barcodeCheckpoints.length}</em>
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * 03 Books that match ops — every event writes its own line
 *
 * Scrubbed: each operational event on the left draws its consequence across to
 * the ledger on the right, in the order it happened. Sample records, labelled
 * illustrative.
 * ------------------------------------------------------------------------ */

function BooksVisual() {
  return (
    <div
      className={styles.about__principles__books}
      style={{ "--n": booksEvents.length } as React.CSSProperties}
    >
      <div className={styles.about__principles__booksHead}>
        <span>On the floor</span>
        <span className={styles.about__principles__booksHeadRight}>In the books</span>
      </div>

      <ol className={styles.about__principles__matchRows}>
        {booksEvents.map((row, index) => (
          <li key={row.event} style={{ "--i": index } as React.CSSProperties}>
            <div className={styles.about__principles__opCell}>
              <b>{row.event}</b>
              <em>{row.detail}</em>
            </div>
            <span className={styles.about__principles__link} aria-hidden="true">
              <i />
            </span>
            <div className={styles.about__principles__entryCell}>{row.entry}</div>
          </li>
        ))}
      </ol>

      <div className={styles.about__principles__booksFoot}>
        <span className={styles.about__principles__illustrative}>Illustrative</span>
        <span className={styles.about__principles__matched}>
          <Check size={13} strokeWidth={3} aria-hidden="true" />
          No month-end re-entry
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function EntityIsolation({ principle }: { principle: AboutPrinciple }) {
  const { ref } = useStageProgress<HTMLElement>();
  return (
    <PrincipleFrame
      principle={principle}
      chapter="Product principles"
      tone={styles.about__principles__toneLight}
      stageRef={ref}
    >
      <IsolationVisual />
    </PrincipleFrame>
  );
}

function BarcodeTruth({ principle }: { principle: AboutPrinciple }) {
  const { ref, step } = useStageProgress<HTMLElement>(barcodeCheckpoints.length);
  return (
    <PrincipleFrame principle={principle} tone={styles.about__principles__toneNavy} stageRef={ref}>
      <BarcodeVisual step={step} />
    </PrincipleFrame>
  );
}

function BooksMatchOps({ principle }: { principle: AboutPrinciple }) {
  const { ref } = useStageProgress<HTMLElement>();
  return (
    <PrincipleFrame principle={principle} tone={styles.about__principles__toneSoft} stageRef={ref}>
      <BooksVisual />
    </PrincipleFrame>
  );
}

export function PrinciplesSection() {
  const [isolation, barcode, books] = aboutPrinciples;

  return (
    <>
      <EntityIsolation principle={isolation} />
      <BarcodeTruth principle={barcode} />
      <BooksMatchOps principle={books} />
    </>
  );
}


