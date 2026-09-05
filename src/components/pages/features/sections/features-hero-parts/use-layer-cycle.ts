"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** How long a capability stays emphasised before the next one takes over. */
const DWELL_MS = 3600;
/** How long the cycle stays out of the way after someone points at a card. */
const RESUME_MS = 8000;

type Cycle = {
  /** Index of the capability currently emphasised. */
  active: number;
  /**
   * Pointing at or tabbing to a card emphasises it at once and holds it there
   * for as long as the visitor stays on it.
   */
  preview: (index: number) => void;
  /** Give the cycle back; it picks up again after a beat. */
  release: () => void;
};

/**
 * Emphasis controller for the five capabilities.
 *
 * The hero settles into a calm idle state where one capability at a time is
 * lit — its wire carries a packet, its node pulses, and the screen shows the
 * status that capability sets. Deliberate interaction always wins: hovering or
 * focusing a card takes the emphasis immediately and keeps it.
 *
 * Reduced motion stops the cycle entirely: the first capability stays lit and
 * the cards remain a working manual control.
 */
export function useLayerCycle(
  count: number,
  initial = 0,
  enabled = true,
): Cycle {
  const [active, setActive] = useState(initial);
  const [playing, setPlaying] = useState(true);
  const held = useRef(false);
  const resume = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reduced motion is read here rather than held in state: the server and the
  // client then render the same first frame, and the cycle simply never
  // schedules its next step.
  useEffect(() => {
    if (!enabled || !playing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(
      () => setActive((current) => (current + 1) % count),
      DWELL_MS,
    );
    return () => clearTimeout(timer);
  }, [playing, active, count, enabled]);

  const clearResume = () => {
    if (resume.current) {
      clearTimeout(resume.current);
      resume.current = null;
    }
  };

  const preview = useCallback(
    (index: number) => {
      if (!enabled) return;
      held.current = true;
      clearResume();
      setPlaying(false);
      setActive(index);
    },
    [enabled],
  );

  const release = useCallback(() => {
    if (!enabled) return;
    held.current = false;
    clearResume();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    resume.current = setTimeout(() => {
      if (!held.current) setPlaying(true);
    }, RESUME_MS);
  }, [enabled]);

  useEffect(() => clearResume, []);

  return { active, preview, release };
}
