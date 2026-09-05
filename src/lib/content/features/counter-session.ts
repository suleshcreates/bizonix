/**
 * Product-view data for the counter-session state machine on /features.
 *
 * Deliberately numbers-only: nothing here is a pre-summed total or a
 * formatted string. `Expected in drawer`, `Variance` and every "can this
 * session close" verdict are arithmetic performed at render time from these
 * inputs, so the panel on screen is doing the reconciliation rather than
 * reciting it. Change `counted` and the whole section re-reasons.
 */

export type SessionStageKey =
  "assign" | "open" | "trade" | "handover" | "close";

export type SessionStage = {
  key: SessionStageKey;
  /** Rendered on the stepper marker (desktop) and in the compact readout. */
  label: string;
  /** One line under the stepper: what this stage is for. */
  note: string;
};

export const sessionStages: readonly SessionStage[] = [
  {
    key: "assign",
    label: "Assign",
    note: "A counter belongs to one named person for the length of a shift.",
  },
  {
    key: "open",
    label: "Open",
    note: "The session opens with a declared float, timestamped and locked.",
  },
  {
    key: "trade",
    label: "Bills & returns",
    note: "Every bill, return and payment mode is stamped with the session.",
  },
  {
    key: "handover",
    label: "Handover",
    note: "Counted cash is entered against what the session says it should hold.",
  },
  {
    key: "close",
    label: "Close",
    note: "A session only locks once the drawer agrees. Otherwise it stays open.",
  },
];

export type ScenarioKey = "balanced" | "variance";

export type Scenario = {
  key: ScenarioKey;
  /** Segmented-control label. */
  label: string;
  counter: string;
  operator: string;
  /** Paise-free rupees. Every derived figure comes from these five. */
  openingFloat: number;
  cashSales: number;
  returnsPaidOut: number;
  counted: number;
  bills: number;
  returns: number;
};

/**
 * One shift, two endings. The inputs are identical apart from `counted` —
 * which is the entire point: the only thing a handover can get wrong is the
 * cash actually in the hand.
 */
export const scenarios: Record<ScenarioKey, Scenario> = {
  balanced: {
    key: "balanced",
    label: "Balanced close",
    counter: "Counter 2",
    operator: "Meera S.",
    openingFloat: 2000,
    cashSales: 41350,
    returnsPaidOut: 1900,
    counted: 41450,
    bills: 48,
    returns: 3,
  },
  variance: {
    key: "variance",
    label: "Short drawer",
    counter: "Counter 2",
    operator: "Meera S.",
    openingFloat: 2000,
    cashSales: 41350,
    returnsPaidOut: 1900,
    counted: 41300,
    bills: 48,
    returns: 3,
  },
};

export type FloorCounter = {
  counter: string;
  operator: string;
  bills: number;
  state: string;
};

/**
 * The two counters either side of the one being demonstrated. Static context —
 * counter 2 is built from the live state machine, not from this list.
 */
export const floorCounters: readonly FloorCounter[] = [
  { counter: "Counter 1", operator: "Anil K.", bills: 62, state: "Open" },
  { counter: "Counter 3", operator: "Unassigned", bills: 0, state: "Closed" },
];
