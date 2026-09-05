"use client";

import {
  ArrowUpRight,
  Bell,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useState, type CSSProperties } from "react";
import type { FeatureSimulationData } from "@/lib/content/features/feature-deep-pages";
import { SimVisualPlate } from "./sim-visual";
import styles from "@/components/pages/features/features.module.css";

/**
 * The section-01 product surface — an application window built from markup,
 * never a screenshot.
 *
 * The shell is identical on all five deep pages: chrome, a breadcrumb bar, a
 * record list on the left and a detail pane on the right, over a status strip.
 * What changes per feature is the records it lists and the mechanism the
 * detail pane draws.
 *
 * The list is live: pointing at a row lifts it, choosing one re-reads the
 * detail pane. Every figure is synthetic marketing data.
 */
export function FeatureSimulation({ data }: { data: FeatureSimulationData }) {
  const [selected, setSelected] = useState(data.rows[0].id);
  const row = data.rows.find((item) => item.id === selected) ?? data.rows[0];

  return (
    <figure className={styles.features__featureDeep__sim}>
      {/* ------------------------------------------------------- chrome bar */}
      <div className={styles.features__featureDeep__simChrome}>
        <span className={styles.features__featureDeep__simBrand}>
          <span className={styles.features__featureDeep__simMark}>B</span>
          <span>Bizonix</span>
        </span>
        <span className={styles.features__featureDeep__simCrumb}>
          <span>{data.workspace}</span>
          <ChevronRight size={12} strokeWidth={2.4} aria-hidden="true" />
          <strong>{data.crumb}</strong>
        </span>
        <span className={styles.features__featureDeep__simChromeRight}>
          <span className={styles.features__featureDeep__simSearch}>
            <Search size={12} strokeWidth={2.4} aria-hidden="true" />
            Search
          </span>
          <span className={styles.features__featureDeep__simIcon}>
            <Bell size={13} strokeWidth={2} aria-hidden="true" />
            <i />
          </span>
          <span className={styles.features__featureDeep__simAvatar}>MS</span>
        </span>
      </div>

      {/* ------------------------------------------------------ context bar */}
      <div className={styles.features__featureDeep__simContext}>
        <span className={styles.features__featureDeep__simContextTitle}>{data.crumb}</span>
        <span className={styles.features__featureDeep__simContextRight}>
          <span className={styles.features__featureDeep__simCount}>{data.total} records</span>
          <span className={styles.features__featureDeep__simFilter}>
            <SlidersHorizontal size={11} strokeWidth={2.3} aria-hidden="true" />
            Filters
          </span>
        </span>
      </div>

      {/* ------------------------------------------------------------- body */}
      <div className={styles.features__featureDeep__simBody}>
        <div className={styles.features__featureDeep__simList}>
          <div className={`${styles.features__featureDeep__simRow} ${styles.features__featureDeep__simRowHead}`}>
            <span>{data.columns[0]}</span>
            <span className={styles.features__featureDeep__simRowState}>{data.columns[2]}</span>
          </div>

          {data.rows.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={styles.features__featureDeep__simRow}
              data-on={item.id === selected}
              style={{ "--i": index } as CSSProperties}
              aria-pressed={item.id === selected}
              onClick={() => setSelected(item.id)}
              onMouseEnter={() => setSelected(item.id)}
              onFocus={() => setSelected(item.id)}
            >
              <span className={styles.features__featureDeep__simRowPrimary}>{item.primary}</span>
              <span className={styles.features__featureDeep__simRowSecondary}>
                <em>{item.secondary}</em>
                <i>{item.value}</i>
              </span>
              <span className={styles.features__featureDeep__simRowState}>
                <span className={styles.features__featureDeep__simPill} data-tone={item.tone}>
                  {item.state}
                </span>
              </span>
            </button>
          ))}

          <span className={styles.features__featureDeep__simListFoot}>
            Showing {data.rows.length} of {data.total} · {data.columns[1]}
          </span>
        </div>

        <aside className={styles.features__featureDeep__simDetail} key={row.id}>
          <span className={styles.features__featureDeep__simDetailHead}>{row.detail.title}</span>

          <SimVisualPlate visual={row.detail.plate} />

          <dl className={styles.features__featureDeep__record}>
            {row.detail.record.map((entry, index) => (
              <div key={entry.label} style={{ "--i": index } as CSSProperties}>
                <dt>{entry.label}</dt>
                <dd>{entry.value}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.features__featureDeep__simActions}>
            <span className={styles.features__featureDeep__simPrimary}>{data.actions[0]}</span>
            <span className={styles.features__featureDeep__simGhost}>
              {data.actions[1]}
              <ArrowUpRight size={13} strokeWidth={2.4} aria-hidden="true" />
            </span>
          </div>
        </aside>
      </div>

      {/* ------------------------------------------------------ status strip */}
      <figcaption className={styles.features__featureDeep__simStatus} key={`${row.id}-status`}>
        <span className={styles.features__featureDeep__simStatusDot} data-tone={row.tone} />
        {row.detail.footer}
      </figcaption>
    </figure>
  );
}
