"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "@/components/pages/features/features.module.css";

type SceneTone =
  | "hero"
  | "barcode"
  | "counters"
  | "compliance"
  | "pricing"
  | "transfer";

const entrance = {
  hero: { y: 18, scale: 0.99 },
  barcode: { x: -24, y: 12 },
  counters: { y: 24, scale: 0.985 },
  compliance: { x: 24, y: 12 },
  pricing: { y: 20, scale: 0.99 },
  transfer: { x: -18, y: 16 },
} as const;

const drift = {
  hero: { x: 12, y: -8, scale: 1.08 },
  barcode: { x: 18, y: -14, scale: 1.1 },
  counters: { x: -12, y: 16, scale: 1.08 },
  compliance: { x: 20, y: 12, scale: 1.1 },
  pricing: { x: -18, y: -12, scale: 1.09 },
  transfer: { x: 16, y: 14, scale: 1.1 },
} as const;

/* Only stable outer containers take part in the reveal. Their interactive
 * children retain their existing state and scroll-driven transforms. */
const stagedTargets: Record<SceneTone, readonly string[]> = {
  hero: [],
  barcode: [
    styles.features__barcodeIdentity__copy,
    styles.features__barcodeIdentity__stage,
  ],
  counters: [
    styles.counterSessions__head,
    styles.counterSessions__machine,
  ],
  compliance: [
    styles.gstCompliance__stage,
    styles.gstCompliance__copy,
  ],
  pricing: [
    styles.seriesPricing__head,
    styles.seriesPricing__picker,
    styles.seriesPricing__ladder,
  ],
  transfer: [
    styles.stockTransfer__head,
    styles.stockTransfer__desktopExperience,
    styles.stockTransfer__mobileExperience,
  ],
};

export function FeatureScrollScene({
  tone,
  children,
}: {
  tone: SceneTone;
  children: ReactNode;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const initial = entrance[tone];

  useLayoutEffect(() => {
    if (reducedMotion || !sceneRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const scene = sceneRef.current;
    const wash = scene.querySelector<HTMLElement>("[data-feature-motion-wash]");
    if (!wash) return;

    const animation = gsap.context(() => {
      gsap.fromTo(
        wash,
        { xPercent: -drift[tone].x, yPercent: drift[tone].y, scale: 0.94 },
        {
          xPercent: drift[tone].x,
          yPercent: -drift[tone].y,
          scale: drift[tone].scale,
          ease: "none",
          scrollTrigger: {
            trigger: scene,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      );

      const targets = stagedTargets[tone]
        .map((className) => scene.getElementsByClassName(className)[0])
        .filter((element): element is HTMLElement => element instanceof HTMLElement);

      if (targets.length) {
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.58,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: scene,
              start: "top 78%",
              once: true,
            },
          },
        );
      }
    }, scene);

    return () => animation.revert();
  }, [reducedMotion, tone]);

  return (
    <motion.div
      ref={sceneRef}
      className={styles.featuresMotion__scene}
      data-tone={tone}
      initial={reducedMotion ? false : { opacity: 0, ...initial }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
    >
      <span
        className={styles.featuresMotion__wash}
        data-feature-motion-wash
        aria-hidden="true"
      />
      {children}
    </motion.div>
  );
}
