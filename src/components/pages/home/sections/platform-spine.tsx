"use client";

import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { useReveal } from "@/components/pages/features/deep/use-reveal";
import { principles } from "./platform-spine-parts/workflow-data";
import { WorkflowFlow } from "./platform-spine-parts/workflow-flow";
import { WorkflowMap } from "./platform-spine-parts/workflow-map";
import styles from "@/components/pages/home/home.module.css";

/**
 * The Operating Workflow — one record moving through six steps.
 *
 * Told twice because the geometry has to differ: the approved curved map at
 * >= 1101px, a single vertical flow below it. Both read the same `journey`,
 * and only one is ever displayed. `data-flow-shown` sequences the handset
 * reveal; the desktop map runs its own scroll-scrubbed animation and ignores
 * the attribute entirely.
 */

/**
 * Desktop accents for the principle strip, in list order. They belong to the
 * wide strip only — the handset grid overrides all four back to one blue, so
 * the colour is not carried in the shared data.
 */
const principleAccents = ["#2f6bff", "#25bf82", "#9a50ef", "#f59a35"];

export function PlatformSpine() {
  const { ref, shown } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className={styles.platformSpine__section}
      aria-labelledby="operating-spine-title"
      data-flow-shown={shown ? "true" : "false"}
    >
      <div className={styles.platformSpine__atmosphere} aria-hidden="true" />
      <div className={styles.platformSpine__shell}>
        <header className={styles.platformSpine__heading}>
          <div>
            {/* Handset only: the desktop heading block is approved as-is. */}
            <span className={styles.platformSpine__eyebrow}>
              One flow. Every entity.
            </span>
            <h2 id="operating-spine-title">
              The Operating <em>Workflow</em>
            </h2>
            <p>How inventory, sales and accounting move through one record</p>
            <span
              className={styles.platformSpine__headingRule}
              aria-hidden="true"
            />
          </div>
          <div className={styles.platformSpine__flowSummary}>
            <span className={styles.platformSpine__summaryIcon}>
              <ArrowUpRight size={24} />
            </span>
            <span>
              <strong>Complete Flow</strong>
              <small>
                6 Key Steps <i /> One Seamless Journey
              </small>
            </span>
          </div>
        </header>

        <WorkflowMap />
        <WorkflowFlow />

        <footer className={styles.platformSpine__principles}>
          {principles.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                style={
                  {
                    "--principle-color": principleAccents[index],
                  } as CSSProperties
                }
              >
                <span>
                  <Icon size={27} />
                </span>
                <p>
                  <strong>{item.title}</strong>
                  <small>{item.body}</small>
                </p>
              </div>
            );
          })}
        </footer>
      </div>
    </section>
  );
}
