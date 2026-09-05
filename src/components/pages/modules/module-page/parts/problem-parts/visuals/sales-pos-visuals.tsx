import {
  Card,
  Flow,
  Mark,
  Note,
  Stage,
  Tag,
  Ticks,
  Token,
} from "../visual-kit";

/** Sales & POS — counter · session · payment and return. */

/** One sale, entered once at the counter and again from a printout. */
export function DuplicateEntryVisual() {
  return (
    <Stage>
      <Card
        x={16}
        y={22}
        w={130}
        title="Bill"
        note="at the counter"
        tone="accent"
        step={0}
      />
      <Flow d="M 146 47 C 172 47, 150 98, 176 98" dashed step={1.4} />
      <Card
        x={176}
        y={74}
        w={128}
        title="Typed again"
        note="into stock, books"
        tone="warn"
        step={2}
      />
      <Tag x={240} y={132} text="next day" anchor="middle" tone="warn" step={2.6} />
      <Note
        x={160}
        y={176}
        text="one sale, entered twice"
        anchor="middle"
        step={3.2}
      />
    </Stage>
  );
}

/** Bills exist. The shift that would let somebody close them does not. */
export function SessionBoundaryVisual() {
  return (
    <Stage>
      <Note x={160} y={38} text="one continuous day" anchor="middle" step={0} />
      <Flow d="M 22 84 L 298 84" step={0.6} />
      <Ticks x={36} y={72} count={9} gap={29} height={24} step={1} />
      <Card
        x={18}
        y={128}
        w={120}
        title="Cash counted"
        note="against the day"
        tone="warn"
        step={2.6}
      />
      <Mark x={160} y={153} glyph="?" tone="ghost" step={3.2} />
      <Card
        x={182}
        y={128}
        w={120}
        title="No session"
        note="nothing to close"
        tone="ghost"
        step={2.9}
      />
    </Stage>
  );
}

/** A piece comes back with nothing tying it to the bill that released it. */
export function ReturnOrphanVisual() {
  return (
    <Stage>
      <Card
        x={18}
        y={26}
        w={124}
        title="Bill"
        note="reads complete"
        step={0}
      />
      <Card
        x={178}
        y={26}
        w={124}
        title="Return"
        note="fresh quantity"
        tone="warn"
        step={0.6}
      />
      <Flow d="M 142 51 L 152 51" dashed step={1.4} />
      <Flow d="M 168 51 L 178 51" dashed step={1.6} />
      <Mark x={160} y={51} glyph="✕" step={2} />
      <Note x={160} y={100} text="one piece" anchor="middle" step={2.4} />
      <Token x={129} y={112} size={20} step={2.8} />
      <Token x={171} y={112} size={20} tone="warn" step={3} />
      <Tag
        x={160}
        y={150}
        text="two records, both believed"
        anchor="middle"
        tone="warn"
        step={3.4}
      />
    </Stage>
  );
}
