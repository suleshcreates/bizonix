"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useState } from "react";
import { CORE_SPLIT, journey, type JourneyStep } from "./workflow-data";
import styles from "@/components/pages/home/home.module.css";

/**
 * Handset composition (< 1101px).
 *
 * The desktop map draws the workflow as a system seen from above. A phone
 * column cannot hold that, so the same six steps are recomposed as one
 * continuous story: a single 1px line runs the length of the section, each
 * step is a numbered node on it rather than a card, and the Operating Core
 * is the panel the line visibly passes through between 03 and 04.
 *
 * The desktop accent-per-step palette is intentionally dropped here. Six
 * competing glows read as noise at this size; one blue accent reads as one
 * system.
 */

/** Reveal beats. 0-2 lead in, 3 is the core, and the rest wait it out. */
const STEP_AFTER_CORE = 5;

function FlowStep({
  step,
  index,
  active,
  onActivate,
}: {
  step: JourneyStep;
  index: number;
  active: boolean;
  onActivate: () => void;
}) {
  const Icon = step.icon;

  return (
    <li
      className={styles.platformSpine__flowStep}
      style={{ "--step": index } as CSSProperties}
      data-active={active ? "true" : undefined}
      data-first={index === 0 ? "true" : undefined}
    >
      <button
        type="button"
        className={styles.platformSpine__flowTrigger}
        onClick={onActivate}
        aria-pressed={active}
      >
        <span className={styles.platformSpine__flowRail} aria-hidden="true">
          <span className={styles.platformSpine__flowNumber}>
            {step.number}
          </span>
        </span>

        <span className={styles.platformSpine__flowMain}>
          <span className={styles.platformSpine__flowIcon} aria-hidden="true">
            <Icon size={19} strokeWidth={1.9} />
          </span>
          <span className={styles.platformSpine__flowCopy}>
            <strong className={styles.platformSpine__flowTitle}>
              {step.title}
            </strong>
            <small className={styles.platformSpine__flowBody}>
              {step.body}
            </small>
          </span>
        </span>
      </button>
    </li>
  );
}

/**
 * The system the six steps run through — not a seventh step. It keeps the
 * rail alignment so the line enters and leaves it, but swaps the pale step
 * node for the navy Bizonix mark and carries a panel the steps never get.
 */
function OperatingCore() {
  return (
    <li
      className={styles.platformSpine__flowCore}
      style={{ "--step": CORE_SPLIT } as CSSProperties}
    >
      <span className={styles.platformSpine__flowCoreRail} aria-hidden="true">
        <span className={styles.platformSpine__flowCoreMark}>
          <Image
            src="/images/shared/brand/icon.svg"
            alt=""
            width={22}
            height={22}
          />
        </span>
      </span>

      <div className={styles.platformSpine__flowCorePanel}>
        <span className={styles.platformSpine__flowCoreLabel}>
          Bizonix Operating Core
        </span>
        <strong className={styles.platformSpine__flowCoreTitle}>
          Unified. Connected. Intelligent.
        </strong>
        <small className={styles.platformSpine__flowCoreNote}>
          One flow. Complete control.
        </small>
      </div>
    </li>
  );
}

export function WorkflowFlow() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <ol className={styles.platformSpine__flow}>
      {/* One ambient signal travelling the whole line — the only loop here. */}
      <span className={styles.platformSpine__flowSignal} aria-hidden="true" />

      {journey.slice(0, CORE_SPLIT).map((step, index) => (
        <FlowStep
          key={step.number}
          step={step}
          index={index}
          active={active === step.number}
          onActivate={() =>
            setActive((current) =>
              current === step.number ? null : step.number,
            )
          }
        />
      ))}

      <OperatingCore />

      {journey.slice(CORE_SPLIT).map((step, index) => (
        <FlowStep
          key={step.number}
          step={step}
          index={STEP_AFTER_CORE + index}
          active={active === step.number}
          onActivate={() =>
            setActive((current) =>
              current === step.number ? null : step.number,
            )
          }
        />
      ))}
    </ol>
  );
}
