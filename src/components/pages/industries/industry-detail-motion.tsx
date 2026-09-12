"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./industries.module.css";

/** The hero owns its motion; this boundary coordinates the sections below it. */
export function IndustryDetailMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!root.current || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const sections =
        root.current!.querySelectorAll<HTMLElement>(":scope > section");
      sections.forEach((section, index) => {
        if (index === 0) return;
        const heading = section.querySelector("h2");
        if (heading?.parentElement) {
          gsap.from(heading.parentElement, {
            y: 18,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: heading, start: "top 92%", once: true },
          });
        }
        const targets = section.querySelectorAll(
          `.${styles.industryDetailPage__pressureList} > li, .${styles.industryDetailPage__matrixCard}, .${styles.industryDetailPage__proofPanel}`,
        );
        targets.forEach((target, itemIndex) => {
          gsap.from(target, {
            y: 20,
            opacity: 0,
            duration: 0.65,
            delay: Math.min(itemIndex * 0.055, 0.22),
            ease: "power2.out",
            scrollTrigger: { trigger: target, start: "top 94%", once: true },
          });
        });
      });
    }, root);
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts.ready.then(() => {
      if (root.current) refresh();
    });
    return () => {
      window.removeEventListener("load", refresh);
      context.revert();
    };
  }, [reduced]);

  return (
    <div
      ref={root}
      className={styles.industryDetailPage__page}
      onClick={(event) => {
        const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>(
          'a[href^="#"]',
        );
        if (
          !anchor ||
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        const id = decodeURIComponent(anchor.hash.slice(1));
        const target = document.getElementById(id);
        if (!target || !root.current?.contains(target)) return;
        event.preventDefault();
        target.scrollIntoView({
          behavior: reduced ? "instant" : "smooth",
          block: "start",
        });
        history.pushState(null, "", anchor.hash);
      }}
    >
      {children}
    </div>
  );
}
