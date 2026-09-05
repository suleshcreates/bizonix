"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  featureStories,
  type FeatureStory,
} from "@/lib/content/features/feature-stories";
import type { FeatureId } from "@/lib/content/features/features";
import { useReveal } from "./use-reveal";
import styles from "@/components/pages/features/features.module.css";

/** Small information marks share one fixed frame across every mechanism. */
function RecordMark({
  kind,
  marks,
}: {
  kind: FeatureStory["kind"];
  marks: readonly string[];
}) {
  return (
    <div className={styles.mechanism__mark} data-mark={kind}>
      {kind === "barcode" && (
        <svg viewBox="0 0 200 32" preserveAspectRatio="none" aria-hidden="true">
          {Array.from({ length: 45 }, (_, i) => (
            <rect
              key={i}
              x={i * 4.45}
              width={[1, 2, 1, 3, 2, 1, 2][i % 7]}
              height="32"
            />
          ))}
        </svg>
      )}
      {kind === "movement" && (
        <div className={styles.mechanism__pieces} aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <i key={i} />
          ))}
        </div>
      )}
      {kind === "split" && (
        <svg viewBox="0 0 200 24" preserveAspectRatio="none" aria-hidden="true">
          <path d="M100 0 V8 M100 8 H35 V24 M100 8 H165 V24" />
        </svg>
      )}
      <div className={styles.mechanism__markLabels}>
        {marks.map((mark) => (
          <span key={mark}>{mark}</span>
        ))}
      </div>
    </div>
  );
}

const stages = ["Input", "Action", "System state", "Result"];
const ease = [0.22, 1, 0.36, 1] as const;

/** One composition and motion sequence. All operational content lives in data. */
export function FeatureStorySection({ feature }: { feature: FeatureId }) {
  const data = featureStories[feature];
  const { ref, shown } = useReveal<HTMLElement>();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState(3);
  const [replay, setReplay] = useState(0);
  useEffect(() => {
    if (!shown || reducedMotion) return;
    const timers = [0, 900, 1700, 2500].map((delay, step) =>
      window.setTimeout(() => setPhase(step), delay),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [shown, reducedMotion, replay]);
  const active = reducedMotion ? 3 : phase;
  return (
    <section
      ref={ref}
      className={styles.mechanism__section}
      data-feature-story={feature}
      data-entered={shown}
      aria-labelledby="feature-mechanism-title"
    >
      <div className={styles.mechanism__shell}>
        <header className={styles.mechanism__heading}>
          <div>
            <p className={styles.mechanism__eyebrow}>
              <span>{data.index}</span>
              {data.name} <i /> In motion
            </p>
            <h2 id="feature-mechanism-title">{data.title}</h2>
          </div>
          <p className={styles.mechanism__description}>{data.description}</p>
        </header>
        <div className={styles.mechanism__system} data-phase={active}>
          <div className={styles.mechanism__record}>
            <span>
              <i />
              {data.record}
            </span>
            <span>
              One connected record <span aria-hidden="true">↗</span>
            </span>
          </div>
          <ol className={styles.mechanism__sequence}>
            {data.steps.map((step, index) => (
              <motion.li
                key={step.title}
                className={styles.mechanism__step}
                data-active={active >= index}
                data-current={active === index}
                initial={false}
                animate={
                  shown && !reducedMotion
                    ? { opacity: [0.35, 1], y: [12, 0] }
                    : { opacity: 1, y: 0 }
                }
                transition={{ duration: 0.65, delay: index * 0.12, ease }}
              >
                <div className={styles.mechanism__stepMeta}>
                  <span>0{index + 1}</span>
                  <span>{stages[index]}</span>
                </div>
                <h3>{step.title}</h3>
                <div className={styles.mechanism__value}>
                  <span>{step.label}</span>
                  <strong data-long={step.value.length > 7}>
                    {step.value}
                  </strong>
                </div>
                <RecordMark kind={data.kind} marks={step.marks} />
                <div className={styles.mechanism__track} aria-hidden="true">
                  <span className={styles.mechanism__trackFill} />
                  <span className={styles.mechanism__node}>
                    {index === 3 ? (
                      <Check size={13} strokeWidth={2.4} />
                    ) : (
                      <i />
                    )}
                  </span>
                  <span className={styles.mechanism__signal} />
                </div>
                <p className={styles.mechanism__detail}>{step.detail}</p>
                <span className={styles.mechanism__stamp}>
                  <i />
                  {step.stamp}
                </span>
              </motion.li>
            ))}
          </ol>
          <div className={styles.mechanism__resolution}>
            <span>
              <Check size={16} />
              {data.principle}
            </span>
            <button
              type="button"
              disabled={active !== 3 || reducedMotion}
              onClick={() => {
                setPhase(0);
                setReplay((value) => value + 1);
              }}
              aria-label={`Replay ${data.name} mechanism`}
            >
              <RotateCcw size={13} />
              {reducedMotion
                ? "Motion reduced"
                : active === 3
                  ? "Replay sequence"
                  : "Following the record"}
            </button>
          </div>
        </div>
        <p className={styles.mechanism__footnote}>
          <span>{data.note}</span>
          <span>BIZONIX / OPERATIONAL DETAIL</span>
        </p>
      </div>
    </section>
  );
}
