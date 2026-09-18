import styles from "@/components/pages/modules/modules.module.css";
import { Stage } from "../visual-kit";

function Arrow({ x1, y1, x2, y2, step = 0 }: { x1: number; y1: number; x2: number; y2: number; step?: number }) {
  return (
    <g className={styles.accountingStory__draw} style={{ "--s": step } as React.CSSProperties}>
      <path d={`M ${x1} ${y1} L ${x2} ${y2}`} />
      <path d={`M ${x2 - 5} ${y2 - 4} L ${x2} ${y2} L ${x2 - 5} ${y2 + 4}`} />
    </g>
  );
}

function DocumentIcon({ x, y }: { x: number; y: number }) {
  return (
    <g className={styles.accountingStory__icon}>
      <path d={`M ${x} ${y}h13l6 6v24h-19z`} />
      <path d={`M ${x + 13} ${y}v7h6M ${x + 5} ${y + 14}h9M ${x + 5} ${y + 20}h9`} />
    </g>
  );
}

/** Two month records reveal the same period being entered twice. */
export function PeriodRelayVisual() {
  return (
    <Stage>
      <g className={styles.accountingStory__enter} style={{ "--s": 0 } as React.CSSProperties}>
        <rect x="8" y="24" width="126" height="142" rx="12" className={styles.accountingStory__panel} />
        <DocumentIcon x={20} y={40} />
        <text x="50" y="51" className={styles.accountingStory__label}>Operations</text>
        <text x="50" y="68" className={styles.accountingStory__meta}>Month-end export</text>
        <circle cx="26" cy="94" r="3" className={styles.accountingStory__purpleDot} />
        <rect x="38" y="83" width="76" height="23" rx="6" className={styles.accountingStory__purpleWash} />
        <text x="50" y="99" className={styles.accountingStory__row}>Jan 2024</text>
        <circle cx="26" cy="120" r="3" className={styles.accountingStory__softDot} />
        <text x="50" y="125" className={styles.accountingStory__row}>Jan 2024</text>
        <circle cx="26" cy="145" r="3" className={styles.accountingStory__softDot} />
        <text x="50" y="150" className={styles.accountingStory__row}>Jan 2024</text>
      </g>
      <g className={styles.accountingStory__enter} style={{ "--s": 1 } as React.CSSProperties}>
        <rect x="186" y="24" width="126" height="142" rx="12" className={styles.accountingStory__panel} />
        <DocumentIcon x={198} y={40} />
        <text x="228" y="51" className={styles.accountingStory__label}>Books</text>
        <text x="228" y="68" className={styles.accountingStory__meta}>Month-end import</text>
        <circle cx="204" cy="94" r="3" className={styles.accountingStory__purpleDot} />
        <rect x="216" y="83" width="76" height="23" rx="6" className={styles.accountingStory__purpleWash} />
        <text x="228" y="99" className={styles.accountingStory__row}>Jan 2024</text>
        <circle cx="204" cy="120" r="3" className={styles.accountingStory__softDot} />
        <text x="228" y="125" className={styles.accountingStory__row}>Jan 2024</text>
        <circle cx="204" cy="145" r="3" className={styles.accountingStory__softDot} />
        <text x="228" y="150" className={styles.accountingStory__row}>Jan 2024</text>
      </g>
      <g className={styles.accountingStory__enter} style={{ "--s": 2 } as React.CSSProperties}>
        <path d="M134 95h18M168 95h18" className={styles.accountingStory__dash} />
        <circle cx="143" cy="95" r="3" className={styles.accountingStory__purpleDot} />
        <circle cx="177" cy="95" r="3" className={styles.accountingStory__purpleDot} />
        <rect x="146" y="72" width="28" height="46" rx="8" className={styles.accountingStory__purpleWash} />
        <path d="M153 89h14l-4-4M167 89l-4 4M167 101h-14l4 4M153 101l4-4" className={styles.accountingStory__swap} />
      </g>
      <circle cx="143" cy="95" r="2.5" className={styles.accountingStory__signal} />
    </Stage>
  );
}

/** A rich transaction collapses into a figure with no usable context. */
export function ContextStrippedVisual() {
  return (
    <Stage>
      <g className={styles.accountingStory__enter} style={{ "--s": 0 } as React.CSSProperties}>
        <rect x="7" y="39" width="102" height="118" rx="11" className={styles.accountingStory__panel} />
        <DocumentIcon x={18} y={53} />
        <text x="48" y="64" className={styles.accountingStory__label}>Transaction</text>
        <text x="48" y="82" className={styles.accountingStory__meta}>Piece · counter</text>
        <text x="48" y="103" className={styles.accountingStory__row}>Item</text>
        <text x="48" y="121" className={styles.accountingStory__row}>Qty</text>
        <text x="48" y="139" className={styles.accountingStory__row}>Amount</text>
      </g>
      <Arrow x1={109} y1={98} x2={129} y2={98} step={1} />
      <g className={styles.accountingStory__enter} style={{ "--s": 1.4 } as React.CSSProperties}>
        <rect x="129" y="39" width="105" height="118" rx="11" className={styles.accountingStory__panel} />
        <path d="M143 59h19M143 65h19M143 71h13" className={styles.accountingStory__ledgerIcon} />
        <text x="169" y="67" className={styles.accountingStory__label}>Ledger line</text>
        <rect x="143" y="91" width="75" height="10" rx="5" className={styles.accountingStory__softBar} />
        <rect x="143" y="111" width="61" height="10" rx="5" className={styles.accountingStory__softBar} />
        <text x="143" y="140" className={styles.accountingStory__meta}>Figure only</text>
      </g>
      <Arrow x1={234} y1={98} x2={253} y2={98} step={2} />
      <g className={styles.accountingStory__enter} style={{ "--s": 2.4 } as React.CSSProperties}>
        <rect x="253" y="39" width="60" height="118" rx="11" className={styles.accountingStory__missingPanel} />
        <rect x="264" y="52" width="38" height="47" rx="9" className={styles.accountingStory__missingMark} />
        <text x="283" y="84" textAnchor="middle" className={styles.accountingStory__question}>?</text>
        <text x="283" y="122" textAnchor="middle" className={styles.accountingStory__meta}>Missing</text>
        <text x="283" y="139" textAnchor="middle" className={styles.accountingStory__meta}>context</text>
      </g>
    </Stage>
  );
}

/** Three independent books converge only when a group view is assembled. */
export function EntitySplitVisual() {
  const entities = [
    { x: 8, label: "Company", tone: "blue" },
    { x: 113, label: "Store", tone: "teal" },
    { x: 218, label: "Partner", tone: "purple" },
  ] as const;
  return (
    <Stage>
      {entities.map((entity, index) => (
        <g key={entity.label} className={styles.accountingStory__enter} style={{ "--s": index * 0.45 } as React.CSSProperties}>
          <rect x={entity.x} y="26" width="94" height="54" rx="10" className={`${styles.accountingStory__entity} ${styles[`accountingStory__entity_${entity.tone}`]}`} />
          <path d={`M${entity.x + 12} 48h15v18h-15zM${entity.x + 10} 48l9.5-8 9.5 8M${entity.x + 16} 66v-8h7v8`} className={styles.accountingStory__shopIcon} />
          <text x={entity.x + 37} y="50" className={styles.accountingStory__label}>{entity.label}</text>
          <text x={entity.x + 37} y="67" className={styles.accountingStory__meta}>Own books</text>
        </g>
      ))}
      <g className={styles.accountingStory__draw} style={{ "--s": 1.8 } as React.CSSProperties}>
        <path d="M55 80 C55 105 104 99 113 121" className={styles.accountingStory__blueLine} />
        <path d="M160 80 L160 121" className={styles.accountingStory__tealLine} />
        <path d="M265 80 C265 105 216 99 207 121" className={styles.accountingStory__purpleLine} />
      </g>
      <g className={styles.accountingStory__enter} style={{ "--s": 2.4 } as React.CSSProperties}>
        <rect x="78" y="119" width="164" height="42" rx="10" className={styles.accountingStory__group} />
        <ellipse cx="105" cy="133" rx="8" ry="4" className={styles.accountingStory__database} />
        <path d="M97 133v13c0 5 16 5 16 0v-13M97 140c0 5 16 5 16 0" className={styles.accountingStory__database} />
        <text x="122" y="145" className={styles.accountingStory__label}>Group view</text>
        <rect x="113" y="168" width="94" height="18" rx="9" className={styles.accountingStory__amberPill} />
        <text x="160" y="181" textAnchor="middle" className={styles.accountingStory__amberText}>Once a quarter</text>
      </g>
    </Stage>
  );
}