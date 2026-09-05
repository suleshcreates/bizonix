"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import type { OrbitSolution } from "./orbit-geometry";
import { connectorEndpoints, orbitPosition } from "./orbit-geometry";
import { validateOrbitGeometry } from "./orbit-validation";

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("bzArrive", "0.22, 1, 0.36, 1");

/** Radial + pinned mode activates on comfortable desktop viewports. */
export const RADIAL_QUERY = "(min-width: 1024px) and (min-height: 620px)";

/** One ambient revolution (40–60s band, linear, infinite). */
const ORBIT_SECONDS = 48;
/** Orbit resumes this long after the last user interaction (1500–2000ms). */
const ORBIT_RESUME_MS = 1800;
/** Assembly is "complete" at this ScrollTrigger progress. */
const COMPLETE_AT = 0.995;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export type ModuleAssemblyRefs = {
  section: React.RefObject<HTMLElement | null>;
  viewport: React.RefObject<HTMLDivElement | null>;
  stage: React.RefObject<HTMLDivElement | null>;
};

/**
 * Scroll-assembled operating core. One master timeline, scrubbed and pinned by
 * a single ScrollTrigger on desktop: core (0–8%), nine modules (8–72%),
 * connectors + settle (78–90%), CTA (90–100%). Below the radial breakpoint the
 * same data drives simple reversible reveals. The ambient orbit is a separate
 * paused tween pair (ring ↻, cards ↺) that only runs once the assembly is
 * complete, the section is visible, and the user is not interacting.
 */
export function useModuleAssembly(
  refs: ModuleAssemblyRefs,
  radialReady: boolean,
) {
  const { section, viewport, stage } = refs;

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const sectionEl = section.current;
    const viewportEl = viewport.current;
    const stageEl = stage.current;
    if (!sectionEl || !viewportEl || !stageEl) return;

    let resumeTimer: ReturnType<typeof setTimeout> | undefined;
    let userHolds = false;
    let sectionVisible = false;
    let assemblyComplete = false;
    let orbit: gsap.core.Timeline | null = null;

    const syncOrbit = () => {
      if (!orbit) return;
      const shouldRun = assemblyComplete && sectionVisible && !userHolds;
      if (shouldRun && orbit.paused()) {
        orbit.play();
      } else if (!shouldRun && !orbit.paused()) {
        orbit.pause();
      }
    };

    const holdOrbit = () => {
      userHolds = true;
      if (resumeTimer) clearTimeout(resumeTimer);
      syncOrbit();
    };

    const releaseOrbit = () => {
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        userHolds = false;
        syncOrbit();
      }, ORBIT_RESUME_MS);
    };

    const isNodeTarget = (target: EventTarget | null) =>
      target instanceof Element && target.closest("[data-ms-node]") !== null;

    const onPointerOver = (event: PointerEvent) => {
      if (isNodeTarget(event.target)) holdOrbit();
    };
    const onPointerOut = (event: PointerEvent) => {
      if (isNodeTarget(event.target)) releaseOrbit();
    };
    const onFocusIn = (event: FocusEvent) => {
      if (isNodeTarget(event.target)) holdOrbit();
    };
    const onFocusOut = (event: FocusEvent) => {
      if (isNodeTarget(event.target)) releaseOrbit();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (isNodeTarget(event.target)) {
        holdOrbit();
        releaseOrbit();
      }
    };

    stageEl.addEventListener("pointerover", onPointerOver);
    stageEl.addEventListener("pointerout", onPointerOut);
    stageEl.addEventListener("focusin", onFocusIn);
    stageEl.addEventListener("focusout", onFocusOut);
    stageEl.addEventListener("pointerdown", onPointerDown);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(RADIAL_QUERY, () => {
        if (!radialReady) return;
        const core = stageEl.querySelector("[data-ms-core]");
        const ring = stageEl.querySelector("[data-ms-ring]");
        const cta = sectionEl.querySelector("[data-ms-cta]");
        const svg = stageEl.querySelector("[data-ms-connectors]");
        const nodes = gsap.utils.toArray<HTMLElement>("[data-ms-node]", stageEl);
        if (!core || !ring || !cta || nodes.length === 0) return;

        // Initial states are applied once, up front — the timeline below only
        // tweens *to* the finished state, so reversing is exact and the CSS
        // (no-JS / reduced-motion) default remains the assembled page.
        gsap.set(core, { autoAlpha: 0, scale: 0.94, y: -14 });
        nodes.forEach((node) => {
          const slot = node.closest<HTMLElement>("[data-ms-slot]");
          const travelX = Number.parseFloat(
            slot?.style.getPropertyValue("--travel-x") ?? "0",
          );
          const travelY = Number.parseFloat(
            slot?.style.getPropertyValue("--travel-y") ?? "0",
          );
          gsap.set(node, {
            autoAlpha: 0,
            scale: 0.92,
            x: Number.isFinite(travelX) ? travelX : 0,
            y: Number.isFinite(travelY) ? travelY : 0,
          });
        });
        if (svg) gsap.set(svg, { autoAlpha: 0 });
        gsap.set(cta, { autoAlpha: 0, y: 8 });

        let validatedOnce = false;
        const timeline = gsap.timeline({
          defaults: { ease: "bzArrive" },
          scrollTrigger: {
            trigger: sectionEl,
            start: "top 88px",
            end: "+=155%",
            pin: viewportEl,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              assemblyComplete = self.progress >= COMPLETE_AT;
              syncOrbit();
              // Development diagnostics: geometry assertions only make sense
              // in the assembled state, where arrival transforms are settled.
              if (
                process.env.NODE_ENV !== "production" &&
                !validatedOnce &&
                self.progress >= 0.999
              ) {
                validatedOnce = true;
                requestAnimationFrame(() => validateOrbitGeometry(sectionEl));
              }
            },
          },
        });

        timeline.to(core, { autoAlpha: 1, scale: 1, y: 0, duration: 0.08 }, 0);
        nodes.forEach((node, index) => {
          timeline.to(
            node,
            { autoAlpha: 1, scale: 1, x: 0, y: 0, duration: 0.065 },
            0.08 + index * 0.072,
          );
        });
        if (svg) timeline.to(svg, { autoAlpha: 1, duration: 0.08 }, 0.78);
        timeline.to(
          cta,
          { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" },
          0.9,
        );

        // Ambient orbit — parametric: every slot is carried along the solved
        // ellipse by transform-only updates, so positions orbit while every
        // card stays level. A rotating ring would break the ellipse geometry;
        // travelling the path preserves it exactly. Paused until assembled.
        const geo = JSON.parse(
          (ring as HTMLElement).dataset.geometry ?? "null",
        ) as
          | (OrbitSolution & {
              coreHalfWidth: number;
              coreHalfHeight: number;
              slice: number;
            })
          | null;
        const slots = gsap.utils.toArray<HTMLElement>("[data-ms-slot]", stageEl);
        const lines = gsap.utils.toArray<SVGLineElement>(
          "[data-ms-line]",
          stageEl,
        );
        const applyOrbit = (orbitAngle: number) => {
          if (!geo) return;
          slots.forEach((slot, index) => {
            const point = orbitPosition(geo, index, orbitAngle);
            slot.style.transform = `translate(${point.x - geo.nodeWidth / 2}px, ${
              point.y - geo.nodeHeight / 2
            }px)`;
            const line = lines[index];
            if (line) {
              const endpoints = connectorEndpoints(
                point,
                geo.centerX,
                geo.centerY,
                geo.coreHalfWidth,
                geo.coreHalfHeight,
              );
              line.setAttribute("x1", String(endpoints.x1));
              line.setAttribute("y1", String(endpoints.y1));
              line.setAttribute("x2", String(endpoints.x2));
              line.setAttribute("y2", String(endpoints.y2));
            }
          });
        };
        const carrier = { angle: 0 };
        orbit = gsap.timeline({ paused: true, repeat: -1 });
        orbit.to(carrier, {
          angle: 360,
          duration: ORBIT_SECONDS,
          ease: "none",
          onUpdate: () => applyOrbit(carrier.angle),
        });

        ScrollTrigger.create({
          trigger: sectionEl,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            sectionVisible = self.isActive;
            syncOrbit();
          },
        });

        return () => {
          orbit?.kill();
          orbit = null;
          // Orbit transforms are written imperatively; clear them so leaving
          // radial mode returns the slots to React-owned flow layout.
          slots.forEach((slot) => {
            slot.style.transform = "";
          });
        };
      });

      mm.add(`(not ${RADIAL_QUERY})`, () => {
        const core = stageEl.querySelector("[data-ms-core]");
        const cta = sectionEl.querySelector("[data-ms-cta]");
        const nodes = gsap.utils.toArray<HTMLElement>("[data-ms-node]", stageEl);
        const reveals: gsap.core.Tween[] = [];

        const reveal = (
          element: Element,
          from: gsap.TweenVars,
          to: gsap.TweenVars,
        ) => {
          gsap.set(element, from);
          reveals.push(
            gsap.to(element, {
              ...to,
              ease: "bzArrive",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            }),
          );
        };

        if (core) reveal(core, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.55 });
        nodes.forEach((node) =>
          reveal(node, { autoAlpha: 0, y: 24, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5 }),
        );
        if (cta) reveal(cta, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.45 });

        return () => reveals.forEach((tween) => tween.scrollTrigger?.kill());
      });
    }, stageEl);

    return () => {
      if (resumeTimer) clearTimeout(resumeTimer);
      stageEl.removeEventListener("pointerover", onPointerOver);
      stageEl.removeEventListener("pointerout", onPointerOut);
      stageEl.removeEventListener("focusin", onFocusIn);
      stageEl.removeEventListener("focusout", onFocusOut);
      stageEl.removeEventListener("pointerdown", onPointerDown);
      ctx.revert();
    };
  }, [section, viewport, stage, radialReady]);
}
