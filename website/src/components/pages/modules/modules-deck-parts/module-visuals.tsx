import type { CSSProperties } from "react";
import s from "@/components/pages/modules/modules.module.css";

/**
 * A bespoke, looping micro-simulation for every module in the catalogue.
 *
 * These are deliberately not decorative shapes: each one shows the actual
 * mechanic the module owns, so a visitor understands the module before they
 * read a word of it. All nine share one grid (300 x 140), one stroke language
 * and one `--cycle`, so nine different pictures still read as one system.
 */

const V = (vars: Record<string, string | number>) => vars as CSSProperties;

/* 1. Inventory — shelves breathing under a scan pass. */

const BIN_ROWS = [28, 60, 92];
const BIN_LEVELS = [
  [0.42, 0.86],
  [0.3, 0.72],
  [0.55, 0.95],
  [0.36, 0.68],
  [0.48, 0.9],
];

function InventoryVisual() {
  return (
    <svg className={s.moduleVisuals__svg} viewBox="0 0 300 140" aria-hidden="true">
      <defs>
        <linearGradient id="bzScanBeam" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="70%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect className={s.moduleVisuals__frame} x={52} y={22} width={196} height={96} rx={11} />
      <line className={s.moduleVisuals__hair} x1={52} y1={54} x2={248} y2={54} />
      <line className={s.moduleVisuals__hair} x1={52} y1={86} x2={248} y2={86} />

      {BIN_ROWS.map((y, row) =>
        BIN_LEVELS.map(([lo, hi], col) => (
          <rect
            key={`${row}-${col}`}
            className={s.moduleVisuals__bin}
            x={58 + col * 38}
            y={y}
            width={28}
            height={26}
            rx={3}
            style={V({
              "--lo": lo,
              "--hi": hi,
              "--d": (row * 5 + col) * 0.055,
            })}
          />
        )),
      )}

      <g className={s.moduleVisuals__beam}>
        <rect x={48} y={18} width={20} height={104} fill="url(#bzScanBeam)" />
        <rect
          className={s.moduleVisuals__solid}
          x={57}
          y={18}
          width={2}
          height={104}
          rx={1}
          opacity={0.85}
        />
        <rect className={s.moduleVisuals__solid} x={50} y={8} width={16} height={9} rx={4} />
      </g>

      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          className={s.moduleVisuals__tick}
          x={196 + i * 9}
          y={4}
          width={i % 2 ? 2 : 4}
          height={11}
          rx={1}
          style={V({ "--d": i * 0.08 })}
        />
      ))}
    </svg>
  );
}

/* 2. Procurement — a purchase order travelling to the dock, then stamped. */

function ProcurementVisual() {
  return (
    <svg className={s.moduleVisuals__svg} viewBox="0 0 300 140" aria-hidden="true">
      <rect className={s.moduleVisuals__soft} x={20} y={44} width={54} height={52} rx={11} />
      <rect className={s.moduleVisuals__frame} x={20} y={44} width={54} height={52} rx={11} />
      {[58, 68, 78].map((y, i) => (
        <rect
          key={y}
          className={s.moduleVisuals__solid}
          x={30}
          y={y}
          width={i === 2 ? 20 : 34}
          height={4}
          rx={2}
          opacity={0.4}
        />
      ))}

      <rect className={s.moduleVisuals__soft} x={226} y={44} width={54} height={52} rx={11} />
      <rect className={s.moduleVisuals__frame} x={226} y={44} width={54} height={52} rx={11} />
      <path
        className={s.moduleVisuals__frame}
        d="M236 78h34M236 86h22"
        strokeLinecap="round"
      />

      <path className={s.moduleVisuals__lane} d="M80 70H220" />

      <g className={s.moduleVisuals__carrier}>
        <g className={s.moduleVisuals__carrierArc}>
          <rect className={s.moduleVisuals__solid} x={74} y={60} width={20} height={19} rx={4} />
          <path
            d="M79 66h10M79 71h7"
            stroke="#fff"
            strokeOpacity={0.75}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        </g>
      </g>

      <g className={s.moduleVisuals__stamp}>
        <circle className={s.moduleVisuals__soft} cx={253} cy={62} r={15} />
        <path
          d="M246 62l5 5 9-10"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <rect className={s.moduleVisuals__soft} x={96} y={112} width={108} height={7} rx={3.5} />
      <rect
        className={s.moduleVisuals__meterFill}
        x={96}
        y={112}
        width={108}
        height={7}
        rx={3.5}
      />
    </svg>
  );
}

/* 3. Sales & POS — a bill printing itself, line by line. */

const RECEIPT_LINES = [70, 58, 74, 50, 66, 44];

function SalesVisual() {
  return (
    <svg className={s.moduleVisuals__svg} viewBox="0 0 300 140" aria-hidden="true">
      <rect className={s.moduleVisuals__soft} x={22} y={42} width={58} height={56} rx={11} />
      <rect className={s.moduleVisuals__frame} x={22} y={42} width={58} height={56} rx={11} />
      <rect className={s.moduleVisuals__solid} x={31} y={51} width={40} height={18} rx={4} opacity={0.35} />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          className={s.moduleVisuals__tick}
          x={31 + i * 14}
          y={76}
          width={11}
          height={11}
          rx={3}
          style={V({ "--d": i * 0.12 })}
        />
      ))}

      <rect className={s.moduleVisuals__soft} x={88} y={8} width={126} height={18} rx={7} />
      <rect className={s.moduleVisuals__frame} x={88} y={8} width={126} height={18} rx={7} />
      <rect className={`${s.moduleVisuals__solid} ${s.moduleVisuals__head}`} x={96} y={13} width={22} height={8} rx={4} />

      <rect className={s.moduleVisuals__soft} x={98} y={26} width={106} height={104} rx={7} />
      <rect className={s.moduleVisuals__frame} x={98} y={26} width={106} height={104} rx={7} />

      {RECEIPT_LINES.map((w, i) => (
        <rect
          key={i}
          className={s.moduleVisuals__printLine}
          x={110}
          y={42 + i * 12}
          width={w}
          height={5}
          rx={2.5}
          opacity={0.45}
          style={V({ "--d": 0.08 + i * 0.06 })}
        />
      ))}
      <rect
        className={s.moduleVisuals__printLine}
        x={110}
        y={112}
        width={82}
        height={10}
        rx={3}
        style={V({ "--d": 0.5 })}
      />

      <g>
        <rect className={s.moduleVisuals__soft} x={234} y={80} width={38} height={26} rx={6} />
        <rect className={s.moduleVisuals__frame} x={234} y={80} width={38} height={26} rx={6} />
        <rect className={s.moduleVisuals__solid} x={234} y={87} width={38} height={5} opacity={0.5} />
        {[0, 0.14, 0.28].map((d, i) => (
          <circle
            key={i}
            className={s.moduleVisuals__tapRing}
            cx={253}
            cy={93}
            r={16}
            style={V({ "--d": d })}
          />
        ))}
      </g>
    </svg>
  );
}

/* 4. Wholesale — cartons stacked onto a pallet, then dispatched. */

const CARTONS = [
  { x: 40, y: 78 },
  { x: 74, y: 78 },
  { x: 108, y: 78 },
  { x: 40, y: 52 },
  { x: 74, y: 52 },
  { x: 108, y: 52 },
];

function WholesaleVisual() {
  return (
    <svg className={s.moduleVisuals__svg} viewBox="0 0 300 140" aria-hidden="true">
      <rect className={s.moduleVisuals__soft} x={16} y={34} width={12} height={58} rx={6} />
      <rect className={s.moduleVisuals__creditFill} x={16} y={34} width={12} height={58} rx={6} />
      {[40, 56, 72].map((y) => (
        <line key={y} className={s.moduleVisuals__hair} x1={32} y1={y} x2={38} y2={y} />
      ))}

      <path className={s.moduleVisuals__lane} d="M150 116H292" />

      <g className={s.moduleVisuals__stack}>
        {CARTONS.map((c, i) => (
          <g
            key={i}
            className={s.moduleVisuals__carton}
            style={V({ "--d": 0.05 + (5 - i) * 0.055 })}
          >
            <rect className={s.moduleVisuals__soft} x={c.x} y={c.y} width={30} height={24} rx={4} />
            <rect className={s.moduleVisuals__frame} x={c.x} y={c.y} width={30} height={24} rx={4} />
            <line
              className={s.moduleVisuals__hair}
              x1={c.x + 15}
              y1={c.y}
              x2={c.x + 15}
              y2={c.y + 24}
            />
          </g>
        ))}
      </g>

      <rect className={s.moduleVisuals__soft} x={34} y={104} width={110} height={8} rx={3} />
      <rect className={s.moduleVisuals__frame} x={34} y={104} width={110} height={8} rx={3} />

      <g opacity={0.5}>
        <rect className={s.moduleVisuals__frame} x={228} y={44} width={54} height={40} rx={9} />
        <path className={s.moduleVisuals__frame} d="M238 60h20M238 70h32" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* 5. Franchise — one hub pushing stock out to autonomous outlets. */

const OUTLETS = [
  { cx: 48, cy: 34, tx: -98, ty: -32 },
  { cx: 252, cy: 34, tx: 98, ty: -32 },
  { cx: 48, cy: 106, tx: -98, ty: 40 },
  { cx: 252, cy: 106, tx: 98, ty: 40 },
];

function FranchiseVisual() {
  return (
    <svg className={s.moduleVisuals__svg} viewBox="0 0 300 140" aria-hidden="true">
      {OUTLETS.map((o, i) => (
        <path
          key={`lane-${i}`}
          className={s.moduleVisuals__lane}
          d={`M150 70L${o.cx} ${o.cy}`}
        />
      ))}

      {[0, 0.34].map((d, i) => (
        <circle
          key={i}
          className={s.moduleVisuals__pulseRing}
          cx={150}
          cy={70}
          r={38}
          style={V({ "--d": d })}
        />
      ))}

      {OUTLETS.map((o, i) => (
        <g key={i} className={s.moduleVisuals__outlet} style={V({ "--d": 0.1 + i * 0.06 })}>
          <circle className={s.moduleVisuals__soft} cx={o.cx} cy={o.cy} r={16} />
          <circle className={s.moduleVisuals__frame} cx={o.cx} cy={o.cy} r={16} />
          <path
            d={`M${o.cx - 7} ${o.cy - 1}h14v8h-14z M${o.cx - 9} ${o.cy - 1}l4 -6h10l4 6`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </g>
      ))}

      <rect className={s.moduleVisuals__soft} x={124} y={52} width={52} height={36} rx={11} />
      <rect className={s.moduleVisuals__frame} x={124} y={52} width={52} height={36} rx={11} />
      <path
        d="M138 70h24M138 63h24M138 77h14"
        stroke="currentColor"
        strokeOpacity={0.55}
        strokeWidth={1.6}
        strokeLinecap="round"
      />

      {OUTLETS.map((o, i) => (
        <rect
          key={`packet-${i}`}
          className={s.moduleVisuals__packet}
          x={146}
          y={66}
          width={8}
          height={8}
          rx={2}
          style={V({ "--tx": `${o.tx}px`, "--ty": `${o.ty}px`, "--d": i * 0.07 })}
        />
      ))}
    </svg>
  );
}

/* 6. Accounting — debits and credits meeting at zero. */

const DEBITS = [44, 62, 52];
const CREDITS = [52, 44, 62];

function AccountingVisual() {
  return (
    <svg className={s.moduleVisuals__svg} viewBox="0 0 300 140" aria-hidden="true">
      <g className={s.moduleVisuals__beamBar}>
        <line x1={66} y1={30} x2={234} y2={30} />
        <circle cx={66} cy={30} r={3.5} fill="currentColor" stroke="none" />
        <circle cx={234} cy={30} r={3.5} fill="currentColor" stroke="none" />
      </g>
      <path className={s.moduleVisuals__soft} d="M150 30l9 18h-18z" />

      <line className={s.moduleVisuals__hair} x1={46} y1={122} x2={254} y2={122} />

      {DEBITS.map((h, i) => (
        <rect
          key={`dr-${i}`}
          className={s.moduleVisuals__ledgerBar}
          x={58 + i * 20}
          y={122 - h}
          width={16}
          height={h}
          rx={3}
          opacity={0.85}
          style={V({ "--d": i * 0.05 })}
        />
      ))}
      {CREDITS.map((h, i) => (
        <rect
          key={`cr-${i}`}
          className={s.moduleVisuals__ledgerBar}
          x={186 + i * 20}
          y={122 - h}
          width={16}
          height={h}
          rx={3}
          opacity={0.85}
          style={V({ "--d": 0.12 + i * 0.05 })}
        />
      ))}

      <text
        x={82}
        y={54}
        textAnchor="middle"
        fill="currentColor"
        fillOpacity={0.55}
        fontSize={9}
        fontWeight={800}
        letterSpacing={1.4}
      >
        DR
      </text>
      <text
        x={210}
        y={54}
        textAnchor="middle"
        fill="currentColor"
        fillOpacity={0.55}
        fontSize={9}
        fontWeight={800}
        letterSpacing={1.4}
      >
        CR
      </text>

      <g className={s.moduleVisuals__balanceChip}>
        <rect className={s.moduleVisuals__soft} x={124} y={98} width={52} height={19} rx={9.5} />
        <rect className={s.moduleVisuals__frame} x={124} y={98} width={52} height={19} rx={9.5} />
        <text
          x={150}
          y={111}
          textAnchor="middle"
          fill="currentColor"
          fontSize={9.5}
          fontWeight={800}
        >
          0.00
        </text>
      </g>
    </svg>
  );
}

/* 7. Ecommerce — the catalogue syncing while orders queue behind it. */

const TILES = [
  { x: 32, y: 38 },
  { x: 84, y: 38 },
  { x: 32, y: 76 },
  { x: 84, y: 76 },
];

function EcommerceVisual() {
  return (
    <svg className={s.moduleVisuals__svg} viewBox="0 0 300 140" aria-hidden="true">
      <rect className={s.moduleVisuals__soft} x={22} y={26} width={118} height={90} rx={12} />
      <rect className={s.moduleVisuals__frame} x={22} y={26} width={118} height={90} rx={12} />

      {TILES.map((t, i) => (
        <g key={i}>
          <rect className={s.moduleVisuals__soft} x={t.x} y={t.y} width={46} height={32} rx={7} />
          <path
            className={s.moduleVisuals__syncTick}
            d={`M${t.x + 15} ${t.y + 16}l5 5 11-12`}
            style={V({ "--d": 0.06 + i * 0.07 })}
          />
        </g>
      ))}

      <path className={s.moduleVisuals__lane} d="M146 70h28" />

      {[30, 64, 98].map((y, i) => (
        <g key={y} className={s.moduleVisuals__orderCard} style={V({ "--d": 0.1 + i * 0.09 })}>
          <rect className={s.moduleVisuals__soft} x={180} y={y} width={98} height={26} rx={8} />
          <rect className={s.moduleVisuals__frame} x={180} y={y} width={98} height={26} rx={8} />
          <circle className={s.moduleVisuals__solid} cx={194} cy={y + 13} r={5} opacity={0.6} />
          <rect
            className={s.moduleVisuals__solid}
            x={206}
            y={y + 8}
            width={44}
            height={4}
            rx={2}
            opacity={0.45}
          />
          <rect
            className={s.moduleVisuals__solid}
            x={206}
            y={y + 16}
            width={28}
            height={4}
            rx={2}
            opacity={0.25}
          />
        </g>
      ))}
    </svg>
  );
}

/* 8. Analytics — the trend drawing itself over live volume. */

const CHART_BARS = [
  [0.3, 0.55],
  [0.42, 0.7],
  [0.35, 0.6],
  [0.55, 0.86],
  [0.44, 0.72],
  [0.62, 0.94],
  [0.5, 0.78],
  [0.7, 1],
  [0.58, 0.88],
];

function AnalyticsVisual() {
  return (
    <svg className={s.moduleVisuals__svg} viewBox="0 0 300 140" aria-hidden="true">
      <line className={s.moduleVisuals__hair} x1={26} y1={118} x2={274} y2={118} />

      {CHART_BARS.map(([lo, hi], i) => (
        <rect
          key={i}
          className={s.moduleVisuals__chartBar}
          x={28 + i * 26}
          y={56}
          width={14}
          height={62}
          rx={3}
          style={V({ "--lo": lo, "--hi": hi, "--d": i * 0.05 })}
        />
      ))}

      <path
        className={s.moduleVisuals__spark}
        d="M32 98L58 86L84 92L110 70L136 76L162 54L188 62L214 40L240 46L266 28"
      />
      <circle
        className={s.moduleVisuals__sparkHead}
        cx={32}
        cy={98}
        r={4.5}
        style={V({ "--tx": "234px", "--ty": "-70px" })}
      />

      <circle
        cx={52}
        cy={32}
        r={15}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.16}
        strokeWidth={4}
      />
      <circle className={s.moduleVisuals__dial} cx={52} cy={32} r={15} />
    </svg>
  );
}

/* 9. Security — permission scope drawn as rings around a shut lock. */

const SCOPE_CHIPS = [
  { x: 14, y: 18, label: "Warehouse" },
  { x: 14, y: 100, label: "Franchise" },
  { x: 214, y: 59, label: "Brand" },
];

function SecurityVisual() {
  return (
    <svg className={s.moduleVisuals__svg} viewBox="0 0 300 140" aria-hidden="true">
      <circle
        className={s.moduleVisuals__scopeRing}
        cx={150}
        cy={66}
        r={30}
        style={V({ "--k": 2.2 })}
      />
      <circle
        className={s.moduleVisuals__scopeRing}
        cx={150}
        cy={66}
        r={44}
        style={V({ "--k": 3.4, "--dir": "reverse" })}
      />
      <circle
        className={s.moduleVisuals__scopeRing}
        cx={150}
        cy={66}
        r={58}
        style={V({ "--k": 4.8 })}
      />

      {SCOPE_CHIPS.map((chip, i) => (
        <g key={chip.label} className={s.moduleVisuals__scopeChip} style={V({ "--d": i * 0.14 })}>
          <rect className={s.moduleVisuals__soft} x={chip.x} y={chip.y} width={72} height={20} rx={10} />
          <rect className={s.moduleVisuals__frame} x={chip.x} y={chip.y} width={72} height={20} rx={10} />
          <circle className={s.moduleVisuals__solid} cx={chip.x + 12} cy={chip.y + 10} r={3} />
          <text
            x={chip.x + 21}
            y={chip.y + 13.5}
            fill="currentColor"
            fillOpacity={0.75}
            fontSize={8}
            fontWeight={750}
          >
            {chip.label}
          </text>
        </g>
      ))}

      <path className={s.moduleVisuals__shackle} d="M143 62v-7a7 7 0 0 1 14 0v7" />
      <rect className={s.moduleVisuals__solid} x={136} y={62} width={28} height={22} rx={6} />
      <circle cx={150} cy={71} r={2.6} fill="#fff" fillOpacity={0.85} />
      <rect x={149} y={72} width={2} height={6} rx={1} fill="#fff" fillOpacity={0.85} />
    </svg>
  );
}

function StandardModuleVisual() {
  return (
    <svg className={s.moduleVisuals__svg} viewBox="0 0 300 140" aria-hidden="true">
      <rect className={s.moduleVisuals__frame} x={40} y={20} width={220} height={100} rx={10} />
      <line className={s.moduleVisuals__hair} x1={40} y1={50} x2={260} y2={50} />
      <line className={s.moduleVisuals__hair} x1={40} y1={80} x2={260} y2={80} />
      <circle className={s.moduleVisuals__solid} cx={60} cy={35} r={4} />
      <rect className={s.moduleVisuals__soft} x={75} y={30} width={60} height={10} rx={4} />
      <rect className={s.moduleVisuals__soft} x={180} y={30} width={60} height={10} rx={4} />
      <circle className={s.moduleVisuals__solid} cx={60} cy={65} r={4} />
      <rect className={s.moduleVisuals__soft} x={75} y={60} width={80} height={10} rx={4} />
      <rect className={s.moduleVisuals__soft} x={200} y={60} width={40} height={10} rx={4} />
      <circle className={s.moduleVisuals__solid} cx={60} cy={95} r={4} />
      <rect className={s.moduleVisuals__soft} x={75} y={90} width={50} height={10} rx={4} />
      <rect className={s.moduleVisuals__soft} x={160} y={90} width={80} height={10} rx={4} />
    </svg>
  );
}

const VISUALS: Record<string, () => React.JSX.Element> = {
  inventory: InventoryVisual,
  procurement: ProcurementVisual,
  "sales-pos": SalesVisual,
  wholesale: WholesaleVisual,
  franchise: FranchiseVisual,
  accounting: AccountingVisual,
  ecommerce: EcommerceVisual,
  analytics: AnalyticsVisual,
  security: SecurityVisual,
};

export function ModuleVisual({ slug }: { slug: string }) {
  const Visual = VISUALS[slug] || StandardModuleVisual;
  return (
    <span className={s.moduleVisuals__stage} aria-hidden="true">
      <Visual />
    </span>
  );
}
