"use client";

import {
  BarChart4,
  Bell,
  Boxes,
  Check,
  ChevronDown,
  Download,
  IndianRupee,
  LayoutGrid,
  Layers,
  MapPin,
  Receipt,
  Search,
  Settings,
  Settings2,
  ShoppingCart,
  Truck,
} from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import {
  consoleKpis,
  consoleNav,
  consoleRows,
  consoleTabs,
  consoleWorkspace,
} from "@/lib/content/home/home-hero-console-data";
import type { ConsoleRow } from "@/lib/content/home/home-hero-console-data";
import styles from "@/components/pages/home/home.module.css";
import { useCountUp } from "./use-count-up";

/**
 * A marketing recreation of the Bizonix inventory stock list. It renders from
 * local, fictional data only — no API, database, or tenant access.
 */

const railIcons = [Boxes, ShoppingCart, Truck, Receipt, BarChart4];
const kpiIcons = [Boxes, IndianRupee, Layers, MapPin];
const kpiIconTone = {
  blue: "",
  teal: styles.stockConsole__kpiIconTeal,
  navy: styles.stockConsole__kpiIconNavy,
} as const;

/** How often the console highlights another freshly scanned piece. */
const SCAN_INTERVAL = 2600;
const LOW_STOCK = 5;

function Kpi({ index }: { index: number }) {
  const kpi = consoleKpis[index];
  const Icon = kpiIcons[index];
  const value = useCountUp(kpi.value, kpi.decimals, 600 + index * 80);

  return (
    <div className={styles.stockConsole__kpi}>
      <span className={`${styles.stockConsole__kpiIcon} ${kpiIconTone[kpi.tone]}`}>
        <Icon size={16} strokeWidth={2} />
      </span>
      <span className={styles.stockConsole__kpiText}>
        <span className={styles.stockConsole__kpiLabel}>{kpi.label}</span>
        <span className={styles.stockConsole__kpiValue}>
          {kpi.prefix}
          {value}
          {kpi.suffix}
        </span>
        <span className={styles.stockConsole__kpiNote}>{kpi.note}</span>
      </span>
    </div>
  );
}

function Row({
  row,
  index,
  scanned,
}: {
  row: ConsoleRow;
  index: number;
  scanned: boolean;
}) {
  const low = row.qty <= LOW_STOCK;
  const sold = Math.max(0, row.opened - row.qty);
  const remaining = row.opened ? Math.round((row.qty / row.opened) * 100) : 0;

  return (
    <div
      className={`${styles.stockConsole__row} ${styles.stockConsole__bodyRow}`}
      data-scanned={scanned ? "true" : "false"}
      style={{ "--r": index } as CSSProperties}
    >
      <span className={`${styles.stockConsole__cell} ${styles.stockConsole__code}`}>{row.code}</span>

      <span className={`${styles.stockConsole__cell} ${styles.stockConsole__product}`}>
        <strong>{row.name}</strong>
        <span className={styles.stockConsole__variant}>{row.variant}</span>
      </span>

      <span className={styles.stockConsole__qty} title={`${sold} sold of ${row.opened}`}>
        <span className={`${styles.stockConsole__qtyValue} ${low ? styles.stockConsole__qtyValueLow : ""}`}>
          {row.qty}
        </span>
        <span className={styles.stockConsole__qtyBar}>
          <i
            className={`${styles.stockConsole__qtyFill} ${low ? styles.stockConsole__qtyFillLow : ""}`}
            style={{ width: `${Math.min(100, Math.max(6, remaining))}%` }}
          />
        </span>
      </span>

      <span className={`${styles.stockConsole__cell} ${styles.stockConsole__numeric} ${styles.stockConsole__money}`}>
        {row.rate}
      </span>
      <span className={`${styles.stockConsole__cell} ${styles.stockConsole__numeric} ${styles.stockConsole__moneyMuted}`}>
        {row.mrp}
      </span>

      <span className={`${styles.stockConsole__cell} ${styles.stockConsole__barcode}`}>
        <i className={styles.stockConsole__barcodeGlyph} />
        <span className={styles.stockConsole__barcodeNumber}>{row.barcode}</span>
      </span>

      <span className={`${styles.stockConsole__cell} ${styles.stockConsole__location}`}>
        <i
          className={`${styles.stockConsole__locationDot} ${
            row.location.startsWith("Branch") ? styles.stockConsole__locationDotStore : ""
          }`}
        />
        {row.location}
      </span>

      <span className={`${styles.stockConsole__cell} ${styles.stockConsole__updated}`}>{row.updated}</span>
    </div>
  );
}

export function StockConsole() {
  const [scanned, setScanned] = useState(-1);

  // A slow walk down the list: the console looks like it is being worked in
  // rather than posed. Nothing here changes the data, only the highlight.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setScanned((current) => (current + 1) % consoleRows.length);
    }, SCAN_INTERVAL);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={styles.stockConsole__console}>
      <div className={styles.stockConsole__chrome}>
        <div className={styles.stockConsole__brand}>
          <span className={styles.stockConsole__brandMark}>B</span>
          <span className={styles.stockConsole__brandText}>
            <strong>Bizonix</strong>
            <span>{consoleWorkspace.module}</span>
          </span>
        </div>

        <div className={styles.stockConsole__chromeNav}>
          {consoleNav.map((item) => (
            <span
              key={item}
              className={
                item === consoleWorkspace.module
                  ? styles.stockConsole__chromeNavActive
                  : undefined
              }
            >
              {item}
            </span>
          ))}
        </div>

        <div className={styles.stockConsole__chromeRight}>
          <span className={styles.stockConsole__chromeIconBtn} aria-hidden="true">
            <Search size={14} strokeWidth={2.2} />
          </span>
          <span className={styles.stockConsole__chromeIconBtn} aria-hidden="true">
            <Bell size={14} strokeWidth={2.2} />
            <i className={styles.stockConsole__bellBadge} />
          </span>
          <span className={styles.stockConsole__chromeIconBtn} aria-hidden="true">
            <Settings size={14} strokeWidth={2.2} />
          </span>
          <span className={styles.stockConsole__userAvatar} aria-hidden="true">
            A
          </span>
        </div>
      </div>

      <div className={styles.stockConsole__body}>
        <div className={styles.stockConsole__rail}>
          <span className={`${styles.stockConsole__railItem} ${styles.stockConsole__railItemActive}`}>
            <LayoutGrid size={16} strokeWidth={1.9} />
          </span>
          {railIcons.map((Icon, index) => (
            <span key={index} className={styles.stockConsole__railItem}>
              <Icon size={16} strokeWidth={1.9} />
            </span>
          ))}
          <span className={styles.stockConsole__railSpacer} />
          <span className={styles.stockConsole__railItem}>
            <Settings2 size={16} strokeWidth={1.9} />
          </span>
        </div>

        <div className={styles.stockConsole__canvas}>
          <div className={styles.stockConsole__kpiRow}>
            {consoleKpis.map((kpi, index) => (
              <Kpi key={kpi.label} index={index} />
            ))}
          </div>

          <div className={styles.stockConsole__toolbar}>
            <span className={styles.stockConsole__search}>
              <Search size={13} strokeWidth={2.2} />
              Search product, line code, GRN
            </span>
            <span className={styles.stockConsole__filter}>
              All expiry
              <ChevronDown size={12} strokeWidth={2.4} />
            </span>
            <span className={styles.stockConsole__filter}>
              <i className={styles.stockConsole__checkbox} />
              Low stock
            </span>
            <span className={styles.stockConsole__filter}>
              <i className={`${styles.stockConsole__checkbox} ${styles.stockConsole__checkboxOn}`}>
                <Check size={9} strokeWidth={4} />
              </i>
              Hide zero qty
            </span>
            <span className={styles.stockConsole__segmented}>
              {consoleTabs.map((tab) => (
                <span
                  key={tab}
                  className={
                    tab === consoleWorkspace.view
                      ? styles.stockConsole__segmentedActive
                      : undefined
                  }
                >
                  {tab}
                </span>
              ))}
            </span>
            <span className={styles.stockConsole__ghostBtn}>
              <Download size={12} strokeWidth={2.2} />
              Export
            </span>
          </div>

          <div className={styles.stockConsole__tableWrap}>
            <div className={`${styles.stockConsole__row} ${styles.stockConsole__head}`}>
              <span>Code</span>
              <span>Product</span>
              <span className={styles.stockConsole__numeric}>Qty</span>
              <span className={styles.stockConsole__numeric}>S. rate</span>
              <span className={styles.stockConsole__numeric}>MRP</span>
              <span>Piece barcode</span>
              <span>Location</span>
              <span>Updated</span>
            </div>

            {consoleRows.map((row, index) => (
              <Row
                key={row.barcode}
                row={row}
                index={index}
                scanned={index === scanned}
              />
            ))}

            <span className={styles.stockConsole__tableFade} />
          </div>
        </div>
      </div>
    </div>
  );
}
