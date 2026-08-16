"use client";

import {
  ArrowRight,
  Barcode,
  Building2,
  Check,
  Landmark,
  PackageCheck,
  ReceiptIndianRupee,
  RotateCcw,
  ScanLine,
  Store,
  Warehouse,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { spine } from "@/lib/content/home";
import styles from "./platform-spine.module.css";

const purchaseRows = [
  ["PO-1042", "Meridian Textiles", "220", "Received"],
  ["PO-1041", "Om Fabrics Co.", "85", "Received"],
  ["PO-1040", "Vantage Traders", "150", "Pending"],
] as const;

const barcodeRows = [
  ["0000012045", "Classic Oxford", "Central WH"],
  ["0000012046", "Tailored Chino", "Branch 02"],
  ["0000012047", "Essential Polo", "Branch 01"],
] as const;

const returnRows = [
  ["RT-0231", "Linen Overshirt", "Restocked"],
  ["RT-0230", "Tailored Chino", "Restocked"],
] as const;

const accountingRows = [
  ["Sales invoice", "₹1,84,200", "Posted"],
  ["Purchase bill", "₹92,500", "Posted"],
] as const;

const stageMeta = [
  {
    label: "Supplier receipt",
    signal: "220 pieces received",
    icon: PackageCheck,
  },
  { label: "Piece identity", signal: "220 barcodes created", icon: Barcode },
  {
    label: "Entity movement",
    signal: "42 pieces transferred",
    icon: Warehouse,
  },
  {
    label: "Channel sale",
    signal: "₹1.84L recognised",
    icon: ReceiptIndianRupee,
  },
  { label: "Reverse movement", signal: "2 pieces restocked", icon: RotateCcw },
  { label: "Financial truth", signal: "Ledger posted", icon: Landmark },
] as const;

export function PlatformSpine() {
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);

    const section = sectionRef.current;
    if (!section || media.matches) {
      setEntered(true);
      return () => media.removeEventListener("change", updateMotion);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setEntered(true);
        observer.disconnect();
      },
      { threshold: 0.22 },
    );
    observer.observe(section);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", updateMotion);
    };
  }, []);

  useEffect(() => {
    if (!entered || paused || reducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % spine.length);
    }, 1900);
    return () => window.clearInterval(timer);
  }, [entered, paused, reducedMotion]);

  const current = stageMeta[activeStep];

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${entered ? styles.entered : ""}`}
      aria-labelledby="operating-spine-title"
    >
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={styles.shell}>
        <header className={styles.heading}>
          <div>
            <span className="eyebrow">The operating spine</span>
            <h2 id="operating-spine-title" className="h2 mt-5">
              One movement. Six surfaces. Zero lost context.
            </h2>
          </div>
          <p>
            Follow one commercial event from supplier receipt to the books.
            Every handoff keeps its entity, piece, value and tax context
            attached.
          </p>
        </header>

        <div
          className={styles.theatre}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className={styles.theatreBar}>
            <div className={styles.liveLabel}>
              <span />
              Operating context BX-240831
            </div>
            <div className={styles.nowPlaying} aria-live="polite">
              <span>{String(activeStep + 1).padStart(2, "0")} / 06</span>
              <current.icon size={16} aria-hidden="true" />
              <strong>{current.signal}</strong>
            </div>
            <div className={styles.contextKeys} aria-label="Context retained">
              <span>Entity</span>
              <span>Barcode</span>
              <span>Value</span>
              <span>GST</span>
            </div>
          </div>

          <div className={styles.stage}>
            <div className={styles.rail} aria-hidden="true">
              <span className={styles.railBase} />
              <span
                className={styles.railProgress}
                style={{ width: `${(activeStep / (spine.length - 1)) * 100}%` }}
              />
              <span
                className={styles.contextToken}
                style={{ left: `${(activeStep / (spine.length - 1)) * 100}%` }}
              >
                <ScanLine size={18} />
              </span>
            </div>

            <div className={styles.steps}>
              {spine.map(([title, body], index) => {
                const Icon = stageMeta[index].icon;
                const isActive = activeStep === index;
                return (
                  <button
                    type="button"
                    key={title}
                    className={`${styles.step} ${isActive ? styles.active : ""}`}
                    onMouseEnter={() => setActiveStep(index)}
                    onFocus={() => setActiveStep(index)}
                    onClick={() => setActiveStep(index)}
                    aria-pressed={isActive}
                    aria-label={`Stage ${index + 1}: ${title}. ${body}`}
                  >
                    <span className={styles.connector} aria-hidden="true" />
                    <span className={styles.node}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <Icon size={15} />
                    </span>
                    <span className={styles.card}>
                      <span className={styles.cardGlow} aria-hidden="true" />
                      <span className={styles.cardTopline}>
                        <span>{stageMeta[index].label}</span>
                        <span className={styles.cardState}>
                          <i /> Context held
                        </span>
                      </span>
                      <ProductPanel step={index} />
                      <span className={styles.cardCopy}>
                        <strong>{title}</strong>
                        <small>{body}</small>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <footer className={styles.theatreFooter}>
            <span>
              <Check size={14} /> Same piece identity
            </span>
            <span>
              <Check size={14} /> Entity-aware movement
            </span>
            <span>
              <Check size={14} /> Books follow operations
            </span>
            <strong>Nothing is re-entered.</strong>
          </footer>
        </div>
      </div>
    </section>
  );
}

function ProductPanel({ step }: { step: number }) {
  const titles = [
    "Purchase / GRN",
    "Piece barcode register",
    "Stock transfer",
    "POS / Wholesale",
    "Returns register",
    "Accounting entries",
  ];

  return (
    <span className={styles.productPanel}>
      <span className={styles.browserBar}>
        <span className={styles.browserDots}>
          <i />
          <i />
          <i />
        </span>
        <strong>{titles[step]}</strong>
        <small>Bizonix</small>
      </span>
      <span className={styles.panelBody}>
        {step === 0 && (
          <MiniTable
            headers={["PO", "Supplier", "Qty", "Status"]}
            rows={purchaseRows}
            statusColumn={3}
          />
        )}
        {step === 1 && (
          <MiniTable
            headers={["Barcode", "Product", "Location"]}
            rows={barcodeRows}
            monoColumn={0}
          />
        )}
        {step === 2 && <TransferPanel />}
        {step === 3 && <SalesPanel />}
        {step === 4 && (
          <MiniTable
            headers={["Return", "Product", "Status"]}
            rows={returnRows}
            statusColumn={2}
          />
        )}
        {step === 5 && (
          <MiniTable
            headers={["Entry", "Amount", "Status"]}
            rows={accountingRows}
            statusColumn={2}
          />
        )}
      </span>
    </span>
  );
}

function MiniTable({
  headers,
  rows,
  statusColumn,
  monoColumn,
}: {
  headers: readonly string[];
  rows: readonly (readonly string[])[];
  statusColumn?: number;
  monoColumn?: number;
}) {
  return (
    <span className={styles.miniTable} role="table">
      <span className={`${styles.tableRow} ${styles.tableHead}`} role="row">
        {headers.map((header) => (
          <span key={header}>{header}</span>
        ))}
      </span>
      {rows.map((row) => (
        <span className={styles.tableRow} role="row" key={row.join("-")}>
          {row.map((cell, index) => (
            <span
              key={`${cell}-${index}`}
              className={
                index === statusColumn
                  ? styles.status
                  : index === monoColumn
                    ? styles.mono
                    : ""
              }
            >
              {index === statusColumn && cell !== "Pending" && (
                <Check size={9} />
              )}
              {cell}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

function TransferPanel() {
  return (
    <span
      className={styles.transfer}
      role="img"
      aria-label="42 pieces moving from Central Warehouse to Branch Store 2"
    >
      <span>
        <Warehouse size={22} />
        <small>Source</small>
        <strong>Central WH</strong>
      </span>
      <span className={styles.transferArrow}>
        <small>42 pieces</small>
        <i />
        <ArrowRight size={18} />
      </span>
      <span>
        <Store size={22} />
        <small>Destination</small>
        <strong>Branch 02</strong>
      </span>
    </span>
  );
}

function SalesPanel() {
  return (
    <span className={styles.salesPanel}>
      <span className={styles.kpiRow}>
        <span>
          <small>Sales</small>
          <strong>₹1.84L</strong>
        </span>
        <span>
          <small>Orders</small>
          <strong>96</strong>
        </span>
        <span>
          <small>Avg ticket</small>
          <strong>₹1,919</strong>
        </span>
      </span>
      <span className={styles.sparkline}>
        <span>
          <Building2 size={12} /> Sales movement
        </span>
        <svg viewBox="0 0 260 62" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="spine-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2f6bff" stopOpacity=".26" />
              <stop offset="1" stopColor="#2f6bff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M4 51L34 44L62 47L91 31L118 36L148 22L177 27L207 12L232 17L256 6L256 62L4 62Z"
            fill="url(#spine-area)"
          />
          <path
            d="M4 51L34 44L62 47L91 31L118 36L148 22L177 27L207 12L232 17L256 6"
            className={styles.sparkLine}
          />
        </svg>
      </span>
    </span>
  );
}
