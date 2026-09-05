"use client";

import { useEffect, useRef, useState } from "react";
import { industries } from "@/lib/content/industries/industries";
import type { IndustryId } from "@/lib/content/industries/industries";
import { IndustrySelector } from "./how-bizonix-fits-parts/industry-selector";
import { ModuleEcosystem } from "./how-bizonix-fits-parts/module-ecosystem";
import { ModuleMappingPanel } from "./how-bizonix-fits-parts/module-mapping-panel";
import { OrbitalBackground } from "./how-bizonix-fits-parts/orbital-background";
import { SectionClosure } from "./how-bizonix-fits-parts/section-closure";
import { SectionHeader } from "./how-bizonix-fits-parts/section-header";
import styles from "@/components/pages/industries/industries.module.css";

export function HowBizonixFitsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const [activeId, setActiveId] = useState<IndustryId>(industries[0].id);

  // Rotation starts once, when the section first becomes visible, and is
  // never restarted afterwards -- industry selection does not touch this.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      const timer = setTimeout(() => setEntered(true), 0);
      return () => clearTimeout(timer);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-bizonix-fits"
      className={styles.howBizonixFits__section}
      data-entered={entered ? "true" : "false"}
      aria-labelledby="how-bizonix-fits-title"
    >
      <OrbitalBackground />
      <div className={styles.howBizonixFits__shell}>
        <SectionHeader />
        <IndustrySelector activeId={activeId} onSelect={setActiveId} />
        <ModuleEcosystem activeId={activeId} />
        <ModuleMappingPanel activeId={activeId} />
        <SectionClosure />
      </div>
    </section>
  );
}
