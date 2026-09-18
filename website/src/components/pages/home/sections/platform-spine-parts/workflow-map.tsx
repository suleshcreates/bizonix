"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { journey } from "./workflow-data";
import styles from "@/components/pages/home/home.module.css";

/**
 * Desktop composition (>= 1101px): the approved curved flow map, its supplier
 * origin, the 3D operating core and the six accent-lit nodes.
 *
 * Frozen. The per-step canvas coordinates and accent colours live here rather
 * than in the shared data because they belong to this canvas alone — the
 * handset renderer deliberately uses neither.
 */
const layout = [
  { color: "#2f6bff", x: "22%", y: "47%", lx: "-118px", ly: "-160px" },
  { color: "#22bd73", x: "45%", y: "31%", lx: "-170px", ly: "-145px" },
  { color: "#9847ee", x: "69%", y: "35%", lx: "-92px", ly: "-155px" },
  { color: "#178ce2", x: "86%", y: "62%", lx: "34px", ly: "-120px" },
  { color: "#1dc5b9", x: "68%", y: "83%", lx: "84px", ly: "45px" },
  { color: "#ff922b", x: "43%", y: "83%", lx: "-200px", ly: "4px" },
] as const;

export function WorkflowMap() {
  const [activeStep, setActiveStep] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const pathHighlightRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveStep((current) => (current + 1) % journey.length),
      2400,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const section = stageRef.current?.closest("section");
    if (!section) return;

    const segmentPaths = section.querySelectorAll<SVGPathElement>(
      "[data-flow-segment]",
    );
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;

    const updateProgress = () => {
      animationFrame = 0;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const revealStart = viewportHeight * 0.88;
      const revealEnd = (viewportHeight - rect.height) / 2;
      const rawProgress =
        (revealStart - rect.top) / Math.max(1, revealStart - revealEnd);
      const progress = reducedMotion.matches
        ? 1
        : Math.min(1, Math.max(0, rawProgress));

      segmentPaths.forEach((path) => {
        const segmentIndex = Number(path.dataset.flowSegment ?? 0);
        const segmentProgress = Math.min(
          1,
          Math.max(0, progress * 5 - segmentIndex),
        );
        path.style.strokeDashoffset = String(1 - segmentProgress);
      });

      if (pathHighlightRef.current) {
        pathHighlightRef.current.style.strokeDashoffset = String(1 - progress);
      }
    };

    const scheduleUpdate = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    reducedMotion.addEventListener("change", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      reducedMotion.removeEventListener("change", scheduleUpdate);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
      <div ref={stageRef} className={styles.platformSpine__workflowStage}>
        <svg
          className={styles.platformSpine__flowMap}
          viewBox="0 0 1440 560"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="spine-segment-1"
              gradientUnits="userSpaceOnUse"
              x1="317"
              y1="263"
              x2="648"
              y2="174"
            >
              <stop offset="0" stopColor="#1f5cff" />
              <stop offset=".62" stopColor="#177dff" />
              <stop offset="1" stopColor="#20c978" />
            </linearGradient>
            <linearGradient
              id="spine-segment-2"
              gradientUnits="userSpaceOnUse"
              x1="648"
              y1="174"
              x2="994"
              y2="196"
            >
              <stop offset="0" stopColor="#20c978" />
              <stop offset=".46" stopColor="#2ad3a5" />
              <stop offset="1" stopColor="#a23df2" />
            </linearGradient>
            <linearGradient
              id="spine-segment-3"
              gradientUnits="userSpaceOnUse"
              x1="994"
              y1="196"
              x2="1238"
              y2="347"
            >
              <stop offset="0" stopColor="#a23df2" />
              <stop offset=".48" stopColor="#8a43f5" />
              <stop offset="1" stopColor="#138cf0" />
            </linearGradient>
            <linearGradient
              id="spine-segment-4"
              gradientUnits="userSpaceOnUse"
              x1="1238"
              y1="347"
              x2="979"
              y2="465"
            >
              <stop offset="0" stopColor="#138cf0" />
              <stop offset=".56" stopColor="#178ff1" />
              <stop offset="1" stopColor="#18cbb4" />
            </linearGradient>
            <linearGradient
              id="spine-segment-5"
              gradientUnits="userSpaceOnUse"
              x1="979"
              y1="465"
              x2="620"
              y2="465"
            >
              <stop offset="0" stopColor="#18cbb4" />
              <stop offset=".52" stopColor="#28d29a" />
              <stop offset="1" stopColor="#ff9226" />
            </linearGradient>
          </defs>
          <g className={styles.platformSpine__ribbonGlow}>
            <path
              pathLength="1"
              data-flow-segment="0"
              stroke="url(#spine-segment-1)"
              d="M317 263 C405 188 552 132 648 174"
            />
            <path
              pathLength="1"
              data-flow-segment="1"
              stroke="url(#spine-segment-2)"
              d="M648 174 C760 222 850 160 994 196"
            />
            <path
              pathLength="1"
              data-flow-segment="2"
              stroke="url(#spine-segment-3)"
              d="M994 196 C1110 221 1200 282 1238 347"
            />
            <path
              pathLength="1"
              data-flow-segment="3"
              stroke="url(#spine-segment-4)"
              d="M1238 347 C1262 412 1138 422 979 465"
            />
            <path
              pathLength="1"
              data-flow-segment="4"
              stroke="url(#spine-segment-5)"
              d="M979 465 C850 428 760 510 620 465"
            />
          </g>
          <g className={styles.platformSpine__ribbonSegments}>
            <path
              pathLength="1"
              data-flow-segment="0"
              stroke="url(#spine-segment-1)"
              d="M317 263 C405 188 552 132 648 174"
            />
            <path
              pathLength="1"
              data-flow-segment="1"
              stroke="url(#spine-segment-2)"
              d="M648 174 C760 222 850 160 994 196"
            />
            <path
              pathLength="1"
              data-flow-segment="2"
              stroke="url(#spine-segment-3)"
              d="M994 196 C1110 221 1200 282 1238 347"
            />
            <path
              pathLength="1"
              data-flow-segment="3"
              stroke="url(#spine-segment-4)"
              d="M1238 347 C1262 412 1138 422 979 465"
            />
            <path
              pathLength="1"
              data-flow-segment="4"
              stroke="url(#spine-segment-5)"
              d="M979 465 C850 428 760 510 620 465"
            />
          </g>
          <path
            ref={pathHighlightRef}
            className={styles.platformSpine__pathHighlight}
            pathLength="1"
            d="M317 256 C405 181 552 125 648 167 C760 215 850 153 994 189 C1110 214 1200 275 1238 340 C1262 405 1138 415 979 458 C850 421 760 503 620 458"
          />
          <path
            className={styles.platformSpine__orbitPath}
            d="M490 330 C490 260 592 220 720 220 C848 220 950 260 950 330 C950 400 848 440 720 440 C592 440 490 400 490 330Z"
          />
          <circle
            className={styles.platformSpine__orbitDot}
            cx="490"
            cy="330"
            r="4"
          />
          <circle
            className={styles.platformSpine__orbitDot}
            cx="720"
            cy="220"
            r="4"
          />
          <circle
            className={styles.platformSpine__orbitDot}
            cx="950"
            cy="330"
            r="4"
          />
          <circle
            className={styles.platformSpine__orbitDot}
            cx="720"
            cy="440"
            r="4"
          />
        </svg>

        <div className={styles.platformSpine__supplier}>
          <span
            className={styles.platformSpine__supplierMark}
            aria-hidden="true"
          >
            <svg viewBox="0 0 48 48" role="presentation">
              <path d="M7 40V20h8v7l9-6v6l10-6v19H7Z" />
              <path d="M10 20V8h6v12M23 23V11h6v12" />
              <path
                className={styles.platformSpine__supplierWindows}
                d="M12 32h4v4h-4zM20 32h4v4h-4zM28 32h4v4h-4z"
              />
            </svg>
          </span>
          <strong>Suppliers</strong>
          <small>Source of Goods</small>
        </div>

        <div className={styles.platformSpine__core}>
          <span className={styles.platformSpine__coreRing} />
          <span className={styles.platformSpine__coreBase} />
          <span className={styles.platformSpine__coreDisc}>
            <Image
              src="/images/shared/brand/icon.svg"
              alt=""
              width={76}
              height={76}
            />
          </span>
          <p>
            <strong>Unified. Connected. Intelligent.</strong>
            <span>One Flow. Complete Control.</span>
          </p>
        </div>

        {journey.map((step, index) => {
          const Icon = step.icon;
          const slot = layout[index];
          const vars = {
            "--step-x": slot.x,
            "--step-y": slot.y,
            "--label-x": slot.lx,
            "--label-y": slot.ly,
            "--step-color": slot.color,
          } as CSSProperties;
          return (
            <button
              type="button"
              key={step.number}
              style={vars}
              className={`${styles.platformSpine__step} ${activeStep === index ? styles.platformSpine__active : ""}`}
              onMouseEnter={() => setActiveStep(index)}
              onFocus={() => setActiveStep(index)}
              onClick={() => setActiveStep(index)}
              aria-pressed={activeStep === index}
            >
              <span className={styles.platformSpine__stepNode}>
                <Icon size={34} strokeWidth={1.8} />
              </span>
              <span className={styles.platformSpine__stepLabel}>
                <b>{step.number}</b>
                <strong>{step.title}</strong>
                <small>{step.body}</small>
                <i />
              </span>
            </button>
          );
        })}
      </div>
  );
}
