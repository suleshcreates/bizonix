import { ArrowRight, Check } from "lucide-react";
import type { CSSProperties } from "react";
import type { SimVisual } from "@/lib/content/features/feature-deep-pages";
import styles from "@/components/pages/features/features.module.css";

/**
 * The one place a feature is allowed to look different.
 *
 * Five small mechanisms — a code, a session, a tax split, a price ladder, a
 * route — each drawn into the SAME fixed-height plate at the top of the
 * simulation card. Swapping the mechanism never changes the card's geometry,
 * which is what keeps the five deep pages interchangeable.
 */

const BARS = [
  3, 1, 2, 1, 4, 1, 2, 3, 1, 5, 1, 2, 1, 3, 2, 1, 4, 1, 2, 1, 3, 1, 5, 2, 1, 3,
  1, 2, 4, 1, 2, 1, 3, 1, 2, 1, 4, 2, 1, 3,
];

export function SimVisualPlate({ visual }: { visual: SimVisual }) {
  if (visual.kind === "barcode") {
    return (
      <div className={styles.features__featureDeep__plate} data-kind="barcode">
        <span className={styles.features__featureDeep__barcodeBars} aria-hidden="true">
          {BARS.map((weight, index) => (
            <i key={index} style={{ width: `${weight}px` }} />
          ))}
        </span>
        <span className={styles.features__featureDeep__scanBeam} aria-hidden="true" />
        <span className={styles.features__featureDeep__plateFoot}>
          <code>{visual.code}</code>
          <em>{visual.caption}</em>
        </span>
      </div>
    );
  }

  if (visual.kind === "session") {
    return (
      <div className={styles.features__featureDeep__plate} data-kind="session">
        <span className={styles.features__featureDeep__sessionHead}>
          <span className={styles.features__featureDeep__sessionBadge}>
            {visual.counter.replace(/\D+/g, "") || "2"}
          </span>
          <span className={styles.features__featureDeep__sessionMeta}>
            <strong>{visual.counter}</strong>
            <em>
              {visual.operator} · since {visual.opened}
            </em>
          </span>
          <span className={styles.features__featureDeep__sessionLive} aria-hidden="true" />
        </span>
        <span className={styles.features__featureDeep__track} aria-hidden="true">
          <i style={{ "--fill": `${visual.progress}%` } as CSSProperties} />
        </span>
        <span className={styles.features__featureDeep__plateFoot}>
          <em>Shift progress</em>
          <em>{visual.progress}%</em>
        </span>
      </div>
    );
  }

  if (visual.kind === "tax") {
    return (
      <div className={styles.features__featureDeep__plate} data-kind="tax">
        <span className={styles.features__featureDeep__taxTotal}>{visual.total}</span>
        <span className={styles.features__featureDeep__taxBar} aria-hidden="true">
          {visual.segments.map((segment, index) => (
            <i
              key={segment.label}
              data-seg={index}
              style={
                { "--share": `${segment.share}%`, "--i": index } as CSSProperties
              }
            />
          ))}
        </span>
        <span className={styles.features__featureDeep__taxLegend}>
          {visual.segments.map((segment, index) => (
            <span key={segment.label} data-seg={index}>
              <i aria-hidden="true" />
              {segment.label}
              <em>{segment.value}</em>
            </span>
          ))}
        </span>
      </div>
    );
  }

  if (visual.kind === "ladder") {
    return (
      <div className={styles.features__featureDeep__plate} data-kind="ladder">
        <ul className={styles.features__featureDeep__ladder}>
          {visual.rungs.map((rung, index) => (
            <li
              key={rung.label}
              data-on={rung.label === visual.applied}
              style={
                { "--share": `${rung.share}%`, "--i": index } as CSSProperties
              }
            >
              <span className={styles.features__featureDeep__rungLabel}>{rung.label}</span>
              <span className={styles.features__featureDeep__rungTrack} aria-hidden="true">
                <i />
              </span>
              <span className={styles.features__featureDeep__rungValue}>{rung.value}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={styles.features__featureDeep__plate} data-kind="route">
      <span className={styles.features__featureDeep__routeRow}>
        <span className={styles.features__featureDeep__routeNode}>
          <em>From</em>
          <strong>{visual.from}</strong>
          <span>{visual.fromPlace}</span>
        </span>
        <span className={styles.features__featureDeep__routeLink} aria-hidden="true">
          <i className={styles.features__featureDeep__routeTrack} />
          <i
            className={styles.features__featureDeep__routeFill}
            style={{ "--fill": `${visual.progress}%` } as CSSProperties}
          />
          <i className={styles.features__featureDeep__routePacket} />
          <ArrowRight size={13} strokeWidth={2.4} />
        </span>
        <span className={`${styles.features__featureDeep__routeNode} ${styles.features__featureDeep__routeNodeTo}`}>
          <em>To</em>
          <strong>{visual.to}</strong>
          <span>{visual.toPlace}</span>
        </span>
      </span>
      <span className={styles.features__featureDeep__plateFoot}>
        <em>
          <Check size={11} strokeWidth={3} aria-hidden="true" /> Scanned out at
          source
        </em>
        <em>{visual.progress}% of route</em>
      </span>
    </div>
  );
}
