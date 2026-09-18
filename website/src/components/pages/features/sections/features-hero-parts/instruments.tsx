import type { FeatureId } from "@/lib/content/features/features";
import styles from "@/components/pages/features/features.module.css";

/**
 * Five live glyphs for the hero rack. Each one animates the mechanism its
 * feature is about rather than illustrating it with an icon, so the rack reads
 * as instrumentation on a running line. All motion is CSS keyframes on
 * transform/opacity and is stilled by the reduced-motion query in the sheet.
 */

function BarcodeInstrument() {
  const bars = [3, 6, 2, 8, 3, 4, 7, 2, 5, 3, 6, 2, 4, 8, 3];
  return (
    <span className={styles.instruments__barcode}>
      {bars.map((weight, index) => (
        <i key={index} style={{ width: `${weight}px` }} />
      ))}
      <span className={styles.instruments__beam} />
    </span>
  );
}

function CounterInstrument() {
  return (
    <span className={styles.instruments__dial}>
      <svg viewBox="0 0 44 44" aria-hidden="true">
        <circle className={styles.instruments__dialTrack} cx="22" cy="22" r="17" />
        <circle className={styles.instruments__dialSweep} cx="22" cy="22" r="17" />
      </svg>
      <span className={styles.instruments__dialCore} />
    </span>
  );
}

function InvoiceInstrument() {
  return (
    <span className={styles.instruments__doc}>
      {[0, 1, 2, 3].map((line) => (
        <i key={line} style={{ "--i": line } as React.CSSProperties} />
      ))}
      <span className={styles.instruments__stamp} />
    </span>
  );
}

function LadderInstrument() {
  const rungs = [34, 52, 68, 88];
  return (
    <span className={styles.instruments__ladder}>
      {rungs.map((width, index) => (
        <i
          key={width}
          style={{ "--w": `${width}%`, "--i": index } as React.CSSProperties}
        />
      ))}
    </span>
  );
}

function RouteInstrument() {
  return (
    <span className={styles.instruments__route}>
      <svg viewBox="0 0 84 40" aria-hidden="true">
        <path className={styles.instruments__routeLine} d="M8 30 C 28 4, 56 4, 76 30" />
      </svg>
      <span className={styles.instruments__routeNodeStart} />
      <span className={styles.instruments__routeNodeEnd} />
      <span className={styles.instruments__packet} />
    </span>
  );
}

const instruments: Record<FeatureId, () => React.JSX.Element> = {
  barcode: BarcodeInstrument,
  "billing-counters": CounterInstrument,
  "gst-compliance": InvoiceInstrument,
  "series-pricing": LadderInstrument,
  "stock-transfer": RouteInstrument,
};

export function Instrument({ id }: { id: FeatureId }) {
  const Glyph = instruments[id];
  return (
    <span className={styles.instruments__frame} aria-hidden="true">
      <Glyph />
    </span>
  );
}
