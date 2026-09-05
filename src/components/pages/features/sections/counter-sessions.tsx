"use client";

import { Check, Lock, ShieldAlert } from "lucide-react";
import {
  type CSSProperties,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  floorCounters,
  type ScenarioKey,
  scenarios,
  sessionStages,
} from "@/lib/content/features/counter-session";
import { featureSummaries } from "@/lib/content/features/features";
import { FeatureMark, RelatedModules } from "./feature-atoms";
import styles from "@/components/pages/features/features.module.css";

const feature = featureSummaries[1];
const LAST = sessionStages.length - 1;

/** One stage per beat; inside the 2.5-3s band the section is paced to. */
const STAGE_MS = 2800;
/** Idle gap after a click or keypress before the section takes itself back. */
const RESUME_MS = 8000;

/* ------------------------------------------------------------------ money */

/**
 * Indian digit grouping, written out rather than left to Intl so the server
 * and the client render byte-identical strings. Takes a magnitude; the sign is
 * the caller's business, because +, - and ± all read differently in a ledger.
 */
function inr(amount: number) {
  const digits = String(Math.round(Math.abs(amount)));
  if (digits.length <= 3) return `₹${digits}`;
  const tail = digits.slice(-3);
  const head = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `₹${head},${tail}`;
}

/* ------------------------------------------------------- the state machine */

type SessionState = { activeStage: number; scenario: ScenarioKey };

type MarkerState = "done" | "active" | "future" | "sealed" | "blocked";
type LaneTone = "idle" | "live" | "sealed" | "held";

/**
 * The single source of truth.
 *
 * Everything visible in this section — the stepper, the floor panel, the
 * reconciliation arithmetic, the verdict chip — is a pure function of
 * `{ activeStage, scenario }`. Nothing animates on its own clock, so the three
 * surfaces cannot drift out of step: they are three readings of one object,
 * taken in the same render.
 */
function derive({ activeStage: stage, scenario }: SessionState) {
  const session = scenarios[scenario];

  // A figure exists only once the stage that produces it has been reached.
  const openingFloat = stage >= 1 ? session.openingFloat : null;
  const cashSales = stage >= 2 ? session.cashSales : null;
  const returnsPaidOut = stage >= 2 ? session.returnsPaidOut : null;
  const counted = stage >= 3 ? session.counted : null;

  // Expected in drawer = opening float + cash sales - returns paid out.
  const expected =
    openingFloat === null
      ? null
      : openingFloat + (cashSales ?? 0) - (returnsPaidOut ?? 0);

  const variance =
    expected === null || counted === null ? null : counted - expected;

  const off = variance !== null && variance !== 0;
  const blocked = off && stage === LAST;
  const sealed = variance === 0 && stage === LAST;

  // The working, shown so the total reads as a sum and not as an assertion.
  const working =
    openingFloat === null
      ? null
      : cashSales === null
        ? inr(openingFloat)
        : `${inr(openingFloat)} + ${inr(cashSales)} − ${inr(returnsPaidOut ?? 0)}`;

  const varianceLabel =
    variance === null
      ? null
      : variance === 0
        ? inr(0)
        : `${variance < 0 ? "−" : "+"} ${inr(variance)}`;

  const gap =
    variance === null || variance === 0
      ? null
      : `${inr(variance)} ${variance < 0 ? "short" : "over"}`;

  const verdict: { tone: "pending" | "ok" | "bad"; text: string } = blocked
    ? { tone: "bad", text: `${gap} — session cannot close` }
    : sealed
      ? { tone: "ok", text: "Variance ₹0 — session closed and locked" }
      : off
        ? { tone: "bad", text: `${gap} — close is held` }
        : variance === 0
          ? { tone: "ok", text: "Variance ₹0 — cleared to close" }
          : { tone: "pending", text: "Reconciliation in progress" };

  // The counter under demonstration, read off the very same stage.
  const liveLane = {
    counter: session.counter,
    operator: session.operator,
    bills: stage >= 2 ? session.bills : 0,
    state: blocked
      ? "Held"
      : sealed
        ? "Closed"
        : stage === 0
          ? "Assigned"
          : stage === 1
            ? "Open"
            : stage === 2
              ? "Billing"
              : "Counting",
    tone: (blocked ? "held" : sealed ? "sealed" : "live") as LaneTone,
  };

  const lanes = [
    { ...floorCounters[0], tone: "idle" as LaneTone },
    liveLane,
    { ...floorCounters[1], tone: "idle" as LaneTone },
  ];

  const markers: MarkerState[] = sessionStages.map((_, index) => {
    if (index < stage) return "done";
    if (index > stage) return "future";
    if (index !== LAST) return "active";
    return blocked ? "blocked" : sealed ? "sealed" : "active";
  });

  // The rail can only reach Close when the drawer agrees. A held session stops
  // it one segment short, which is the entire argument of this section.
  const fill = (blocked ? LAST - 1 : stage) / LAST;

  return {
    session,
    stage,
    openingFloat,
    cashSales,
    returnsPaidOut,
    counted,
    expected,
    variance,
    varianceLabel,
    working,
    blocked,
    sealed,
    verdict,
    lanes,
    markers,
    fill,
  };
}

/* --------------------------------------------------------------- component */

/**
 * Feature 02 — a billing counter, shown as the shift it actually is.
 *
 * Replaces the earlier radial dial: a session is a sequence with a gate at the
 * end, and a left-to-right stepper says that at a glance where a wheel had to
 * be decoded. The two panels underneath are not illustrations of the stepper,
 * they are the same object rendered twice.
 */
export function CounterSessions() {
  const sectionRef = useRef<HTMLElement>(null);
  const markerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const resumeRef = useRef<number | undefined>(undefined);

  const [state, setState] = useState<SessionState>({
    activeStage: 0,
    scenario: "balanced",
  });
  const [autoplay, setAutoplay] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [keyboardIn, setKeyboardIn] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [reduced, setReduced] = useState(false);

  const view = useMemo(() => derive(state), [state]);
  const current = sessionStages[view.stage];

  /* Reduced motion: no loop at all, and the section opens on the state that
     carries the most information — a balanced session, closed. */
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReduced(query.matches);
      if (query.matches) setState({ activeStage: LAST, scenario: "balanced" });
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  /* Off screen, or in a background tab, the timer has nothing to say. */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setOnScreen(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(node);

    const onVisibility = () => {
      if (document.visibilityState === "hidden") setOnScreen(false);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  /* The loop. One interval, advancing the one object the whole UI reads. */
  useEffect(() => {
    if (reduced || !autoplay || hovered || keyboardIn || !onScreen) return;
    const id = window.setInterval(() => {
      setState((prev) => ({
        ...prev,
        activeStage: prev.activeStage >= LAST ? 0 : prev.activeStage + 1,
      }));
    }, STAGE_MS);
    return () => window.clearInterval(id);
  }, [reduced, autoplay, hovered, keyboardIn, onScreen]);

  useEffect(() => () => window.clearTimeout(resumeRef.current), []);

  /** Any deliberate interaction pauses the loop and arms the hand-back. */
  const takeOver = useCallback((next: (prev: SessionState) => SessionState) => {
    setState(next);
    setAutoplay(false);
    window.clearTimeout(resumeRef.current);
    resumeRef.current = window.setTimeout(() => setAutoplay(true), RESUME_MS);
  }, []);

  const onStageClick = useCallback(
    (index: number) => takeOver((prev) => ({ ...prev, activeStage: index })),
    [takeOver],
  );

  /* Both endings are shown at their verdict, so the toggle compares outcomes
     rather than starting points. */
  const chooseScenario = useCallback(
    (scenario: ScenarioKey) =>
      takeOver(() => ({ scenario, activeStage: LAST })),
    [takeOver],
  );

  /* Arrows step relative to the marker that actually has focus, not to the
     active stage — Tab can land you on one while the loop sits on another. */
  const onStepperKeyDown = useCallback(
    (event: KeyboardEvent<HTMLOListElement>) => {
      const from = markerRefs.current.indexOf(
        document.activeElement as HTMLButtonElement,
      );
      const anchor = from === -1 ? state.activeStage : from;
      const moves: Record<string, number> = {
        ArrowRight: anchor + 1,
        ArrowDown: anchor + 1,
        ArrowLeft: anchor - 1,
        ArrowUp: anchor - 1,
        Home: 0,
        End: LAST,
      };
      const target = moves[event.key];
      if (target === undefined) return;
      event.preventDefault();
      const next = Math.max(0, Math.min(LAST, target));
      onStageClick(next);
      markerRefs.current[next]?.focus();
    },
    [onStageClick, state.activeStage],
  );

  return (
    <section
      ref={sectionRef}
      id={feature.id}
      className={styles.counterSessions__section}
      style={{ "--accent": feature.accent } as CSSProperties}
      aria-labelledby="feature-counters-title"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      /* Only a keyboard landing holds the loop. A mouse click focuses the
         button too, and latching on that would mean the loop never came back
         for anyone who clicked once and left the pointer where it was. */
      onFocusCapture={(event) =>
        setKeyboardIn(event.target.matches(":focus-visible"))
      }
      onBlurCapture={() => setKeyboardIn(false)}
    >
      <span className={styles.counterSessions__aurora} aria-hidden="true" />
      <span className={styles.counterSessions__grid} aria-hidden="true" />

      <div className={styles.counterSessions__shell}>
        <header className={styles.counterSessions__head}>
          <div>
            <FeatureMark
              index={feature.index}
              discipline={feature.discipline}
              tone={feature.tone}
            />
            <h2 id="feature-counters-title">
              A counter that opens, closes and answers for its cash.
            </h2>
          </div>
          <p className={styles.counterSessions__why}>
            Retail cash goes missing in the gap between shifts — an unassigned
            till, a bill nobody owns, a handover done from memory. A session
            closes that gap: the counter belongs to a person, opens with a
            declared float, and cannot be locked until the drawer agrees with
            the day.
          </p>
        </header>

        <div className={styles.counterSessions__machine}>
          {/* ---------------------------------------------------- scenario */}
          <div className={styles.counterSessions__bar}>
            <p className={styles.counterSessions__barLede}>
              <span>Session {view.session.counter}</span>
              Same shift, two endings — pick the one the drawer hands you.
            </p>
            <div
              className={styles.counterSessions__switch}
              role="group"
              aria-label="Handover outcome"
            >
              {(Object.keys(scenarios) as ScenarioKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={styles.counterSessions__switchBtn}
                  data-on={state.scenario === key ? "true" : "false"}
                  aria-pressed={state.scenario === key}
                  onClick={() => chooseScenario(key)}
                >
                  {scenarios[key].label}
                </button>
              ))}
            </div>
          </div>

          {/* ----------------------------------------------------- stepper */}
          <div className={styles.counterSessions__stepperWrap}>
            <div
              className={styles.counterSessions__rail}
              style={{ "--fill": view.fill } as CSSProperties}
              data-blocked={view.blocked ? "true" : "false"}
              aria-hidden="true"
            >
              <span className={styles.counterSessions__railTrack} />
              <span className={styles.counterSessions__railFill} />
              <span className={styles.counterSessions__railHold} />
            </div>

            <ol
              className={styles.counterSessions__stepper}
              role="list"
              onKeyDown={onStepperKeyDown}
            >
              {sessionStages.map((item, index) => (
                <li
                  key={item.key}
                  className={styles.counterSessions__step}
                  data-state={view.markers[index]}
                >
                  <button
                    type="button"
                    ref={(node) => {
                      markerRefs.current[index] = node;
                    }}
                    className={styles.counterSessions__marker}
                    aria-current={index === view.stage ? "step" : undefined}
                    aria-label={`Stage ${index + 1} of ${sessionStages.length}: ${item.label}`}
                    onClick={() => onStageClick(index)}
                  >
                    <span className={styles.counterSessions__markerDot}>
                      {view.markers[index] === "done" ? (
                        <Check size={13} aria-hidden="true" />
                      ) : view.markers[index] === "sealed" ? (
                        <Lock size={12} aria-hidden="true" />
                      ) : view.markers[index] === "blocked" ? (
                        <ShieldAlert size={13} aria-hidden="true" />
                      ) : (
                        <i aria-hidden="true">{index + 1}</i>
                      )}
                    </span>
                    <span className={styles.counterSessions__markerLabel}>{item.label}</span>
                  </button>
                </li>
              ))}
            </ol>

            <p className={styles.counterSessions__stageNote}>
              <span className={styles.counterSessions__stageCount}>
                {view.stage + 1}/{sessionStages.length}
              </span>
              <span className={styles.counterSessions__stageCompact}>{current.label} —</span>
              {current.note}
            </p>
          </div>

          {/* ------------------------------------------------------ panels */}
          <div className={styles.counterSessions__panels}>
            <section
              className={styles.counterSessions__panel}
              aria-label="Counters on the floor"
            >
              <p className={styles.counterSessions__panelHead}>Counters on the floor</p>
              <div className={styles.counterSessions__panelBody}>
                <ul className={styles.counterSessions__lanes} aria-live="polite">
                  {view.lanes.map((lane) => (
                    <li key={lane.counter} data-tone={lane.tone}>
                      <span className={styles.counterSessions__laneName}>{lane.counter}</span>
                      <span className={styles.counterSessions__laneOperator}>
                        {lane.operator}
                      </span>
                      <span className={styles.counterSessions__laneBills}>
                        {lane.bills ? `${lane.bills} bills` : "—"}
                      </span>
                      <span className={styles.counterSessions__laneState}>
                        {lane.tone === "sealed" ? (
                          <Lock size={10} aria-hidden="true" />
                        ) : null}
                        {lane.tone === "held" ? (
                          <ShieldAlert size={10} aria-hidden="true" />
                        ) : null}
                        {lane.state}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className={styles.counterSessions__panelFoot}>
                  An unassigned counter cannot take a bill. There is always a
                  name behind a transaction.
                </p>
              </div>
            </section>

            <section
              className={styles.counterSessions__panel}
              aria-label="Handover reconciliation"
            >
              <p className={styles.counterSessions__panelHead}>
                Handover reconciliation
                <span>
                  {view.session.counter} · {view.session.operator}
                </span>
              </p>

              <dl className={styles.counterSessions__ledger} aria-live="polite">
                <div
                  className={styles.counterSessions__row}
                  data-filled={view.openingFloat !== null}
                >
                  <dt>Opening float</dt>
                  <dd>
                    {view.openingFloat === null
                      ? "—"
                      : `+ ${inr(view.openingFloat)}`}
                  </dd>
                </div>

                <div
                  className={styles.counterSessions__row}
                  data-filled={view.cashSales !== null}
                >
                  <dt>
                    Cash sales
                    {view.cashSales === null
                      ? ""
                      : ` · ${view.session.bills} bills`}
                  </dt>
                  <dd>
                    {view.cashSales === null ? "—" : `+ ${inr(view.cashSales)}`}
                  </dd>
                </div>

                <div
                  className={styles.counterSessions__row}
                  data-filled={view.returnsPaidOut !== null}
                >
                  <dt>
                    Returns paid out
                    {view.returnsPaidOut === null
                      ? ""
                      : ` · ${view.session.returns} returns`}
                  </dt>
                  <dd>
                    {view.returnsPaidOut === null
                      ? "—"
                      : `− ${inr(view.returnsPaidOut)}`}
                  </dd>
                </div>

                <div
                  className={`${styles.counterSessions__row} ${styles.counterSessions__rowTotal}`}
                  data-filled={view.expected !== null}
                >
                  <dt>Expected in drawer</dt>
                  <dd>{view.expected === null ? "—" : inr(view.expected)}</dd>
                </div>

                <p className={styles.counterSessions__working}>
                  {view.working
                    ? `${view.working} = `
                    : "awaiting the opening float"}
                  {view.expected === null ? null : <b>{inr(view.expected)}</b>}
                </p>

                <div className={styles.counterSessions__row} data-filled={view.counted !== null}>
                  <dt>Counted at handover</dt>
                  <dd>{view.counted === null ? "—" : inr(view.counted)}</dd>
                </div>

                <div
                  className={`${styles.counterSessions__row} ${styles.counterSessions__rowVariance}`}
                  data-filled={view.variance !== null}
                  data-off={view.variance ? "true" : "false"}
                >
                  <dt>Variance</dt>
                  <dd>{view.varianceLabel ?? "—"}</dd>
                </div>
              </dl>

              <p className={styles.counterSessions__verdict} data-tone={view.verdict.tone}>
                {view.verdict.tone === "ok" ? (
                  <Check size={14} aria-hidden="true" />
                ) : null}
                {view.verdict.tone === "bad" ? (
                  <ShieldAlert size={14} aria-hidden="true" />
                ) : null}
                {view.verdict.text}
              </p>
            </section>
          </div>
        </div>

        <RelatedModules id={feature.id} tone={feature.tone} />
      </div>
    </section>
  );
}
