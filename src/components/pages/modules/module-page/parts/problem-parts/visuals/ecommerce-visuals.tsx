import {
  Boundary,
  Card,
  Flow,
  Mark,
  Note,
  Stage,
  Tag,
  TokenRow,
} from "../visual-kit";

/** Ecommerce — catalogue · order · inventory. */

/** One product, maintained in two places, changed in one. */
export function DuplicateCatalogueVisual() {
  return (
    <Stage>
      <Card
        x={18}
        y={28}
        w={124}
        title="Shop floor"
        note="price updated"
        tone="accent"
        step={0}
      />
      <Card
        x={178}
        y={28}
        w={124}
        title="Website"
        note="price not"
        tone="warn"
        step={0.6}
      />
      <Mark x={160} y={53} glyph="≠" step={1.6} />
      <TokenRow x={30} y={110} count={3} size={18} gap={8} step={2.2} />
      <TokenRow x={190} y={110} count={3} size={18} gap={8} tone="ghost" step={2.6} />
      <Note
        x={160}
        y={168}
        text="one product, two records"
        anchor="middle"
        step={3.2}
      />
    </Stage>
  );
}

/** Between two syncs the storefront is confidently out of date. */
export function StaleAvailabilityVisual() {
  return (
    <Stage>
      <Tag x={60} y={30} text="last sync" anchor="middle" tone="accent" step={0} />
      <Tag x={250} y={30} text="next sync" anchor="middle" tone="accent" step={0.4} />
      <Flow d="M 24 76 L 296 76" step={1} />
      <Flow d="M 60 66 L 60 86" step={1.4} />
      <Flow d="M 250 66 L 250 86" step={1.6} />
      <Boundary x={72} y={100} w={166} h={54} step={2.2} />
      <Note x={155} y={122} text="the counter sells" anchor="middle" step={2.6} />
      <Note x={155} y={140} text="the site still offers it" anchor="middle" step={2.8} />
      <Mark x={268} y={127} glyph="≠" step={3.2} />
    </Stage>
  );
}

/** Web orders wait outside the operation for an import that runs once. */
export function BatchedOrdersVisual() {
  return (
    <Stage>
      <Boundary x={16} y={44} w={124} h={108} label="Web orders" step={0} />
      <TokenRow x={40} y={58} count={2} size={20} gap={8} step={0.8} />
      <TokenRow x={40} y={82} count={2} size={20} gap={8} step={1} />
      <TokenRow x={40} y={106} count={2} size={20} gap={8} step={1.2} />
      <TokenRow x={40} y={130} count={2} size={20} gap={8} step={1.4} />
      <Flow d="M 166 44 L 166 152" dashed tone="warn" width={1.7} step={2} />
      <Tag x={166} y={160} text="once a day" anchor="middle" tone="warn" step={2.4} />
      <Card x={196} y={58} w={106} title="Fulfilment" tone="ghost" step={2.8} />
      <Card x={196} y={110} w={106} title="Accounts" tone="ghost" step={3} />
      <Flow d="M 166 74 L 196 74" dashed step={3.2} />
      <Flow d="M 166 126 L 196 126" dashed step={3.4} />
    </Stage>
  );
}
