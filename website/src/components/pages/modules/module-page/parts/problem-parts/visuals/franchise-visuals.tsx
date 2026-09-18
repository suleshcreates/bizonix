import {
  Boundary,
  Card,
  Drift,
  Flow,
  Note,
  Stage,
  Tag,
  Token,
} from "../visual-kit";

/** Franchise — head office · allocation · outlet. */

/** The network reports upward as a summary, once the month is over. */
export function OffSystemOutletVisual() {
  return (
    <Stage>
      <Card
        x={106}
        y={20}
        w={108}
        title="Head office"
        tone="accent"
        step={0}
      />
      <Flow d="M 160 52 C 160 82, 64 92, 64 122" dashed step={1.4} />
      <Flow d="M 160 52 L 160 122" dashed step={1.6} />
      <Flow d="M 160 52 C 160 82, 256 92, 256 122" dashed step={1.8} />
      <Tag
        x={160}
        y={78}
        text="month-end summary"
        anchor="middle"
        tone="warn"
        step={2.2}
      />
      <Card x={16} y={122} w={96} title="Outlet" step={2.6} />
      <Card x={112} y={122} w={96} title="Outlet" step={2.8} />
      <Card x={208} y={122} w={96} title="Outlet" step={3} />
      <Note
        x={160}
        y={176}
        text="each on whatever it already had"
        anchor="middle"
        step={3.4}
      />
    </Stage>
  );
}

/** Between dispatch and receipt the goods sit in nobody's record. */
export function TransferLimboVisual() {
  return (
    <Stage>
      <Note
        x={160}
        y={34}
        text="no document holds both numbers"
        anchor="middle"
        step={0}
      />
      <Card
        x={16}
        y={80}
        w={104}
        title="Warehouse"
        note="sent 48"
        step={0.8}
      />
      <Card
        x={200}
        y={80}
        w={104}
        title="Outlet"
        note="received 44"
        tone="warn"
        step={1.2}
      />
      <Boundary x={132} y={74} w={56} h={58} step={1.8} />
      <Flow d="M 120 102 L 130 102" dashed step={2.2} />
      <Flow d="M 190 102 L 200 102" dashed step={2.4} />
      <Token x={150} y={93} size={20} tone="warn" step={2.8} />
      <Note x={160} y={158} text="belongs to nobody" anchor="middle" step={3.2} />
    </Stage>
  );
}

/** Access has two settings: see nothing, or change everything. */
export function AccessOverreachVisual() {
  return (
    <Stage>
      <Note
        x={160}
        y={34}
        text="one switch, two positions"
        anchor="middle"
        step={0}
      />
      <Flow d="M 36 84 L 284 84" step={0.8} />
      <Boundary x={118} y={70} w={84} h={28} step={1.6} />
      <Note x={160} y={112} text="no position here" anchor="middle" step={2} />
      <Drift dx={228} step={2.6}>
        <Token x={30} y={75} size={18} tone="accent" step={2.6} />
      </Drift>
      <Card x={16} y={140} w={104} title="See nothing" tone="ghost" step={3} />
      <Card
        x={186}
        y={140}
        w={118}
        title="Change all"
        tone="warn"
        step={3.2}
      />
    </Stage>
  );
}
