"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import styles from "@/components/pages/home/home.module.css";

/**
 * Ultra-smooth, high-performance GSAP ScrollTrigger orchestrator for the Bizonix homepage.
 *
 * Enhancements:
 * - SSR-safe: all GSAP plugin registrations and ticker initializations are strictly client-side only.
 * - Liquid momentum scrub constants (0.8s – 1.2s damping) for buttery, non-stepped motion.
 * - Optical de-blur typography reveals (blur(6px) -> 0) with power3.out easing.
 * - Cinematic 3D hero departure: perspective tilt, content float, and floor glow dissipation.
 * - Multi-layer organic parallax on Operating Ecosystem (differentiated speeds for cards & badges).
 * - Living orbital dynamics on Challenges Constellation (radial expansion + rotating hub pulse).
 * - Staggered 3-column depth parallax on Industry cards (elevated center column).
 * - Full battery/framerate optimization on mobile devices (<768px).
 * - 100% accessible: respects `prefers-reduced-motion: reduce`.
 */
export function HomeScrollMotion() {
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Register plugins and configure ticker strictly inside client-side lifecycle
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ limitCallbacks: true, syncInterval: 16 });
    gsap.ticker.lagSmoothing(1000, 16);

    const progress = progressRef.current;
    if (!progress) return;

    const media = gsap.matchMedia();

    // ----------------------------------------------------------------------
    // 1. ALL VIEWPORTS (Reduced Motion: No Preference)
    // ----------------------------------------------------------------------
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        // --- Reading Progress Indicator (Liquid Tracking) ---
        gsap.to(progress, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            start: 0,
            end: "max",
            scrub: 0.25,
          },
        });

        // --- Optical De-Blur Typography Reveals across Main Sections ---
        const sections = gsap.utils.toArray<HTMLElement>("main > section");

        sections.slice(1).forEach((section) => {
          // Avoid touching ModuleShowcase internal timeline
          if (
            section.getAttribute("aria-label") === "Bizonix modules" ||
            section.className.includes("moduleShowcase")
          ) {
            return;
          }

          const heading = section.querySelector<HTMLElement>("h2");
          const eyebrow = section.querySelector<HTMLElement>(
            '[class*="eyebrow"], .eyebrow',
          );
          const header =
            heading?.closest<HTMLElement>("header") ?? heading?.parentElement;
          const paragraph = header?.querySelector<HTMLElement>("p");

          if (heading) {
            const headerTl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            });

            if (eyebrow) {
              headerTl.fromTo(
                eyebrow,
                { autoAlpha: 0, y: 12, filter: "blur(4px)" },
                {
                  autoAlpha: 1,
                  y: 0,
                  filter: "blur(0px)",
                  duration: 0.55,
                  ease: "power3.out",
                },
                0,
              );
            }

            headerTl.fromTo(
              heading,
              { autoAlpha: 0, y: 32, filter: "blur(6px)" },
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.75,
                ease: "power3.out",
              },
              0.05,
            );

            if (paragraph && paragraph !== heading) {
              headerTl.fromTo(
                paragraph,
                { autoAlpha: 0, y: 22, filter: "blur(4px)" },
                {
                  autoAlpha: 1,
                  y: 0,
                  filter: "blur(0px)",
                  duration: 0.65,
                  ease: "power3.out",
                },
                0.14,
              );
            }
          }
        });
      });

      return () => context.revert();
    });

    // ----------------------------------------------------------------------
    // 2. DESKTOP & TABLET (>= 768px): Cinematic Parallax & Living Geometry
    // ----------------------------------------------------------------------
    media.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const desktopContext = gsap.context(() => {
          const sections = gsap.utils.toArray<HTMLElement>("main > section");
          const hero = sections[0];

          // --- Hero Departure: 3D Perspective + Atmospheric Parallax ---
          if (hero) {
            const heroCopy = hero.querySelector<HTMLElement>(
              '[data-hero="content"]',
            );
            const productStage = hero.querySelector<HTMLElement>(
              '[data-hero="product-stage"]',
            );
            const floorGlow = hero.querySelector<HTMLElement>(
              '[class*="homeHero__floorGlow"]',
            );

            if (heroCopy) {
              gsap.to(heroCopy, {
                y: -65,
                autoAlpha: 0.15,
                filter: "blur(3px)",
                ease: "none",
                scrollTrigger: {
                  trigger: hero,
                  start: "center center",
                  end: "bottom top",
                  scrub: 0.9,
                },
              });
            }

            if (productStage) {
              gsap.to(productStage, {
                y: 68,
                scale: 0.93,
                rotateX: 3.6,
                transformPerspective: 1400,
                autoAlpha: 0.85,
                ease: "none",
                scrollTrigger: {
                  trigger: hero,
                  start: "top top",
                  end: "bottom top",
                  scrub: 1.1,
                },
              });
            }

            if (floorGlow) {
              gsap.to(floorGlow, {
                y: 45,
                scale: 0.85,
                autoAlpha: 0.35,
                ease: "none",
                scrollTrigger: {
                  trigger: hero,
                  start: "top top",
                  end: "bottom top",
                  scrub: 1.2,
                },
              });
            }
          }

          // --- Operating Ecosystem (#who-its-for) ---
          const ecosystem = document.getElementById("who-its-for");
          if (ecosystem) {
            const envCards = gsap.utils.toArray<HTMLElement>(
              '[class*="operatingEcosystem__environment"]',
              ecosystem,
            );
            const proofBadges = gsap.utils.toArray<HTMLElement>(
              '[class*="operatingEcosystem__"][class*="Fragment"]',
              ecosystem,
            );
            const connectorPaths = gsap.utils.toArray<SVGPathElement>(
              '[class*="operatingEcosystem__connectors"] path',
              ecosystem,
            );

            // 1. Initial Stagger Entrance
            if (envCards.length) {
              gsap.fromTo(
                envCards,
                { autoAlpha: 0, y: 50, scale: 0.95 },
                {
                  autoAlpha: 1,
                  y: 0,
                  scale: 1,
                  stagger: 0.14,
                  duration: 0.85,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: ecosystem,
                    start: "top 72%",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            }

            if (proofBadges.length) {
              gsap.fromTo(
                proofBadges,
                { autoAlpha: 0, y: 28, scale: 0.86 },
                {
                  autoAlpha: 1,
                  y: 0,
                  scale: 1,
                  stagger: 0.1,
                  duration: 0.7,
                  ease: "back.out(1.5)",
                  scrollTrigger: {
                    trigger: ecosystem,
                    start: "top 62%",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            }

            // 2. SVG Flow Connector Paths
            connectorPaths.forEach((path) => {
              const length = path.getTotalLength ? path.getTotalLength() : 400;
              gsap.fromTo(
                path,
                { strokeDasharray: length, strokeDashoffset: length },
                {
                  strokeDashoffset: 0,
                  duration: 1.5,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: ecosystem,
                    start: "top 68%",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            });

            // 3. Multiplane Parallax Float (Scrubbed Depth Layering)
            if (envCards.length === 3) {
              // Left: Warehouse
              gsap.to(envCards[0], {
                y: -18,
                ease: "none",
                scrollTrigger: {
                  trigger: ecosystem,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.2,
                },
              });
              // Center: Retail / Franchise Flagship — Elevated depth!
              gsap.to(envCards[1], {
                y: -36,
                scale: 1.015,
                ease: "none",
                scrollTrigger: {
                  trigger: ecosystem,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.2,
                },
              });
              // Right: Corporate HQ & Finance
              gsap.to(envCards[2], {
                y: -18,
                ease: "none",
                scrollTrigger: {
                  trigger: ecosystem,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.2,
                },
              });
            }

            // Foreground floating proof fragments move with accelerated parallax
            if (proofBadges.length) {
              gsap.to(proofBadges, {
                y: -46,
                ease: "none",
                scrollTrigger: {
                  trigger: ecosystem,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.0,
                },
              });
            }
          }

          // --- Challenges Section (#challenges) ---
          const challenges = document.getElementById("challenges");
          if (challenges) {
            const radialPoints = gsap.utils.toArray<HTMLElement>(
              '[class*="challengesSection__radialPoint"]',
              challenges,
            );
            const hubCore = challenges.querySelector<HTMLElement>(
              '[class*="challengesSection__hubCore"]',
            );
            const orbitPaths = gsap.utils.toArray<SVGPathElement>(
              '[class*="challengesSection__orbitPath"]',
              challenges,
            );

            // 1. Entrance choreography
            if (radialPoints.length) {
              gsap.fromTo(
                radialPoints,
                { autoAlpha: 0, scale: 0.86, y: (i) => (i < 3 ? -22 : 22) },
                {
                  autoAlpha: 1,
                  scale: 1,
                  y: 0,
                  stagger: 0.08,
                  duration: 0.7,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: challenges,
                    start: "top 68%",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            }

            if (hubCore) {
              gsap.fromTo(
                hubCore,
                { autoAlpha: 0, scale: 0.8 },
                {
                  autoAlpha: 1,
                  scale: 1,
                  duration: 0.75,
                  ease: "back.out(1.3)",
                  scrollTrigger: {
                    trigger: challenges,
                    start: "top 72%",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            }

            orbitPaths.forEach((path) => {
              const length = path.getTotalLength ? path.getTotalLength() : 300;
              gsap.fromTo(
                path,
                { strokeDasharray: length, strokeDashoffset: length },
                {
                  strokeDashoffset: 0,
                  duration: 1.2,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: challenges,
                    start: "top 70%",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            });

            // 2. Continuous Radial Expansion Parallax
            if (radialPoints.length >= 6) {
              // Upper nodes drift slightly upward
              gsap.to(radialPoints.slice(0, 3), {
                y: -20,
                ease: "none",
                scrollTrigger: {
                  trigger: challenges,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.2,
                },
              });
              // Lower nodes drift slightly downward
              gsap.to(radialPoints.slice(3), {
                y: 20,
                ease: "none",
                scrollTrigger: {
                  trigger: challenges,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.2,
                },
              });
            }

            if (hubCore) {
              gsap.to(hubCore, {
                rotate: 5,
                scale: 1.04,
                ease: "none",
                scrollTrigger: {
                  trigger: challenges,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.5,
                },
              });
            }
          }

          // --- Platform Spine Principles ---
          const spineSection = document.querySelector<HTMLElement>(
            '[class*="platformSpine__section"]',
          );
          if (spineSection) {
            const principles = gsap.utils.toArray<HTMLElement>(
              '[class*="platformSpine__principles"] > div',
              spineSection,
            );
            if (principles.length) {
              gsap.fromTo(
                principles,
                { autoAlpha: 0, y: 30, scale: 0.95 },
                {
                  autoAlpha: 1,
                  y: 0,
                  scale: 1,
                  stagger: 0.1,
                  duration: 0.65,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: spineSection,
                    start: "bottom 92%",
                    toggleActions: "play none none reverse",
                  },
                },
              );

              // Subtle floating elevation on scroll
              gsap.to(principles, {
                y: (i) => (i === 1 ? -22 : -10),
                ease: "none",
                scrollTrigger: {
                  trigger: spineSection,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.2,
                },
              });
            }
          }

          // --- Industry Band Cards (3-Column Depth Parallax) ---
          const industrySection = Array.from(sections).find(
            (sec) =>
              sec.className.includes("bg-slate-50") ||
              sec.querySelector('a[href^="/industries/"]'),
          );
          if (industrySection) {
            const industryCards = gsap.utils.toArray<HTMLElement>(
              'a[href^="/industries/"]',
              industrySection,
            );
            if (industryCards.length) {
              // 1. Entrance
              gsap.fromTo(
                industryCards,
                { autoAlpha: 0, y: 44, scale: 0.96 },
                {
                  autoAlpha: 1,
                  y: 0,
                  scale: 1,
                  stagger: 0.12,
                  duration: 0.75,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: industrySection,
                    start: "top 72%",
                    toggleActions: "play none none reverse",
                  },
                },
              );

              // 2. Continuous 3-Column Floating Parallax
              if (industryCards.length === 3) {
                gsap.to(industryCards[0], {
                  y: -16,
                  ease: "none",
                  scrollTrigger: {
                    trigger: industrySection,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.2,
                  },
                });
                gsap.to(industryCards[1], {
                  y: -34,
                  scale: 1.012,
                  ease: "none",
                  scrollTrigger: {
                    trigger: industrySection,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.2,
                  },
                });
                gsap.to(industryCards[2], {
                  y: -16,
                  ease: "none",
                  scrollTrigger: {
                    trigger: industrySection,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.2,
                  },
                });
              }
            }
          }

          // --- Compliance Band Articles ---
          const complianceSection = Array.from(sections).find((sec) =>
            sec.className.includes("bg-bz-teal-soft"),
          );
          if (complianceSection) {
            const articles = gsap.utils.toArray<HTMLElement>(
              "article",
              complianceSection,
            );
            if (articles.length) {
              gsap.fromTo(
                articles,
                { autoAlpha: 0, y: 26, filter: "blur(3px)" },
                {
                  autoAlpha: 1,
                  y: 0,
                  filter: "blur(0px)",
                  stagger: 0.08,
                  duration: 0.6,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: complianceSection,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            }
          }

          // --- Final CTA Shell Bloom ---
          const finalCta = Array.from(sections).find(
            (sec) =>
              sec.querySelector('a[href="/contact"]') &&
              sec.querySelector("h2")?.textContent?.includes("one business"),
          );
          if (finalCta) {
            const ctaContainer = finalCta.querySelector<HTMLElement>(
              '[class*="rounded-[28px]"], [class*="rounded-[40px]"], [class*="rounded-[48px]"]',
            );
            if (ctaContainer) {
              gsap.fromTo(
                ctaContainer,
                { autoAlpha: 0.85, scale: 0.96, y: 32 },
                {
                  autoAlpha: 1,
                  scale: 1,
                  y: 0,
                  duration: 0.8,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: finalCta,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            }
          }
        });

        return () => desktopContext.revert();
      },
    );

    // ----------------------------------------------------------------------
    // 3. MOBILE (< 768px): Light, Snappy Tactile Reveals
    // ----------------------------------------------------------------------
    media.add(
      "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
      () => {
        const mobileContext = gsap.context(() => {
          // Stagger mobile challenge flow cards with smooth cubic easing
          const mobileCards = gsap.utils.toArray<HTMLElement>(
            '[class*="challengesSection__flowCard"], [class*="challengesSection__flowStep"]',
          );
          if (mobileCards.length) {
            gsap.fromTo(
              mobileCards,
              { autoAlpha: 0, y: 22, scale: 0.97 },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                stagger: 0.08,
                duration: 0.55,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: mobileCards[0],
                  start: "top 86%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          }

          // Stagger mobile environment cards
          const mobileEnvs = gsap.utils.toArray<HTMLElement>(
            '[class*="operatingEcosystem__environment"]',
          );
          if (mobileEnvs.length) {
            gsap.fromTo(
              mobileEnvs,
              { autoAlpha: 0, y: 26, scale: 0.97 },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                stagger: 0.1,
                duration: 0.6,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: mobileEnvs[0],
                  start: "top 84%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          }
        });

        return () => mobileContext.revert();
      },
    );

    ScrollTrigger.refresh();

    return () => media.revert();
  }, []);

  return (
    <span
      ref={progressRef}
      className={styles.homeScrollMotion__progress}
      aria-hidden="true"
    />
  );
}
