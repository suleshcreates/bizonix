"use client";

import { useEffect, useRef, useState } from "react";
import { IntegrationFlow } from "./integration-surface-parts/integration-flow";
import { IntegrationHeader } from "./integration-surface-parts/integration-header";
import { IntegrationMap } from "./integration-surface-parts/integration-map";
import { IntegrationRail } from "./integration-surface-parts/integration-rail";
import { PlatformSummary } from "./integration-surface-parts/platform-summary";
import styles from "@/components/pages/product/product.module.css";

export function IntegrationSurface() {
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="integration-surface"
      className={styles.integrationSurface__section}
      data-entered={entered ? "true" : "false"}
      aria-label="Integration surface"
    >
      {/* Background Atmosphere */}
      <div className={styles.integrationSurface__atmosphere} aria-hidden="true" />

      <div className={styles.integrationSurface__shell}>
        {/* Top / Hero Region: Editorial Header (Left) + Open Integration Flow (Right).
            Below the breakpoint the header centres and the left-to-right flow
            gives way to the ring — the same core, told as a shape a phone can
            hold. Only one of the two is ever in the box tree. */}
        <div className={styles.integrationSurface__heroGrid}>
          <IntegrationHeader />
          <IntegrationFlow />
          <IntegrationMap />
        </div>

        {/* Bottom Integration Region: ONE Continuous 3-Lane Surface, and the
            narrow-viewport summary that stands in for it. */}
        <IntegrationRail />
        <PlatformSummary />
      </div>
    </section>
  );
}
