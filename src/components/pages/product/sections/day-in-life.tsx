"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  Boxes,
  ShoppingCart,
  ArrowLeftRight,
  BookCheck,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  dayMoments,
  type DayMomentId,
} from "@/lib/content/product/day-in-system-moments";
import styles from "@/components/pages/product/product.module.css";

const momentIcon: Record<DayMomentId, LucideIcon> = {
  "morning-stock": Boxes,
  "counter-sale": ShoppingCart,
  "franchise-transfer": ArrowLeftRight,
  "month-end-books": BookCheck,
};

export function DayInLife() {
  const [activeId, setActiveId] = useState<DayMomentId>("morning-stock");
  const [isHovered, setIsHovered] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imagesReady, setImagesReady] = useState(false);
  const reduceMotion = useReducedMotion();

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const activeIndex = dayMoments.findIndex((m) => m.id === activeId);
  const activeMoment = dayMoments[activeIndex] ?? dayMoments[0];

  // Preload all 4 moment photographs on mount
  useEffect(() => {
    let loadedCount = 0;
    const total = dayMoments.length;
    dayMoments.forEach((moment) => {
      const img = new window.Image();
      const onDone = () => {
        loadedCount += 1;
        if (loadedCount >= total) {
          setImagesReady(true);
        }
      };
      img.onload = onDone;
      img.onerror = onDone;
      img.src = moment.image;
      if (img.complete) {
        onDone();
      }
    });
    const fallback = setTimeout(() => setImagesReady(true), 400);
    return () => clearTimeout(fallback);
  }, []);

  // Trigger a 5-second manual interaction pause
  const triggerManualPause = useCallback(() => {
    setIsManuallyPaused(true);
    setProgress(0);
    clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsManuallyPaused(false);
    }, 5000);
  }, []);

  // Select a moment (manual click or programmatic autoplay)
  const selectMoment = useCallback(
    (id: DayMomentId, isManual = false) => {
      setActiveId(id);
      setProgress(0);
      if (isManual) {
        triggerManualPause();
      }
    },
    [triggerManualPause]
  );

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let nextIndex = index;
      if (e.key === "ArrowRight") {
        nextIndex = (index + 1) % dayMoments.length;
      } else if (e.key === "ArrowLeft") {
        nextIndex = (index - 1 + dayMoments.length) % dayMoments.length;
      } else if (e.key === "Home") {
        nextIndex = 0;
      } else if (e.key === "End") {
        nextIndex = dayMoments.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      const nextMoment = dayMoments[nextIndex];
      if (nextMoment) {
        selectMoment(nextMoment.id, true);
        tabRefs.current[nextIndex]?.focus();
      }
    },
    [selectMoment]
  );

  // 2-second autoplay loop with smooth progress tracking
  useEffect(() => {
    if (reduceMotion || !imagesReady || isHovered || isManuallyPaused) {
      return;
    }

    const intervalMs = 40;
    const progressIncrement = (intervalMs / 2000) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + progressIncrement >= 100) {
          setActiveId((curr) => {
            const currIdx = dayMoments.findIndex((m) => m.id === curr);
            const nextIdx = (currIdx + 1) % dayMoments.length;
            return dayMoments[nextIdx].id;
          });
          return 0;
        }
        return prev + progressIncrement;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [reduceMotion, imagesReady, isHovered, isManuallyPaused]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  return (
    <section className={styles.dayInSystem__section} aria-labelledby="day-in-system-title">
      <div className={styles.dayInSystem__shell}>
        {/* ================= Header ================= */}
        <header className={styles.dayInSystem__header}>
          <div className={styles.dayInSystem__headerLeft}>
            <span className={styles.dayInSystem__eyebrow}>A Day In The System</span>
            <h2 id="day-in-system-title" className={styles.dayInSystem__title}>
              <span className={styles.dayInSystem__titleLine}>
                <span className={styles.dayInSystem__accentBlue}>Opening stock</span>
              </span>{" "}
              <span className={styles.dayInSystem__titleLine}>
                to <span className={styles.dayInSystem__accentTeal}>closing books.</span>
              </span>
            </h2>
          </div>
          <div className={styles.dayInSystem__headerRight}>
            <p className={styles.dayInSystem__description}>
              Every day follows a connected flow across inventory, retail,
              network, and finance — all on the same operating record.
            </p>
          </div>
        </header>
        {/* ================= Timeline Navigation ================= */}
        <nav
          className={styles.dayInSystem__timelineWrap}
          aria-label="Day in the system timeline"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={styles.dayInSystem__timelineTrack} role="tablist">
            <svg
              className={styles.dayInSystem__timelineSvg}
              viewBox="0 0 1000 4"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <line
                x1="0"
                y1="2"
                x2="1000"
                y2="2"
                className={styles.dayInSystem__timelineSvgLine}
              />
              <line
                x1="0"
                y1="2"
                x2={`${(activeIndex / (dayMoments.length - 1)) * 1000}`}
                y2="2"
                className={styles.dayInSystem__timelineSvgActive}
              />
            </svg>

            {dayMoments.map((moment, index) => {
              const Icon = momentIcon[moment.id];
              const isSelected = moment.id === activeId;
              const circumference = 2 * Math.PI * 22; // ~138.2

              return (
                <button
                  key={moment.id}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  role="tab"
                  id={`tab-${moment.id}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${moment.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  className={styles.dayInSystem__timelineTab}
                  data-accent={moment.accent}
                  onClick={() => selectMoment(moment.id, true)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                >
                  <div className={styles.dayInSystem__nodeWrap}>
                    {isSelected && !reduceMotion && (
                      <svg
                        className={styles.dayInSystem__nodeProgressRing}
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <circle
                          cx="24"
                          cy="24"
                          r="22"
                          className={styles.dayInSystem__nodeProgressBg}
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="22"
                          className={styles.dayInSystem__nodeProgressFg}
                          style={{
                            strokeDasharray: circumference,
                            strokeDashoffset:
                              circumference -
                              (circumference *
                                (isHovered || isManuallyPaused
                                  ? 0
                                  : progress)) /
                                100,
                          }}
                        />
                      </svg>
                    )}
                    <span className={styles.dayInSystem__node} aria-hidden="true">
                      <Icon size={18} strokeWidth={2.2} />
                    </span>
                  </div>

                  <div className={styles.dayInSystem__tabMeta}>
                    <span className={styles.dayInSystem__tabTime}>{moment.time}</span>
                    <span className={styles.dayInSystem__tabArea}>{moment.area}</span>
                    <span className={styles.dayInSystem__tabTitle}>{moment.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* ================= Selected Moment Panel ================= */}
        <div
          role="tabpanel"
          id={`panel-${activeMoment.id}`}
          aria-labelledby={`tab-${activeMoment.id}`}
          className={styles.dayInSystem__panel}
        >
          {/* Left: Large Photograph with Overlay */}
          <div className={styles.dayInSystem__photoArea}>
            {dayMoments.map((moment) => (
              <div
                key={moment.id}
                className={styles.dayInSystem__photoImageWrap}
                data-active={moment.id === activeId ? "true" : "false"}
                aria-hidden={moment.id !== activeId}
              >
                <Image
                  src={moment.image}
                  alt={moment.alt}
                  fill
                 
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  priority
                />
                <div className={styles.dayInSystem__photoGradient} aria-hidden="true" />
              </div>
            ))}

            <div className={styles.dayInSystem__photoOverlay}>
              <span className={styles.dayInSystem__overlayTag}>
                {activeMoment.time} AM · {activeMoment.area}
              </span>
              <h3 className={styles.dayInSystem__overlayTitle}>{activeMoment.title}</h3>
              <p className={styles.dayInSystem__overlayDesc}>{activeMoment.description}</p>
            </div>
          </div>

          {/* Right: Operational Content Workspace */}
          <div
            key={activeMoment.id}
            className={`${styles.dayInSystem__contentArea} ${styles.dayInSystem__contentTransition}`}
            data-accent={activeMoment.accent}
          >
            <div>
              {/* Header */}
              <div className={styles.dayInSystem__contentHeader}>
                <span className={styles.dayInSystem__contextLine}>
                  {activeMoment.time} · {activeMoment.area}
                </span>
                <h3 className={styles.dayInSystem__momentTitle}>{activeMoment.title}</h3>
                <p className={styles.dayInSystem__momentDesc}>{activeMoment.description}</p>
              </div>

              {/* Metric Band */}
              <div className={styles.dayInSystem__metricBand}>
                {activeMoment.metrics.map((metric) => (
                  <div key={metric.label} className={styles.dayInSystem__metricItem}>
                    <span className={styles.dayInSystem__metricValue}>{metric.value}</span>
                    <span className={styles.dayInSystem__metricLabel}>{metric.label}</span>
                  </div>
                ))}
              </div>

              {/* Action Workflow List */}
              <ol className={styles.dayInSystem__actionList}>
                {activeMoment.actions.map((action) => (
                  <li key={action.index} className={styles.dayInSystem__actionRow}>
                    <span className={styles.dayInSystem__actionIndex}>{action.index}</span>
                    <div className={styles.dayInSystem__actionBody}>
                      <h4 className={styles.dayInSystem__actionTitle}>{action.title}</h4>
                      <p className={styles.dayInSystem__actionDesc}>{action.description}</p>
                    </div>
                    <ChevronRight
                      size={16}
                      className={styles.dayInSystem__actionArrow}
                      aria-hidden="true"
                    />
                  </li>
                ))}
              </ol>
            </div>

            {/* Bottom System State Bar */}
            <footer className={styles.dayInSystem__systemState}>
              <div className={styles.dayInSystem__stateLeft}>
                <span className={styles.dayInSystem__stateTag}>System in sync</span>
                <span className={styles.dayInSystem__stateDesc}>
                  Inventory, Retail, Network and Finance updated in real-time.
                </span>
              </div>
              <div className={styles.dayInSystem__stateRight}>
                <span className={styles.dayInSystem__stateDot} aria-hidden="true" />
                <span>All systems in sync</span>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}
