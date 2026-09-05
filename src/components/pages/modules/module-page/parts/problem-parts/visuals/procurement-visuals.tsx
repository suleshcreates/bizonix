import { Bar, Card, Flow, Mark, Note, Reading, Stage, Tag } from "../visual-kit";

/** Procurement — purchase · receiving · supplier context. */

/** What was agreed and what arrived, with nothing left holding the gap. */
export function OrderReceiptDriftVisual() {
  return (
    <Stage>
      <Reading x={26} y={22} w={104} label="Ordered" value="120" step={0} />
      <Reading
        x={190}
        y={22}
        w={104}
        label="Received"
        value="108"
        tone="warn"
        step={0.6}
      />
      <Flow d="M 134 54 L 186 54" dashed step={1.6} />
      <Bar x={26} y={104} w={268} fill={0.9} step={2.2} />
      <Tag
        x={272}
        y={84}
        text="12 short"
        anchor="middle"
        tone="warn"
        step={2.8}
      />
      <Card
        x={86}
        y={134}
        w={148}
        title="No document"
        tone="ghost"
        step={3.2}
      />
      <Note x={160} y={182} text="the shelf has it either way" anchor="middle" step={3.6} />
    </Stage>
  );
}

/** The goods complete the journey. The rate they arrived at does not. */
export function CostDetachedVisual() {
  return (
    <Stage>
      <Card
        x={18}
        y={24}
        w={118}
        title="Purchase"
        note="rate captured"
        step={0}
      />
      <Card
        x={184}
        y={24}
        w={118}
        title="Stock"
        note="rate not carried"
        tone="warn"
        step={0.6}
      />
      <Note x={160} y={42} text="goods" anchor="middle" step={1.4} />
      <Flow d="M 136 51 L 184 51" step={1.8} />
      <Note x={30} y={116} text="cost" step={2.2} />
      <Flow d="M 60 118 L 146 118" dashed step={2.6} />
      <Mark x={163} y={118} glyph="✕" r={14} step={3} />
      <Card
        x={186}
        y={104}
        w={116}
        title="Never arrives"
        tone="ghost"
        step={3.3}
      />
      <Note
        x={160}
        y={172}
        text="margin becomes an average"
        anchor="middle"
        step={3.7}
      />
    </Stage>
  );
}

/** Three places hold a supplier. None of them holds the position. */
export function SupplierScatterVisual() {
  return (
    <Stage>
      <Card x={16} y={20} w={104} title="Purchases" step={0} />
      <Card x={16} y={74} w={104} title="Returns" step={0.4} />
      <Card x={16} y={128} w={104} title="Payments" step={0.8} />
      <Flow d="M 120 36 C 152 36, 150 90, 174 94" dashed step={1.6} />
      <Flow d="M 120 90 L 174 94" dashed step={1.9} />
      <Flow d="M 120 144 C 152 144, 150 98, 174 94" dashed step={2.2} />
      <Card
        x={196}
        y={72}
        w={106}
        title="Owed"
        note="assembled by hand"
        tone="ghost"
        step={2.8}
      />
      <Mark x={249} y={40} glyph="?" tone="ghost" step={3.2} />
      <Note
        x={249}
        y={150}
        text="rebuilt every time"
        anchor="middle"
        step={3.6}
      />
    </Stage>
  );
}
