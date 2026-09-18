/**
 * The composition's coordinate system.
 *
 * Everything on the hero stage — the product screen, the five cards, the five
 * connectors and their end markers — is placed against ONE normalised space
 * `W` wide and `H` tall. The stage element is `min(W px, 100%)` wide and
 * exactly `H` tall, so:
 *
 *   • x and width are percentages of the stage width, and scale with it;
 *   • y and height are pixels, and do not scale;
 *   • the connector SVG uses these same numbers as its viewBox.
 *
 * That is the point of this file. The wires cannot drift away from the boxes
 * they join, because both are read from the same constants rather than
 * measured after the browser has laid the page out.
 *
 * Because widths are percentages, the right-hand card's left edge plus its
 * width comes to exactly 100% at every stage width — the composition can
 * never push a card past the container.
 */

/** The composition's design width. The stage never exceeds this. */
export const W = 1460;
/** Its height, including the card that sits under the screen. */
export const H = 560;

/** One card box, shared by all five. */
export const CARD_W = 250;
export const CARD_H = 118;

/**
 * The product screen. It is the hero's focal point and is deliberately far
 * larger than any card: at a 1440px viewport this lands at ~724x320, with the
 * cards at ~246 wide, so the screen reads as the thing the cards describe.
 */
export const SCREEN_W = 880;
export const SCREEN_H = 390;
export const SCREEN_X = (W - SCREEN_W) / 2; // 290
export const SCREEN_Y = 28;
export const SCREEN_RIGHT = SCREEN_X + SCREEN_W; // 1170
export const SCREEN_BOTTOM = SCREEN_Y + SCREEN_H; // 418

/**
 * Card top edges.
 *
 * The two rows are placed symmetrically about the screen's vertical centre
 * (188), each row's centre sitting 101px from it. That symmetry is what makes
 * the four outer cards equidistant from the screen — they already share the
 * same horizontal offset, so equal vertical offsets settle it. The fifth card
 * sits a short connector below the screen's bottom edge, close enough to read
 * as attached rather than stranded.
 */
export const TOP_ROW_Y = 28; // centre 87 = 188 - 101
export const LOW_ROW_Y = 300;
export const TAIL_Y = SCREEN_BOTTOM + 24; // 442

export type Slot =
  "top-left" | "top-right" | "bottom-left" | "bottom-right" | "bottom-center";

/** Where each card's box sits in the normalised space. */
export const CARD_BOX: Record<Slot, { x: number; y: number }> = {
  "top-left": { x: 0, y: TOP_ROW_Y },
  "top-right": { x: W - CARD_W, y: TOP_ROW_Y },
  "bottom-left": { x: 0, y: LOW_ROW_Y },
  "bottom-right": { x: W - CARD_W, y: LOW_ROW_Y },
  "bottom-center": { x: (W - CARD_W) / 2, y: TAIL_Y },
};

export type Connector = {
  slot: Slot;
  /** Cubic path in the normalised space. */
  d: string;
  /** Marker on the card edge. */
  from: { x: number; y: number };
  /** Marker on the screen edge. */
  to: { x: number; y: number };
};

const topCardMid = TOP_ROW_Y + CARD_H / 2; // 87
const lowCardMid = LOW_ROW_Y + CARD_H / 2; // 289
/* Each connector meets the screen at exactly its own card's centre line, so
   all four runs are level: they cross only the empty lane between the card
   and the screen, and can never pass through a card's text. Both entry points
   fall inside the screen's vertical span (28..348), so no wire ends in air. */
const topEnterY = topCardMid;
const lowEnterY = lowCardMid;

/**
 * The five connectors: four gentle elbows into the screen's side edges and
 * one straight drop to the card beneath it. Every path starts exactly on a
 * card edge and ends exactly on a screen edge, so none can terminate mid-air
 * and none crosses a card's text — the runs live entirely in the empty lanes
 * between the cards and the screen.
 */
export const CONNECTORS: readonly Connector[] = [
  {
    slot: "top-left",
    from: { x: CARD_W, y: topCardMid },
    to: { x: SCREEN_X, y: topEnterY },
    d: `M ${CARD_W} ${topCardMid} C ${CARD_W + 46} ${topCardMid}, ${SCREEN_X - 46} ${topEnterY}, ${SCREEN_X} ${topEnterY}`,
  },
  {
    slot: "top-right",
    from: { x: W - CARD_W, y: topCardMid },
    to: { x: SCREEN_RIGHT, y: topEnterY },
    d: `M ${W - CARD_W} ${topCardMid} C ${W - CARD_W - 46} ${topCardMid}, ${SCREEN_RIGHT + 46} ${topEnterY}, ${SCREEN_RIGHT} ${topEnterY}`,
  },
  {
    slot: "bottom-left",
    from: { x: CARD_W, y: lowCardMid },
    to: { x: SCREEN_X, y: lowEnterY },
    d: `M ${CARD_W} ${lowCardMid} C ${CARD_W + 46} ${lowCardMid}, ${SCREEN_X - 46} ${lowEnterY}, ${SCREEN_X} ${lowEnterY}`,
  },
  {
    slot: "bottom-right",
    from: { x: W - CARD_W, y: lowCardMid },
    to: { x: SCREEN_RIGHT, y: lowEnterY },
    d: `M ${W - CARD_W} ${lowCardMid} C ${W - CARD_W - 46} ${lowCardMid}, ${SCREEN_RIGHT + 46} ${lowEnterY}, ${SCREEN_RIGHT} ${lowEnterY}`,
  },
  {
    slot: "bottom-center",
    from: { x: W / 2, y: SCREEN_BOTTOM },
    to: { x: W / 2, y: TAIL_Y },
    d: `M ${W / 2} ${SCREEN_BOTTOM} L ${W / 2} ${TAIL_Y}`,
  },
];

/** A normalised x (or width) as a percentage string, for inline placement. */
export const pctX = (x: number) => `${((x / W) * 100).toFixed(4)}%`;
