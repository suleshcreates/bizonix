"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import {
  aboutValues,
  depthLayers,
  partnerJourney,
  type AboutValue,
} from "@/lib/content/about/about-page";
import { useStageProgress } from "../about-motion";
import styles from "@/components/pages/about/about.module.css";

/* ---------------------------------------------------------------------------
 * Shared chrome
 *
 * Every value owns a full viewport and its own visual language; only the
 * type block is shared, so the three panels read as one family without the
 * visuals repeating.
 * ------------------------------------------------------------------------ */

function ValueCopy({
  value,
  chapter,
  note,
}: {
  value: AboutValue;
  chapter?: string;
  /** Trailing aside, used where the visual has no room to carry it. */
  note?: string;
}) {
  return (
    <div className={styles.about__values__copy}>
      {chapter && (
        <p className={styles.about__values__chapter}>
          <span aria-hidden="true" />
          {chapter}
        </p>
      )}
      <p className={styles.about__values__marker}>
        <b>{value.number}</b>
        <i aria-hidden="true" />
        {value.label}
      </p>
      <h3 className={styles.about__values__headline}>
        {value.headlinePrimary}
        <em>{value.headlineAccent}</em>
      </h3>
      <p className={styles.about__values__body}>{value.body}</p>
      <p className={styles.about__values__caption}>{value.caption}</p>
      {note && <p className={styles.about__values__note}>{note}</p>}
    </div>
  );
}

function ValueStage({
  value,
  tone,
  children,
  stageRef,
  /**
   * The atmospheric photo wash behind the frame. Reliability turns it off and
   * shows its photograph as a contained card instead, so the picture is a
   * subject rather than texture.
   */
  wash = true,
  className,
}: {
  value: AboutValue;
  tone: string;
  children: ReactNode;
  stageRef: React.Ref<HTMLElement>;
  wash?: boolean;
  className?: string;
}) {
  return (
    <section
      ref={stageRef}
      id={value.id}
      className={`${styles.about__values__stage} ${tone}${className ? ` ${className}` : ""}`}
      aria-labelledby={`${value.id}-title`}
    >
      <div className={styles.about__values__frame}>
        {wash && (
          <div className={styles.about__values__plate} aria-hidden="true">
            <Image
              src={value.image}
              alt=""
              fill
              unoptimized
              sizes="(max-width: 940px) 100vw, 55vw"
              className={styles.about__values__plateImage}
              style={{ objectPosition: value.objectPosition }}
            />
          </div>
        )}
        <h2 id={`${value.id}-title`} className={styles.about__values__srOnly}>
          {value.label}
        </h2>
        {children}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * 01 Reliability — the consistency field
 *
 * 84 cells, one per operating slot, filling in an unbroken sweep as the panel
 * is scrubbed. Reliability is hard to illustrate with a single hero moment;
 * it looks like this instead — the same result, cell after cell, no gaps.
 * ------------------------------------------------------------------------ */

const CELL_COUNT = 84;
const cells = Array.from({ length: CELL_COUNT }, (_, index) => index);

function ReliabilityValue({ value }: { value: AboutValue }) {
  const { ref } = useStageProgress<HTMLElement>();

  return (
    <ValueStage
      value={value}
      tone={styles.about__values__toneNavy}
      className={styles.about__values__stageShowcase}
      stageRef={ref}
      wash={false}
    >
      <ValueCopy
        value={value}
        chapter="What we believe"
        note="No exception days. No reconciliation weekend. The same behaviour under season peak as on a quiet Tuesday."
      />

      <div className={styles.about__values__showcase}>
        <figure className={styles.about__values__photo}>
          <span className={styles.about__values__photoRule} aria-hidden="true" />
          <Image
            src={value.image}
            alt={value.imageAlt}
            fill
            unoptimized
            sizes="(max-width: 940px) 100vw, 50vw"
            className={styles.about__values__photoImage}
            style={{ objectPosition: value.objectPosition }}
          />
          <span className={styles.about__values__photoScrim} aria-hidden="true" />
        </figure>

        {/* The consistency read-out floats over the lower third of the card. */}
        <div className={styles.about__values__field}>
          <div className={styles.about__values__fieldHead}>
            <span>Continuity</span>
            <span className={styles.about__values__fieldMeta}>Uninterrupted sweep</span>
          </div>
          <div
            className={styles.about__values__grid}
            style={{ "--n": CELL_COUNT } as React.CSSProperties}
            aria-hidden="true"
          >
            {cells.map((index) => (
              <i key={index} style={{ "--i": index } as React.CSSProperties} />
            ))}
          </div>
        </div>
      </div>
    </ValueStage>
  );
}

/* ---------------------------------------------------------------------------
 * 02 Operational depth — the cross-section
 *
 * The stack of layers under any screen, pulled apart in 3D as the panel is
 * scrubbed. Labels ride the same offset as the plane they name, so the
 * annotation stays attached while the model opens up.
 * ------------------------------------------------------------------------ */

function LayerArt({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 200 140" className={styles.about__values__layerArt}>
        <rect x="16" y="18" width="168" height="16" rx="5" />
        <rect x="16" y="46" width="96" height="10" rx="4" />
        <rect x="16" y="66" width="126" height="10" rx="4" />
        <rect x="16" y="96" width="62" height="24" rx="9" className={styles.about__values__artAccent} />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 200 140" className={styles.about__values__layerArt}>
        <path d="M30 70h44M100 70h44" className={styles.about__values__artLine} />
        <circle cx="24" cy="70" r="11" />
        <circle cx="88" cy="70" r="11" className={styles.about__values__artAccent} />
        <circle cx="156" cy="70" r="11" />
        <path d="M88 59V34h50" className={styles.about__values__artLine} />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg viewBox="0 0 200 140" className={styles.about__values__layerArt}>
        <rect x="20" y="42" width="46" height="46" rx="8" />
        <rect x="78" y="42" width="46" height="46" rx="8" className={styles.about__values__artAccent} />
        <rect x="136" y="42" width="46" height="46" rx="8" />
        <path d="M66 65h12M124 65h12" className={styles.about__values__artLine} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 140" className={styles.about__values__layerArt}>
      <circle cx="52" cy="58" r="13" />
      <circle cx="100" cy="58" r="13" className={styles.about__values__artAccent} />
      <circle cx="148" cy="58" r="13" />
      <rect x="34" y="84" width="36" height="8" rx="4" />
      <rect x="82" y="84" width="36" height="8" rx="4" />
      <rect x="130" y="84" width="36" height="8" rx="4" />
    </svg>
  );
}

function DepthValue({ value }: { value: AboutValue }) {
  const { ref } = useStageProgress<HTMLElement>();

  return (
    <ValueStage value={value} tone={styles.about__values__toneLight} stageRef={ref}>
      <ValueCopy value={value} />
      <div className={styles.about__values__scene}>
        <div className={styles.about__values__stack} aria-hidden="true">
          {depthLayers.map((layer, index) => (
            <div
              key={layer.label}
              className={styles.about__values__plane}
              style={{ "--i": depthLayers.length - 1 - index } as React.CSSProperties}
            >
              <LayerArt index={index} />
            </div>
          ))}
        </div>

        <ul className={styles.about__values__layerLabels}>
          {depthLayers.map((layer, index) => (
            <li
              key={layer.label}
              style={{ "--i": depthLayers.length - 1 - index } as React.CSSProperties}
            >
              <span className={styles.about__values__layerRule} aria-hidden="true" />
              <b>{layer.label}</b>
              <em>{layer.note}</em>
            </li>
          ))}
        </ul>
      </div>
    </ValueStage>
  );
}

/* ---------------------------------------------------------------------------
 * 03 Partner success — the rail that keeps going
 *
 * A delivery timeline where the interesting half sits *after* go-live. The
 * marker for where most engagements stop is drawn deliberately mid-rail.
 * ------------------------------------------------------------------------ */

function PartnerValue({ value }: { value: AboutValue }) {
  const { ref } = useStageProgress<HTMLElement>();

  return (
    <ValueStage value={value} tone={styles.about__values__toneSoft} stageRef={ref}>
      <ValueCopy value={value} />
      <div className={styles.about__values__journey}>
        <div className={styles.about__values__journeyHead}>
          <span>The engagement</span>
          <span className={styles.about__values__continues}>
            Still with you
            <ArrowRight size={14} strokeWidth={2.6} aria-hidden="true" />
          </span>
        </div>

        <div
          className={styles.about__values__rail}
          style={{ "--n": partnerJourney.length } as React.CSSProperties}
        >
          <span className={styles.about__values__railTrack} aria-hidden="true">
            <i />
          </span>

          <ol className={styles.about__values__milestones}>
            {partnerJourney.map((milestone, index) => (
              <li
                key={milestone.label}
                className={index > 2 ? styles.about__values__beyond : undefined}
                style={{ "--i": index } as React.CSSProperties}
              >
                <span className={styles.about__values__dot} aria-hidden="true" />
                <b>{milestone.label}</b>
                <em>{milestone.note}</em>
              </li>
            ))}
          </ol>

          <span className={styles.about__values__cutoff} aria-hidden="true">
            <i />
            <b>Most vendors stop here</b>
          </span>
        </div>
      </div>
    </ValueStage>
  );
}

/* ------------------------------------------------------------------------ */

export function ValuesSection() {
  const [reliability, depth, partner] = aboutValues;

  return (
    <>
      <ReliabilityValue value={reliability} />
      <DepthValue value={depth} />
      <PartnerValue value={partner} />
    </>
  );
}


