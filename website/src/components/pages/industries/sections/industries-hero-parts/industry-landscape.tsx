"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import type { Industry } from "@/lib/content/industries/industries";
import styles from "@/components/pages/industries/industries.module.css";
import { IndustryLabel } from "./industry-label";
import { IndustryOverlay } from "./industry-overlay";
import { IndustryScene } from "./industry-scene";

/**
 * The three industries, in the two shapes the page needs.
 *
 * On wide viewports this is one panorama: all three photographs sit side by
 * side under a shared grade and each carries its own label. A phone cannot
 * read a triptych, so the same markup becomes a single card showing one
 * industry at a time, with a next control and a position indicator.
 *
 * Both shapes are the same DOM. `active` is the only state, and it is ignored
 * entirely by the wide layout — no rule above the mobile breakpoint reads
 * `data-on`, so the panorama is exactly what it was before. `__stage` is
 * `display: contents` up there for the same reason: it generates no box, so
 * it cannot become a containing block for the absolutely positioned scenes.
 */
export function IndustryLandscape({ items }: { items: readonly Industry[] }) {
  const [active, setActive] = useState(0);
  const current = items[active];

  return (
    <div className={styles.industriesHero__landscape}>
      <div className={styles.industriesHero__stage}>
        <div className={styles.industriesHero__scenes} aria-hidden="true">
          {items.map((industry, index) => (
            <IndustryScene
              key={industry.id}
              industry={industry}
              priority={index < 2}
              active={index === active}
            />
          ))}
        </div>
        <IndustryOverlay />
        <ul className={styles.industriesHero__labels}>
          {items.map((industry, index) => (
            <IndustryLabel
              key={industry.id}
              industry={industry}
              active={index === active}
            />
          ))}
        </ul>
      </div>

      {/* Narrow-viewport controls. `display: none` above the breakpoint takes
          them out of the tap and focus order along with the box tree. */}
      <div className={styles.industriesHero__controls}>
        <ol className={styles.industriesHero__dots}>
          {items.map((industry, index) => (
            <li key={industry.id}>
              <button
                type="button"
                data-on={index === active}
                aria-current={index === active ? "true" : undefined}
                onClick={() => setActive(index)}
              >
                <span className={styles.industriesHero__srOnly}>
                  {industry.name}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <button
          type="button"
          className={styles.industriesHero__next}
          onClick={() => setActive((n) => (n + 1) % items.length)}
        >
          <span className={styles.industriesHero__srOnly}>
            {`Next industry after ${current.name}`}
          </span>
          <ArrowRight size={17} strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
