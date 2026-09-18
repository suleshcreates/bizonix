import {
  Card,
  Flow,
  Mark,
  Note,
  Stage,
  Tag,
  Token,
  TokenRow,
} from "../visual-kit";

/** Wholesale — order · fulfilment · dispatch and credit. */

/** One order leaves in parts, and the remainder falls out of the system. */
export function PartialShipmentVisual() {
  return (
    <Stage>
      <Card
        x={16}
        y={72}
        w={100}
        title="Order"
        note="one buyer"
        tone="accent"
        step={0}
      />
      <Flow d="M 116 86 C 148 86, 150 52, 176 52" step={1.2} />
      <Flow d="M 116 98 C 148 98, 150 104, 176 104" step={1.5} />
      <Flow d="M 116 110 C 148 110, 150 160, 176 160" dashed step={1.9} />
      <Token x={176} y={42} size={20} step={2} />
      <Note x={204} y={57} text="shipped" step={2.2} />
      <Token x={176} y={94} size={20} step={2.4} />
      <Note x={204} y={109} text="shipped" step={2.6} />
      <Card
        x={176}
        y={144}
        w={126}
        title="Still owed"
        tone="ghost"
        step={3}
      />
      <Note
        x={239}
        y={182}
        text="a side file, one laptop"
        anchor="middle"
        step={3.4}
      />
    </Stage>
  );
}

/** The list is frozen. The stock underneath it is not. */
export function StalePickVisual() {
  return (
    <Stage>
      <Card
        x={16}
        y={24}
        w={104}
        title="Printed list"
        note="frozen"
        tone="ghost"
        step={0}
      />
      <TokenRow x={24} y={102} count={4} size={18} gap={8} step={0.8} />
      <Note x={24} y={144} text="stock kept moving" step={1.6} />
      <Card x={192} y={26} w={106} title="Order A" step={1.2} />
      <Card x={192} y={72} w={106} title="Order B" step={1.5} />
      <Flow d="M 192 42 C 162 42, 152 100, 132 108" step={2.1} />
      <Flow d="M 192 88 C 168 88, 152 106, 132 113" step={2.4} />
      <Mark x={144} y={111} glyph="✕" r={14} step={2.9} />
      <Tag
        x={238}
        y={140}
        text="the same forty"
        anchor="middle"
        tone="warn"
        step={3.3}
      />
    </Stage>
  );
}

/** Three files hold a buyer's account, so the exposure is an opinion. */
export function CreditScatterVisual() {
  return (
    <Stage>
      <Tag
        x={160}
        y={26}
        text="three separate files"
        anchor="middle"
        tone="ghost"
        step={0}
      />
      <Note x={67} y={76} text="billed" anchor="middle" step={0.8} />
      <Note x={162} y={76} text="returned" anchor="middle" step={1} />
      <Note x={249} y={76} text="received" anchor="middle" step={1.2} />
      <Flow d="M 24 92 L 110 92" step={1.6} />
      <Flow d="M 124 92 L 200 92" step={1.9} />
      <Flow d="M 214 92 L 284 92" step={2.2} />
      <Card
        x={78}
        y={128}
        w={126}
        title="The balance"
        tone="ghost"
        step={2.8}
      />
      <Mark x={232} y={144} glyph="?" tone="ghost" step={3.2} />
      <Note
        x={160}
        y={180}
        text="assembled before every call"
        anchor="middle"
        step={3.6}
      />
    </Stage>
  );
}
