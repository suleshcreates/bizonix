"use client";

import { gsap } from "gsap";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  consoleAriaLabel,
  consoleStates,
  type ConsoleStateId,
} from "@/lib/content/home/home-hero-console-data";
import {
  BillingScreen,
  FinanceScreen,
  TransfersScreen,
} from "./console-screens";
import styles from "@/components/pages/home/home.module.css";
import { StockConsole } from "./stock-console";
import { useHeroStageMeasure } from "./hero-measure";

/**
 * Centered, front-facing product stage for the home hero.
 *
 * Choreography (GSAP owns all continuous visual interpolation; React state
 * stays semantic — active state, autoplay flag, user-interaction flag):
 *   - entrance: opacity 0→1, scale 0.985→1, y 20→0 over ~0.75s
 *   - ambient:  scale 1→1.006, ~20s linear yoyo, infinite (subtle breathing)
 *   - states:   Inventory → Billing → Transfers → Finance, ~4.6s dwell,
 *               ~0.6s crossfade, pausing for the user, for hidden tabs and
 *               for prefers-reduced-motion.
 *
 * Only the active screen and the departing screen are mounted at any time —
 * never all four trees (spec §19).
 */

/** How long a state stays on stage before autoplay advances (spec: 4–5s). */
const STATE_DWELL_SECONDS = 4.6;

/** How long the user must stay idle before autoplay resumes (spec: ~2s). */
const RESUME_DELAY_MS = 2000;

/** Entrance easing (spec §26). */
const ENTRANCE_EASE = "power3.out";

const NEXT_STATE: Record<ConsoleStateId, ConsoleStateId> = {
  inventory: "billing",
  billing: "transfers",
  transfers: "finance",
  finance: "inventory",
};

const SCREEN_ARIA: Record<ConsoleStateId, string> = {
  inventory: consoleAriaLabel,
  billing:
    "A Bizonix tax invoice for Shree Fashion House with HSN line items and CGST plus SGST summary. All figures shown are illustrative demo data.",
  transfers:
    "Bizonix transfer consignment TRF-1184 from the Bhiwandi warehouse to the Kalyan franchise outlet, with checkpoints from request to books updated. All figures shown are illustrative demo data.",
  finance:
    "Bizonix books view with GST summary and posted entries for purchases, sales and transfers. All figures shown are illustrative demo data.",
};


export function ProductStage() {
  const [active, setActive] = useState<ConsoleStateId>("inventory");
  const [leaving, setLeaving] = useState<ConsoleStateId | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  /** True while the pointer/focus is over the rail (spec §23). */
  const isUserInteractingRef = useRef(false);
  const resumeTimerRef = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLDivElement>(null);
  const breatheRef = useRef<HTMLDivElement>(null);

  const activeRef = useRef(active);

  const autoRef = useRef(isAutoPlaying);
  useLayoutEffect(() => {
    activeRef.current = active;
    autoRef.current = isAutoPlaying;
  }, [active, isAutoPlaying]);

  useHeroStageMeasure(stageRef, {
    active,
    isAutoPlaying,
    isUserInteracting: isUserInteractingRef,
  });

  /* ------------------------------------------------- reduced-motion listener */
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const reduced = query.matches;
      setReducedMotion(reduced);
      if (reduced) {
        // Stop the loop instantly; keep the static Inventory screen usable.
        setIsAutoPlaying(false);
        if (resumeTimerRef.current !== null) window.clearTimeout(resumeTimerRef.current);
      }
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  /* ------------------------------------------------------- autoplay plumbing */
  const pauseAutoplay = useCallback(() => {
    setIsAutoPlaying(false);
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  /** Resume only if the user is no longer interacting (never mid-hover). */
  const resumeAutoplaySoon = useCallback((delayMs: number) => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = window.setTimeout(() => {
      resumeTimerRef.current = null;
      if (!isUserInteractingRef.current) {
        setIsAutoPlaying(true);
      }
    }, delayMs);
  }, []);

  /* The loop itself: one GSAP delayed call per dwell, re-armed whenever the
     active state, the autoplay flag, or the motion preference changes. */
  useEffect(() => {
    if (!isAutoPlaying || reducedMotion) return;
    const call = gsap.delayedCall(STATE_DWELL_SECONDS, () => {
      setActive((current) => NEXT_STATE[current]);
    });
    return () => {
      call.kill();
    };
  }, [isAutoPlaying, active, reducedMotion]);

  /* --------------------------------------------------- page visibility (§24) */
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        pauseAutoplay();
      } else if (!isUserInteractingRef.current && !reducedMotion) {
        resumeAutoplaySoon(0);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [pauseAutoplay, resumeAutoplaySoon, reducedMotion]);

  /* ------------------------------------------------------------- transitions */
  const selectState = useCallback(
    (next: ConsoleStateId) => {
      // Manual selection wins; autoplay pauses and only resumes after the
      // idle delay (spec §23).
      pauseAutoplay();
      setActive((current) => {
        if (current !== next) setLeaving(current);
        return next;
      });
      resumeAutoplaySoon(RESUME_DELAY_MS);
    },
    [pauseAutoplay, resumeAutoplaySoon],
  );

  useLayoutEffect(() => {
    if (reducedMotion || leaving === null) return;
    const root = stageRef.current;
    if (!root) return;
    const incoming = root.querySelector<HTMLElement>(
      `[data-screen="${active}"]`,
    );
    const outgoing = root.querySelector<HTMLElement>(
      `[data-screen="${leaving}"]`,
    );
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        onComplete: () => setLeaving(null),
      });
      if (outgoing) {
        timeline.to(
          outgoing,
          { autoAlpha: 0, y: -14, duration: 0.5, ease: "power2.in" },
          0,
        );
      }
      if (incoming) {
        timeline.fromTo(
          incoming,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.62, ease: "power2.out" },
          0.06,
        );
      }
    }, root);
    return () => ctx.revert();
  }, [active, leaving, reducedMotion]);

  /* ------------------------------------------- entrance + ambient (GSAP §25–27) */
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        enterRef.current,
        { opacity: 0, scale: 0.985, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.75,
          ease: ENTRANCE_EASE,
          delay: 0.42,
          clearProps: "opacity",
        },
      );
      gsap.fromTo(
        breatheRef.current,
        { scale: 1 },
        {
          scale: 1.006,
          duration: 20,
          ease: "none",
          repeat: -1,
          yoyo: true,
        },
      );
    }, stageRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(
    () => () => {
      if (resumeTimerRef.current !== null) {
        window.clearTimeout(resumeTimerRef.current);
      }
    },
    [],
  );

  const mountedScreens =
    leaving && leaving !== active ? [leaving, active] : [active];

  return (
    <div ref={stageRef} className={styles.productStage__stage} data-hero="product-stage">
      <div ref={enterRef} className={styles.productStage__enter}>
        <div ref={breatheRef} className={styles.productStage__breathe}>
          <div className={styles.productStage__screens}>
            {mountedScreens.map((stateId) => (
              <div
                key={stateId}
                className={styles.productStage__screen}
                data-screen={stateId}
                role="img"
                aria-label={SCREEN_ARIA[stateId]}
              >
                {stateId === "inventory" ? <StockConsole /> : null}
                {stateId === "billing" ? <BillingScreen /> : null}
                {stateId === "transfers" ? <TransfersScreen /> : null}
                {stateId === "finance" ? <FinanceScreen /> : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={styles.productStage__rail}
        data-hero="state-rail"
        role="group"
        aria-label="Product views"
        onPointerEnter={() => {
          isUserInteractingRef.current = true;
          pauseAutoplay();
        }}
        onPointerLeave={() => {
          isUserInteractingRef.current = false;
          resumeAutoplaySoon(RESUME_DELAY_MS);
        }}
        onFocusCapture={() => {
          isUserInteractingRef.current = true;
          pauseAutoplay();
        }}
        onBlurCapture={() => {
          isUserInteractingRef.current = false;
          resumeAutoplaySoon(RESUME_DELAY_MS);
        }}
      >
        {consoleStates.map((state, index) => (
          <span key={state.id} className={styles.productStage__railWrap}>
            {index > 0 ? <i className={styles.productStage__railSep} aria-hidden="true" /> : null}
            <button
              type="button"
              className={styles.productStage__railBtn}
              data-active={active === state.id}
              aria-pressed={active === state.id}
              onClick={() => selectState(state.id)}
            >
              <span className={styles.productStage__railDot} aria-hidden="true" />
              {state.label}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
