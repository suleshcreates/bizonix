"use client";

import { useEffect, type RefObject } from "react";

/**
 * Development-only hero validation utility (spec §40). Never active in a
 * production build — the whole hook is dead code unless NODE_ENV says dev.
 *
 * Publishes a measurement report after entrance settles, on every state
 * change and on (debounced) resizes:
 *
 *   window.__BIZONIX_HERO_MEASURE__
 *
 * …containing viewport/hero/headline/CTA/product-stage bounding boxes,
 * the product-stage center offset, headline/CTA center offsets and page
 * overflow. Targets (desktop): product center offset ≤ 8px (preferred ≤ 4px),
 * headline/CTA offsets ≤ 4px, overflow 0px.
 */

export type HeroMeasureReport = {
  viewportWidth: number;
  viewportHeight: number;
  heroWidth: number;
  heroHeight: number;
  contentBox: DOMRect | null;
  headlineBox: DOMRect | null;
  ctaBoxes: { label: string; rect: DOMRect }[];
  productStageBox: DOMRect | null;
  productStageWidth: number | null;
  productStageCenterX: number | null;
  productStageCenterOffset: number | null;
  headlineCenterOffset: number | null;
  ctaGroupCenterOffset: number | null;
  overflowWidth: number;
  activeState: string;
  isAutoPlaying: boolean;
  isUserInteracting: boolean;
  measuredAt: string;
};

type MeasureInput = {
  active: string;
  isAutoPlaying: boolean;
  isUserInteracting: RefObject<boolean>;
};

const DEV = process.env.NODE_ENV === "development";

function roundRect(rect: DOMRect): DOMRect {
  return new DOMRect(
    Math.round(rect.x * 10) / 10,
    Math.round(rect.y * 10) / 10,
    Math.round(rect.width * 10) / 10,
    Math.round(rect.height * 10) / 10,
  );
}

export function useHeroStageMeasure(
  stageRef: RefObject<HTMLElement | null>,
  input: MeasureInput,
) {
  useEffect(() => {
    if (!DEV) return;

    const measure = () => {
      const doc = document.documentElement;
      const stage = stageRef.current;
      const hero = document.querySelector(
        'section[aria-labelledby="home-hero-heading"]',
      );
      const headline = document.getElementById("home-hero-heading");
      const heroRoot = hero ?? null;
      const ctas = heroRoot
        ? (["/contact", "/modules"] as const).map((href) => ({
            label: href,
            rect: heroRoot.querySelector<HTMLAnchorElement>(`a[href="${href}"]`)
              ?.getBoundingClientRect() ?? null,
          }))
        : [];

      const stageRect = stage?.getBoundingClientRect() ?? null;
      const headlineRect = headline?.getBoundingClientRect() ?? null;
      const ctaRects = ctas.map((cta) => cta.rect).filter((r): r is DOMRect => !!r);
      const ctaLeft = Math.min(...ctaRects.map((r) => r.left));
      const ctaRight = Math.max(...ctaRects.map((r) => r.right));
      const hasCtas = ctaRects.length === 2;

      const report: HeroMeasureReport = {
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        heroWidth: hero?.getBoundingClientRect().width ?? 0,
        heroHeight: hero?.getBoundingClientRect().height ?? 0,
        contentBox: heroRoot
          ?.querySelector<HTMLElement>('[data-hero="content"]')
          ?.getBoundingClientRect() ?? null,
        headlineBox: headlineRect ? roundRect(headlineRect) : null,
        ctaBoxes: ctas.map((cta) => ({
          label: cta.label,
          rect: cta.rect ? roundRect(cta.rect) : null,
        })) as HeroMeasureReport["ctaBoxes"],
        productStageBox: stageRect ? roundRect(stageRect) : null,
        productStageWidth: stageRect?.width ?? null,
        productStageCenterX: stageRect ? stageRect.left + stageRect.width / 2 : null,
        productStageCenterOffset: stageRect
          ? Math.abs(stageRect.left + stageRect.width / 2 - window.innerWidth / 2)
          : null,
        headlineCenterOffset: headlineRect
          ? Math.abs(headlineRect.left + headlineRect.width / 2 - window.innerWidth / 2)
          : null,
        ctaGroupCenterOffset: hasCtas
          ? Math.abs((ctaLeft + ctaRight) / 2 - window.innerWidth / 2)
          : null,
        overflowWidth: Math.max(0, doc.scrollWidth - doc.clientWidth),
        activeState: input.active,
        isAutoPlaying: input.isAutoPlaying,
        isUserInteracting: input.isUserInteracting.current ?? false,
        measuredAt: new Date().toISOString(),
      };

      (window as unknown as Record<string, unknown>).__BIZONIX_HERO_MEASURE__ =
        report;
      if (window.location.search.includes("hero-measure-log")) {
        console.debug("[hero-measure]", report);
      }
      return report;
    };

    // Let the GSAP entrance finish before the first capture.
    const first = window.setTimeout(measure, 1600);

    let resizeDebounce: number | null = null;
    const onResize = () => {
      if (resizeDebounce !== null) window.clearTimeout(resizeDebounce);
      resizeDebounce = window.setTimeout(measure, 300);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(first);
      if (resizeDebounce !== null) window.clearTimeout(resizeDebounce);
      window.removeEventListener("resize", onResize);
    };
    // Re-run per state so QA can capture geometry for every screen.
  }, [stageRef, input.active, input.isAutoPlaying, input.isUserInteracting]);
}
