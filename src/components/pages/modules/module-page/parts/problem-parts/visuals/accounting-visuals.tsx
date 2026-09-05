import {
  Card,
  Drift,
  Flow,
  Mark,
  Note,
  Stage,
  Tag,
  Ticks,
} from "../visual-kit";

/** Accounting — transaction · ledger · report. */

/** The operation runs live; the books start once it is already over. */
export function PeriodRelayVisual() {
  return (
    <Stage>
      <Note x={22} y={36} text="operations" step={0} />
      <Flow d="M 22 62 L 298 62" step={0.6} />
      <Ticks x={36} y={52} count={10} gap={26} height={20} step={1} />
      <Tag
        x={160}
        y={84}
        text="month-end export"
        anchor="middle"
        tone="warn"
        step={2.2}
      />
      <Flow d="M 160 104 L 160 118" dashed step={2.6} />
      <Note x={100} y={134} text="books" step={2.8} />
      <Flow d="M 100 152 L 298 152" step={3} />
      <Ticks x={114} y={142} count={7} gap={26} height={20} step={3.2} />
      <Note x={298} y={180} text="always describing a closed period" anchor="end" step={3.8} />
    </Stage>
  );
}

/** A transaction becomes a figure, and drops everything that explained it. */
export function ContextStrippedVisual() {
  return (
    <Stage>
      <Card
        x={16}
        y={28}
        w={124}
        title="Transaction"
        note="piece · counter"
        step={0}
      />
      <Flow d="M 140 53 L 182 53" step={1.4} />
      <Card
        x={182}
        y={28}
        w={122}
        title="Ledger line"
        note="₹ figure only"
        tone="warn"
        step={1.8}
      />
      <Drift dy={44} step={2.4}>
        <Tag x={16} y={86} text="piece" step={2.4} />
      </Drift>
      <Drift dy={56} step={2.6}>
        <Tag x={76} y={86} text="counter" step={2.6} />
      </Drift>
      <Drift dy={48} step={2.8}>
        <Tag x={146} y={86} text="outlet" step={2.8} />
      </Drift>
      <Mark x={243} y={110} glyph="?" tone="ghost" step={3.2} />
      <Note x={243} y={150} text="every question is a search" anchor="middle" step={3.6} />
    </Stage>
  );
}

/** Each entity closes its own books; the group is a quarterly assembly. */
export function EntitySplitVisual() {
  return (
    <Stage>
      <Card x={16} y={34} w={88} title="Entity" note="own books" step={0} />
      <Card x={116} y={34} w={88} title="Entity" note="own books" step={0.4} />
      <Card x={216} y={34} w={88} title="Entity" note="own books" step={0.8} />
      <Flow d="M 60 84 C 60 104, 104 100, 108 116" dashed step={1.6} />
      <Flow d="M 160 84 L 160 116" dashed step={1.8} />
      <Flow d="M 260 84 C 260 104, 216 100, 212 116" dashed step={2} />
      <Card
        x={94}
        y={128}
        w={132}
        title="Group view"
        tone="ghost"
        step={2.6}
      />
      <Tag
        x={160}
        y={168}
        text="once a quarter"
        anchor="middle"
        tone="warn"
        step={3.2}
      />
    </Stage>
  );
}
