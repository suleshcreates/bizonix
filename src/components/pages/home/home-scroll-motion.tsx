"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import styles from "@/components/pages/home/home.module.css";

gsap.registerPlugin(ScrollTrigger);

const isSafeCard = (element: HTMLElement) => {
  const computed = window.getComputedStyle(element);

  return (
    computed.position !== "absolute" &&
    computed.position !== "fixed" &&
    computed.transform === "none" &&
    !element.matches("[data-module-card], [data-ms-node], [data-lane]")
  );
};

/**
 * A single, intentionally light motion layer for the homepage.
 *
 * Individual product diagrams keep ownership of their own timelines. This
 * controller only animates editorial copy and ordinary flow-layout cards, so
 * it cannot interfere with sticky scenes, SVG paths or interactive controls.
 */
export function HomeScrollMotion() {
  const progressRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const progress = progressRef.current;
    if (!progress) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.to(progress, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            start: 0,
            end: "max",
            scrub: 0.25,
          },
        });

        const sections = gsap.utils.toArray<HTMLElement>("main > section");
        const hero = sections[0];
        const heroCopy = hero?.querySelector<HTMLElement>(
          '[data-hero="content"]',
        );

        if (hero && heroCopy) {
          gsap.to(heroCopy, {
            y: 42,
            autoAlpha: 0.78,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
            },
          });
        }

        sections.slice(1).forEach((section) => {
          const heading = section.querySelector<HTMLElement>("h2");
          const header = heading?.closest<HTMLElement>("header") ?? heading?.parentElement;
          const supportingCopy = header
            ? Array.from(header.querySelectorAll<HTMLElement>("p")).slice(0, 1)
            : [];

          if (heading) {
            gsap.fromTo(
              heading,
              { autoAlpha: 0.58, y: 28 },
              {
                autoAlpha: 1,
                y: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top 92%",
                  end: "top 62%",
                  scrub: 0.55,
                },
              },
            );
          }

          if (supportingCopy.length) {
            gsap.fromTo(
              supportingCopy,
              { autoAlpha: 0.64, y: 18 },
              {
                autoAlpha: 1,
                y: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top 86%",
                  end: "top 58%",
                  scrub: 0.65,
                },
              },
            );
          }

          const cards = Array.from(
            section.querySelectorAll<HTMLElement>("article"),
          )
            .filter(isSafeCard)
            .slice(0, 8);

          if (cards.length) {
            gsap.fromTo(
              cards,
              { autoAlpha: 0.72, y: 22, scale: 0.985 },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                stagger: 0.035,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top 84%",
                  end: "top 48%",
                  scrub: 0.7,
                },
              },
            );
          }
        });
      });

      ScrollTrigger.refresh();
      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return <span ref={progressRef} className={styles.homeScrollMotion__progress} aria-hidden="true" />;
}

