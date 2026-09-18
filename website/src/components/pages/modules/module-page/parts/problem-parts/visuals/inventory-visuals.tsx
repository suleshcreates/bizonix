import {
  Card,
  Flow,
  Mark,
  Note,
  Reading,
  Stage,
  Tag,
  Token,
} from "../visual-kit";

/**
 * Inventory — count · location · identity.
 *
 * Each diagram draws the failure the column describes and stops there. None of
 * them shows stock being fixed, and none of them imitates a product screen.
 */

/** Two honest counts of one rack, and nothing that can reconcile them. */
export function CountMismatchVisual() {
  return (
    <Stage>
      <Reading x={30} y={26} w={100} label="Floor count" value="38" step={0} />
      <Reading
        x={190}
        y={26}
        w={100}
        label="System"
        value="41"
        tone="warn"
        step={0.6}
      />
      <Flow d="M 132 58 L 144 58" step={1.6} />
      <Flow d="M 176 58 L 188 58" step={1.8} />
      <Mark x={160} y={58} glyph="≠" step={2.4} />
      <Note
        x={160}
        y={122}
        text="the difference is three pieces"
        anchor="middle"
        step={3}
      />
      <Mark x={128} y={150} glyph="?" tone="ghost" r={13} step={3.3} />
      <Mark x={160} y={150} glyph="?" tone="ghost" r={13} step={3.5} />
      <Mark x={192} y={150} glyph="?" tone="ghost" r={13} step={3.7} />
    </Stage>
  );
}

/** The stock exists. It exists one location away, unseen from the counter. */
export function LocationMismatchVisual() {
  return (
    <Stage>
      <Card
        x={18}
        y={28}
        w={124}
        title="Counter"
        note="0 available"
        tone="warn"
        step={0}
      />
      <Card
        x={178}
        y={104}
        w={124}
        title="Warehouse"
        note="40 on the shelf"
        tone="accent"
        step={0.8}
      />
      <Flow d="M 142 53 C 158 53, 158 74, 159 80" dashed step={1.8} />
      <Flow d="M 161 102 C 162 112, 164 129, 178 129" dashed step={2.6} />
      <Mark x={160} y={91} glyph="✕" step={2.2} />
      <Tag
        x={160}
        y={162}
        text="no line of sight"
        anchor="middle"
        tone="warn"
        step={3.2}
      />
    </Stage>
  );
}

/** One code shared across a style, so no piece can be placed afterwards. */
export function IdentityLossVisual() {
  return (
    <Stage>
      <Card x={100} y={20} w={120} title="One code" tone="accent" step={0} />
      <Flow d="M 160 52 C 160 70, 62 66, 62 82" step={1.2} />
      <Flow d="M 160 52 L 160 82" step={1.4} />
      <Flow d="M 160 52 C 160 70, 258 66, 258 82" step={1.6} />
      <Token x={52} y={82} size={20} step={2} />
      <Token x={150} y={82} size={20} step={2.2} />
      <Token x={248} y={82} size={20} step={2.4} />
      <Note x={62} y={126} text="which intake?" anchor="middle" step={2.8} />
      <Note x={160} y={126} text="what cost?" anchor="middle" step={3} />
      <Note x={258} y={126} text="which series?" anchor="middle" step={3.2} />
      <Tag
        x={160}
        y={148}
        text="nothing tells them apart"
        anchor="middle"
        tone="warn"
        step={3.6}
      />
    </Stage>
  );
}
