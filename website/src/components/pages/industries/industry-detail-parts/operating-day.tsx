"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { IndustryDetail } from "@/lib/content/industries/industry-detail";
import styles from "@/components/pages/industries/industries.module.css";

/*
 * A stepper rather than a tab strip: the spine fills to the selected step so
 * the section reads as a day progressing, and each step names the modules
 * that actually write to the record at that moment.
 */
export function OperatingDay({ steps }: { steps: IndustryDetail["workflow"] }) {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const step = steps[active];
  const progress = steps.length > 1 ? (active / (steps.length - 1)) * 100 : 0;

  return (
    <section className={styles.industryDetailPage__day} aria-labelledby="day-title" data-operating-day>
      <div className={styles.industryDetailPage__shell}>
        <div className={styles.industryDetailPage__dayHead}>
          <p className={styles.industryDetailPage__eyebrow}>
            <span className={styles.industryDetailPage__eyebrowDot} aria-hidden="true" />A day in
            the operation
          </p>
          <h2 id="day-title">
            From the first stock check to the day&apos;s final movement.
          </h2>
        </div>

        <div className={styles.industryDetailPage__dayGrid}>
          <div
            className={styles.industryDetailPage__stepper}
            style={{ "--progress": `${progress}%` } as React.CSSProperties}
            role="tablist"
            aria-label="Steps in the operating day"
            aria-orientation="vertical"
          >
            <span className={styles.industryDetailPage__stepperSpine} aria-hidden="true">
              <span className={styles.industryDetailPage__stepperFill} />
            </span>

            {steps.map((item, index) => (
              <button
                key={item.order}
                ref={(element) => { buttons.current[index] = element; }}
                type="button"
                role="tab"
                id={`step-${item.order}`}
                aria-selected={index === active}
                tabIndex={index === active ? 0 : -1}
                aria-controls="day-panel"
                className={styles.industryDetailPage__step}
                data-state={
                  index === active ? "active" : index < active ? "done" : "todo"
                }
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                onKeyDown={(event) => {
                  const next = event.key === "ArrowDown" ? (index + 1) % steps.length : event.key === "ArrowUp" ? (index + steps.length - 1) % steps.length : event.key === "Home" ? 0 : event.key === "End" ? steps.length - 1 : null;
                  if (next === null) return;
                  event.preventDefault();
                  buttons.current[next]?.focus({ preventScroll: true });
                  setActive(next);
                }}
              >
                <span className={styles.industryDetailPage__stepMarker} aria-hidden="true">
                  {item.order}
                </span>
                <span className={styles.industryDetailPage__stepBody}>
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </span>
              </button>
            ))}
          </div>

          <figure
            className={styles.industryDetailPage__dayPanel}
            id="day-panel"
            role="tabpanel"
            aria-labelledby={`step-${step.order}`}
          >
            {step.image ? (
              <Image
                key={step.image}
                className={styles.industryDetailPage__dayImage}
                src={step.image}
                alt={step.alt || step.title}
                fill
                sizes="(max-width: 1080px) 100vw, 52vw"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-slate-900 text-slate-500 text-xs">
                No preview available
              </div>
            )}
            <span className={styles.industryDetailPage__dayWash} aria-hidden="true" />

            <figcaption className={styles.industryDetailPage__dayCaption}>
              <span className={styles.industryDetailPage__dayCount}>
                {step.order} / {String(steps.length).padStart(2, "0")}
              </span>
              <strong>{step.title}</strong>
              {step.systems?.length ? (
                <span className={styles.industryDetailPage__daySystems}>
                  <span className={styles.industryDetailPage__daySystemsLabel}>Writes to</span>
                  {step.systems.map((system) => (
                    <span key={system} className={styles.industryDetailPage__daySystem}>
                      {system}
                    </span>
                  ))}
                </span>
              ) : null}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
