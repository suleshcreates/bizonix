import { Card, Flow, Mark, Note, Stage, Tag } from "../visual-kit";

/** Analytics — data · signal · decision. */

/** Several exports, joined by hand, producing more than one answer. */
export function AssembledReportVisual() {
  return (
    <Stage>
      <Card x={14} y={20} w={88} title="Sales" step={0} />
      <Card x={14} y={64} w={88} title="Stock" step={0.3} />
      <Card x={14} y={108} w={88} title="Purchases" step={0.6} />
      <Flow d="M 102 36 C 118 36, 118 76, 132 80" dashed step={1.4} />
      <Flow d="M 102 80 L 132 84" dashed step={1.6} />
      <Flow d="M 102 124 C 118 124, 118 92, 132 88" dashed step={1.8} />
      <Card
        x={132}
        y={62}
        w={96}
        title="Spreadsheet"
        note="joined by hand"
        tone="warn"
        step={2.2}
      />
      <Flow d="M 228 76 C 234 76, 232 60, 238 58" step={2.8} />
      <Flow d="M 228 92 C 234 92, 232 122, 238 126" step={3} />
      <Tag x={238} y={48} text="version 1" step={3.2} />
      <Tag x={238} y={118} text="version 2" step={3.4} />
      <Mark x={272} y={88} glyph="≠" r={14} step={3.8} />
    </Stage>
  );
}

/** The total is the end of the road; the question has nowhere to go. */
export function DeadEndNumberVisual() {
  return (
    <Stage>
      <Card
        x={86}
        y={24}
        w={148}
        title="Total for the week"
        tone="accent"
        step={0}
      />
      <Flow d="M 160 56 L 160 92" step={1.2} />
      <Note x={176} y={82} text="why?" step={1.6} />
      <Flow d="M 64 102 L 256 102" tone="warn" width={3} step={2.2} />
      <Note x={160} y={132} text="nothing behind it" anchor="middle" step={2.8} />
      <Mark x={160} y={158} glyph="?" tone="ghost" step={3.2} />
    </Stage>
  );
}

/** Every outlet reports on itself, and no line reads them together. */
export function UnreadableNetworkVisual() {
  return (
    <Stage>
      <Flow d="M 12 36 L 118 36" dashed step={0} />
      <Flow d="M 202 36 L 308 36" dashed step={0.2} />
      <Flow d="M 12 36 L 12 138" dashed step={0.4} />
      <Flow d="M 308 36 L 308 138" dashed step={0.6} />
      <Mark x={160} y={36} glyph="?" tone="ghost" r={14} step={1.2} />
      <Card x={26} y={58} w={84} title="Outlet" note="own report" step={1.8} />
      <Card x={118} y={58} w={84} title="Outlet" note="own report" step={2} />
      <Card x={210} y={58} w={84} title="Outlet" note="own report" step={2.2} />
      <Note
        x={160}
        y={166}
        text="nothing reads them together"
        anchor="middle"
        step={3}
      />
    </Stage>
  );
}
