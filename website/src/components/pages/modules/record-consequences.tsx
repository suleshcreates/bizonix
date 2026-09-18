"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  consequenceScenarios,
  SCENARIO_DWELL,
} from "@/lib/content/modules/modules-deck";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * The closing argument of the catalogue: nine modules are not nine products,
 * they are nine views of one record.
 *
 * A single operator action sits at the top of the stage and three lanes below
 * it fill in — inventory, books, network — with the entries the platform
 * writes on its own. The stage is keyed on the scenario id, so switching
 * scenarios remounts it and every entrance animation replays from frame one
 * without a single piece of imperative timing.
 */
export function RecordConsequences() {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const scenario = consequenceScenarios[index];
  const ActionIcon = scenario.icon;
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (held || !inView) return;
    const timer = window.setTimeout(
      () => setIndex((current) => (current + 1) % consequenceScenarios.length),
      SCENARIO_DWELL,
    );
    return () => window.clearTimeout(timer);
  }, [held, inView, index]);

  const running = inView && !held;

  return (
    <section
      ref={sectionRef}
      className={styles.recordConsequences__section}
      aria-labelledby="consequences-title"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
      style={
        {
          "--accent": scenario.accent,
          "--dwell": `${SCENARIO_DWELL}ms`,
        } as CSSProperties
      }
    >
      <span className={styles.recordConsequences__aurora} aria-hidden="true" />
      <span className={styles.recordConsequences__mesh} aria-hidden="true" />

      <div className={styles.recordConsequences__shell}>
        <header className={styles.recordConsequences__intro}>
          <p className={styles.recordConsequences__eyebrow}>
            <span className={styles.recordConsequences__eyebrowDot} aria-hidden="true" />
            Why nine modules still behave like one
          </p>
          <h2 id="consequences-title">
            One action. Every record that should follow.
          </h2>
          <p className={styles.recordConsequences__lede}>
            In a stitched-together stack, each of these writes is somebody&apos;s
            job at the end of the month. In Bizonix they are the same
            transaction, seen from three sides.
          </p>
        </header>

        <div className={styles.recordConsequences__layout}>
          <div
            className={styles.recordConsequences__picker}
            role="tablist"
            aria-label="Operating scenarios"
          >
            {consequenceScenarios.map((item, itemIndex) => {
              const Icon = item.icon;
              const isActive = itemIndex === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`scenario-tab-${item.id}`}
                  aria-selected={isActive}
                  aria-controls={`scenario-panel-${item.id}`}
                  tabIndex={isActive ? 0 : -1}
                  className={styles.recordConsequences__pick}
                  onClick={() => setIndex(itemIndex)}
                  style={{ "--accent": item.accent } as CSSProperties}
                >
                  <span className={styles.recordConsequences__pickIcon} aria-hidden="true">
                    <Icon size={17} strokeWidth={1.9} />
                  </span>
                  <span className={styles.recordConsequences__pickText}>
                    <strong>{item.action}</strong>
                    <small>{item.where}</small>
                  </span>
                  <span className={styles.recordConsequences__pickTrack} aria-hidden="true">
                    <span
                      className={styles.recordConsequences__pickProgress}
                      data-running={isActive && running}
                    />
                  </span>
                </button>
              );
            })}

            <p className={styles.recordConsequences__closing}>
              Nothing is re-entered. Nothing waits for the books to catch up.
            </p>
            <Link className={styles.recordConsequences__closingLink} href="/product">
              See the platform model
              <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
            </Link>
          </div>

          <div
            key={scenario.id}
            className={styles.recordConsequences__stage}
            role="tabpanel"
            id={`scenario-panel-${scenario.id}`}
            aria-labelledby={`scenario-tab-${scenario.id}`}
          >
            <div className={styles.recordConsequences__trigger}>
              <span className={styles.recordConsequences__triggerIcon} aria-hidden="true">
                <ActionIcon size={19} strokeWidth={1.9} />
              </span>
              <div>
                <p className={styles.recordConsequences__triggerAction}>{scenario.action}</p>
                <p className={styles.recordConsequences__triggerWhere}>{scenario.where}</p>
              </div>
              <p className={styles.recordConsequences__triggerDetail}>{scenario.detail}</p>
            </div>

            <svg
              className={styles.recordConsequences__wires}
              viewBox="0 0 900 86"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {[
                "M450 0C450 44 150 36 150 86",
                "M450 0L450 86",
                "M450 0C450 44 750 36 750 86",
              ].map((d, wire) => (
                <g key={d}>
                  <path className={styles.recordConsequences__wireBase} d={d} />
                  <path
                    className={styles.recordConsequences__wirePulse}
                    d={d}
                    style={{ "--w": wire } as CSSProperties}
                  />
                </g>
              ))}
            </svg>

            <div className={styles.recordConsequences__lanes}>
              {scenario.lanes.map((lane, laneIndex) => (
                <article
                  key={lane.id}
                  className={styles.recordConsequences__lane}
                  style={{ "--l": laneIndex } as CSSProperties}
                >
                  <header className={styles.recordConsequences__laneHead}>
                    <span className={styles.recordConsequences__laneLabel}>{lane.label}</span>
                    <span className={styles.recordConsequences__laneModule}>{lane.module}</span>
                  </header>
                  <ul className={styles.recordConsequences__entries}>
                    {lane.entries.map((entry, entryIndex) => (
                      <li
                        key={entry.key + entry.value}
                        style={{ "--e": entryIndex } as CSSProperties}
                      >
                        <span className={styles.recordConsequences__entryKey}>{entry.key}</span>
                        <span className={styles.recordConsequences__entryValue}>{entry.value}</span>
                      </li>
                    ))}
                  </ul>
                  <span className={styles.recordConsequences__laneFlash} aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
