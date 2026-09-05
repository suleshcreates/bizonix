"use client";

import {
  Barcode,
  Bell,
  ChevronDown,
  MapPin,
  MonitorCheck,
  Plus,
  ReceiptIndianRupee,
  Search,
  SlidersHorizontal,
  Tags,
  Truck,
  Upload,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import {
  screenNav,
  type HeroFeature,
  type ProductKpi,
} from "@/lib/content/features/features-hero-data";
import styles from "@/components/pages/features/features.module.css";

const navIcons: Record<string, LucideIcon> = {
  "Piece identity": Barcode,
  Counters: MonitorCheck,
  "GST & tax": ReceiptIndianRupee,
  "Rate series": Tags,
  Transfers: Truck,
};

function Sparkline({ points }: { points: readonly number[] }) {
  const step = 100 / Math.max(1, points.length - 1);
  const coords = points.map((value, index) => {
    const x = index * step;
    const y = 26 - (Math.min(100, Math.max(0, value)) / 100) * 22;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <svg
      className={styles.screen__spark}
      viewBox="0 0 100 28"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polygon
        className={styles.screen__sparkArea}
        points={`0,28 ${coords.join(" ")} 100,28`}
      />
      <polyline className={styles.screen__sparkLine} points={coords.join(" ")} />
    </svg>
  );
}

function KpiTile({ kpi }: { kpi: ProductKpi }) {
  return (
    <div className={styles.screen__kpi}>
      <span className={styles.screen__kpiLabel}>{kpi.label}</span>
      <span className={styles.screen__kpiValue}>{kpi.value}</span>
      <span className={styles.screen__kpiFoot}>
        <span className={styles.screen__kpiDelta} data-trend={kpi.trend}>
          {kpi.delta}
        </span>
        <Sparkline points={kpi.spark} />
      </span>
    </div>
  );
}

/** One shared product shell, populated by the active feature configuration. */
export function ProductSimulation({ feature }: { feature: HeroFeature }) {
  const product = feature.product;
  const readout = feature.state[0];

  return (
    <div
      className={styles.screen__screen}
      data-layer={feature.id}
      data-product={feature.id}
      style={{ "--accent": feature.accent } as CSSProperties}
      aria-hidden="true"
    >
      <aside className={styles.screen__rail}>
        <div className={styles.screen__brand}>
          <span className={styles.screen__brandMark}>B</span>
          <span className={styles.screen__brandWord}>Bizonix</span>
        </div>
        <span className={styles.screen__railLabel}>Workspace</span>
        <nav className={styles.screen__nav}>
          {screenNav.map((item) => {
            const Icon = navIcons[item];
            const active = item === feature.nav;
            return (
              <span
                key={item}
                className={styles.screen__navItem}
                data-active={active ? "true" : "false"}
              >
                <Icon className={styles.screen__navIcon} strokeWidth={2.1} />
                <span className={styles.screen__navText}>{item}</span>
                {active ? <i className={styles.screen__navDot} /> : null}
              </span>
            );
          })}
        </nav>
        <div className={styles.screen__readout} key={feature.id}>
          <span className={styles.screen__readoutTop}>
            <i className={styles.screen__readoutDot} />
            {feature.name}
          </span>
          <span className={styles.screen__readoutLabel}>{readout.label}</span>
          <span className={styles.screen__readoutValue}>{readout.value}</span>
        </div>
      </aside>

      <div className={styles.screen__main} key={feature.id}>
        <div className={styles.screen__appBar}>
          <span className={styles.screen__search}>
            <Search className={styles.screen__searchIcon} strokeWidth={2.2} />
            <span className={styles.screen__searchText}>{product.search}</span>
            <span className={styles.screen__searchKey}>/</span>
          </span>
          <span className={styles.screen__store}>
            <MapPin className={styles.screen__storeIcon} strokeWidth={2.2} />
            <span className={styles.screen__storeText}>
              <strong>{product.location}</strong>
              <em>{product.scope}</em>
            </span>
            <ChevronDown className={styles.screen__storeChevron} strokeWidth={2.4} />
          </span>
          <span className={styles.screen__bell}>
            <Bell strokeWidth={2.1} />
            <i />
          </span>
          <span className={styles.screen__avatar}>MS</span>
        </div>

        <div className={styles.screen__pageHead}>
          <span className={styles.screen__pageTitleBlock}>
            <span className={styles.screen__pageTitle}>{product.title}</span>
            <span className={styles.screen__pageSub}>
              {product.subtitle}
              <i />
              updated just now
            </span>
          </span>
          <span className={styles.screen__actions}>
            <span className={styles.screen__ghostBtn}>
              <SlidersHorizontal strokeWidth={2.2} />
              Filters
            </span>
            <span className={styles.screen__ghostBtn}>
              <Upload strokeWidth={2.2} />
              Export
            </span>
            <span className={styles.screen__primaryBtn}>
              <Plus strokeWidth={2.6} />
              {product.action}
            </span>
          </span>
        </div>

        <div className={styles.screen__kpis}>
          {product.kpis.map((kpi) => (
            <KpiTile key={kpi.label} kpi={kpi} />
          ))}
        </div>

        <div className={styles.screen__table}>
          <div className={`${styles.screen__row} ${styles.screen__headRow}`}>
            {product.columns.map((column, index) => (
              <span
                key={column}
                className={
                  index === 3
                    ? styles.screen__num
                    : index === 4
                      ? styles.screen__statusCol
                      : undefined
                }
              >
                {column}
              </span>
            ))}
          </div>
          <div className={styles.screen__body}>
            {product.rows.map((row, index) => (
              <div
                key={`${row.code}-${index}`}
                className={styles.screen__row}
                data-focus={row.focus ? "true" : "false"}
                style={{ "--i": index } as CSSProperties}
              >
                <span className={styles.screen__sku}>{row.code}</span>
                <span className={styles.screen__item}>
                  <strong>{row.item}</strong>
                  <em>{row.itemMeta}</em>
                </span>
                <span className={styles.screen__place}>
                  <strong>{row.context}</strong>
                  <em>{row.contextMeta}</em>
                </span>
                <span className={`${styles.screen__cell} ${styles.screen__num}`}>
                  {row.measure}
                </span>
                <span className={styles.screen__statusCol}>
                  <span
                    className={row.focus ? styles.screen__pillLive : styles.screen__pill}
                    data-tone={row.tone}
                  >
                    <i />
                    {row.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
