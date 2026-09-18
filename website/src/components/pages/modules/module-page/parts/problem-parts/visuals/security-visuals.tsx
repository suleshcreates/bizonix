import {
  Bar,
  Boundary,
  Card,
  Flow,
  Mark,
  Note,
  Stage,
  Tag,
  Token,
  TokenRow,
} from "../visual-kit";

/** Security — user · role · entity. */

/** Rights are easier to widen than to shape, so they only ever widen. */
export function PermissionCreepVisual() {
  return (
    <Stage>
      <Tag x={24} y={30} text="counter staff" step={0} />
      <Bar x={24} y={56} w={256} fill={0.28} step={0.6} />
      <Tag x={24} y={80} text="supervisor" step={1.2} />
      <Bar x={24} y={106} w={256} fill={0.62} step={1.8} />
      <Tag x={24} y={130} text="everyone else" tone="warn" step={2.4} />
      <Bar x={24} y={156} w={256} fill={1} tone="warn" step={3} />
      <Note x={280} y={182} text="granted, never shaped" anchor="end" step={3.6} />
    </Stage>
  );
}

/** With no entity boundary, being on the platform means seeing all of it. */
export function AbsentBoundaryVisual() {
  return (
    <Stage>
      <Boundary x={16} y={44} w={130} h={104} label="Entity" step={0} />
      <Boundary x={174} y={44} w={130} h={104} label="Entity" step={0.4} />
      <Flow d="M 160 44 L 160 70" dashed step={1.2} />
      <Flow d="M 160 122 L 160 148" dashed step={1.4} />
      <Token x={36} y={76} size={20} tone="accent" step={1.8} />
      <Note x={36} y={116} text="a partner" step={2} />
      <TokenRow x={196} y={76} count={3} size={16} gap={8} tone="ghost" step={2.4} />
      <Note x={196} y={116} text="not theirs" step={2.6} />
      <Flow d="M 58 86 L 194 86" tone="warn" width={1.7} step={3} />
      <Tag
        x={160}
        y={166}
        text="reads the outlet next door"
        anchor="middle"
        tone="warn"
        step={3.4}
      />
    </Stage>
  );
}

/** The change is recorded. The person who made it is not. */
export function UnattributedChangeVisual() {
  return (
    <Stage>
      <Card x={24} y={30} w={110} title="Price" note="was" step={0} />
      <Card
        x={186}
        y={30}
        w={110}
        title="Price"
        note="now"
        tone="warn"
        step={0.6}
      />
      <Flow d="M 134 55 L 186 55" step={1.4} />
      <Flow d="M 160 78 L 160 100" dashed step={2} />
      <Mark x={160} y={126} glyph="?" tone="ghost" r={22} step={2.6} />
      <Note x={160} y={172} text="who · when · why" anchor="middle" step={3.2} />
    </Stage>
  );
}
