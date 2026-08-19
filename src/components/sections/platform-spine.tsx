"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  Barcode,
  Calculator,
  Eye,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import styles from "./platform-spine.module.css";

const journey = [
  {
    number: "01",
    title: "Purchase / GRN",
    body: "Goods received from suppliers and recorded as GRN.",
    icon: ShoppingCart,
    color: "#2f6bff",
    x: "22%",
    y: "47%",
    lx: "-118px",
    ly: "-160px",
  },
  {
    number: "02",
    title: "Stock Transfer",
    body: "Move stock between locations and warehouses efficiently.",
    icon: Truck,
    color: "#22bd73",
    x: "45%",
    y: "31%",
    lx: "-170px",
    ly: "-145px",
  },
  {
    number: "03",
    title: "Barcode",
    body: "Generate and scan barcodes for accurate tracking and traceability.",
    icon: Barcode,
    color: "#9847ee",
    x: "69%",
    y: "35%",
    lx: "-92px",
    ly: "-155px",
  },
  {
    number: "04",
    title: "POS / Wholesale",
    body: "Sell via POS or manage wholesale transactions seamlessly.",
    icon: Calculator,
    color: "#178ce2",
    x: "86%",
    y: "62%",
    lx: "34px",
    ly: "-120px",
  },
  {
    number: "05",
    title: "Returns",
    body: "Handle product returns and reverse flow smoothly.",
    icon: RotateCcw,
    color: "#1dc5b9",
    x: "68%",
    y: "83%",
    lx: "84px",
    ly: "45px",
  },
  {
    number: "06",
    title: "Accounting",
    body: "All transactions flow into accounting for real-time reconciliation.",
    icon: Calculator,
    color: "#ff922b",
    x: "43%",
    y: "83%",
    lx: "-200px",
    ly: "4px",
  },
] as const;

const principles = [
  {
    title: "Same Piece Identity",
    body: "Track the same item across every step",
    icon: ShieldCheck,
    color: "#2f6bff",
  },
  {
    title: "Entity-Aware Movement",
    body: "Every movement is linked to the right entity",
    icon: Eye,
    color: "#25bf82",
  },
  {
    title: "Nothing is Re-entered",
    body: "Data flows automatically without duplicate entry",
    icon: LockKeyhole,
    color: "#9a50ef",
  },
  {
    title: "Real-time Visibility",
    body: "Complete transparency at every step",
    icon: ArrowUpRight,
    color: "#f59a35",
  },
] as const;

export function PlatformSpine() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveStep((current) => (current + 1) % journey.length),
      2400,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className={styles.section} aria-labelledby="operating-spine-title">
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={styles.shell}>
        <header className={styles.heading}>
          <div>
            <h2 id="operating-spine-title">Operating Content Workflow</h2>
            <p>End-to-end journey of your content &amp; inventory flow</p>
            <span className={styles.headingRule} aria-hidden="true" />
          </div>
          <div className={styles.flowSummary}>
            <span className={styles.summaryIcon}>
              <ArrowUpRight size={24} />
            </span>
            <span>
              <strong>Complete Flow</strong>
              <small>
                6 Key Steps <i /> One Seamless Journey
              </small>
            </span>
          </div>
        </header>

        <div className={styles.workflowStage}>
          <svg
            className={styles.flowMap}
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
            <g className={styles.ribbonGlow}>
              <path
                stroke="url(#spine-segment-1)"
                d="M317 263 C405 188 552 132 648 174"
              />
              <path
                stroke="url(#spine-segment-2)"
                d="M648 174 C760 222 850 160 994 196"
              />
              <path
                stroke="url(#spine-segment-3)"
                d="M994 196 C1110 221 1200 282 1238 347"
              />
              <path
                stroke="url(#spine-segment-4)"
                d="M1238 347 C1262 412 1138 422 979 465"
              />
              <path
                stroke="url(#spine-segment-5)"
                d="M979 465 C850 428 760 510 620 465"
              />
            </g>
            <g className={styles.ribbonSegments}>
              <path
                pathLength="1"
                stroke="url(#spine-segment-1)"
                d="M317 263 C405 188 552 132 648 174"
              />
              <path
                pathLength="1"
                stroke="url(#spine-segment-2)"
                d="M648 174 C760 222 850 160 994 196"
              />
              <path
                pathLength="1"
                stroke="url(#spine-segment-3)"
                d="M994 196 C1110 221 1200 282 1238 347"
              />
              <path
                pathLength="1"
                stroke="url(#spine-segment-4)"
                d="M1238 347 C1262 412 1138 422 979 465"
              />
              <path
                pathLength="1"
                stroke="url(#spine-segment-5)"
                d="M979 465 C850 428 760 510 620 465"
              />
            </g>
            <path
              className={styles.pathHighlight}
              d="M317 256 C405 181 552 125 648 167 C760 215 850 153 994 189 C1110 214 1200 275 1238 340 C1262 405 1138 415 979 458 C850 421 760 503 620 458"
            />
            <path
              className={styles.orbitPath}
              d="M490 330 C490 260 592 220 720 220 C848 220 950 260 950 330 C950 400 848 440 720 440 C592 440 490 400 490 330Z"
            />
            <circle className={styles.orbitDot} cx="490" cy="330" r="4" />
            <circle className={styles.orbitDot} cx="720" cy="220" r="4" />
            <circle className={styles.orbitDot} cx="950" cy="330" r="4" />
            <circle className={styles.orbitDot} cx="720" cy="440" r="4" />
          </svg>

          <div className={styles.supplier}>
            <span className={styles.supplierMark} aria-hidden="true">
              <svg viewBox="0 0 48 48" role="presentation">
                <path d="M7 40V20h8v7l9-6v6l10-6v19H7Z" />
                <path d="M10 20V8h6v12M23 23V11h6v12" />
                <path
                  className={styles.supplierWindows}
                  d="M12 32h4v4h-4zM20 32h4v4h-4zM28 32h4v4h-4z"
                />
              </svg>
            </span>
            <strong>Suppliers</strong>
            <small>Source of Goods</small>
          </div>

          <div className={styles.core}>
            <span className={styles.coreRing} />
            <span className={styles.coreBase} />
            <span className={styles.coreDisc}>
              <Image src="/brand/icon.svg" alt="" width={76} height={76} />
            </span>
            <p>
              <strong>Unified. Connected. Intelligent.</strong>
              <span>One Flow. Complete Control.</span>
            </p>
          </div>

          {journey.map((step, index) => {
            const Icon = step.icon;
            const vars = {
              "--step-x": step.x,
              "--step-y": step.y,
              "--label-x": step.lx,
              "--label-y": step.ly,
              "--step-color": step.color,
              "--mobile-order": index < 3 ? index + 1 : index + 2,
            } as CSSProperties;
            return (
              <button
                type="button"
                key={step.number}
                style={vars}
                className={`${styles.step} ${activeStep === index ? styles.active : ""}`}
                onMouseEnter={() => setActiveStep(index)}
                onFocus={() => setActiveStep(index)}
                onClick={() => setActiveStep(index)}
                aria-pressed={activeStep === index}
              >
                <span className={styles.stepNode}>
                  <Icon size={34} strokeWidth={1.8} />
                </span>
                <span className={styles.stepLabel}>
                  <b>{step.number}</b>
                  <strong>{step.title}</strong>
                  <small>{step.body}</small>
                  <i />
                </span>
              </button>
            );
          })}
        </div>

        <footer className={styles.principles}>
          {principles.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                style={{ "--principle-color": item.color } as CSSProperties}
              >
                <span>
                  <Icon size={27} />
                </span>
                <p>
                  <strong>{item.title}</strong>
                  <small>{item.body}</small>
                </p>
              </div>
            );
          })}
        </footer>
      </div>
    </section>
  );
}
