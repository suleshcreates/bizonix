"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import type { HeroFeature } from "@/lib/content/features/features-hero-data";
import { CARD_BOX, CARD_H, CARD_W, pctX } from "./hero-geometry";
import styles from "@/components/pages/features/features.module.css";

/**
 * One capability card — the single component behind all five.
 *
 * Width, height, padding, badge size, radius and shadow live in the
 * stylesheet and are shared; nothing is sized per corner. The only thing a
 * slot decides is where the box sits, and that comes from the composition's
 * coordinate table rather than from a rule written five times over.
 *
 * Pointing at a card takes the emphasis; clicking it opens the feature.
 */
export function FeatureCallout({
  feature,
  active,
  order,
  onEnter,
  onLeave,
}: {
  feature: HeroFeature;
  active: boolean;
  order: number;
  onEnter: (id: string) => void;
  onLeave: () => void;
}) {
  const Icon = feature.icon;
  const box = CARD_BOX[feature.slot];

  return (
    <Link
      href={feature.href}
      className={styles.callouts__card}
      data-slot={feature.slot}
      data-state={active ? "on" : "off"}
      style={
        {
          "--accent": feature.accent,
          "--o": order,
          "--x": pctX(box.x),
          "--y": `${box.y}px`,
          "--w": pctX(CARD_W),
          "--h": `${CARD_H}px`,
        } as CSSProperties
      }
      onMouseEnter={() => onEnter(feature.id)}
      onMouseLeave={onLeave}
      onFocus={() => onEnter(feature.id)}
      onBlur={onLeave}
    >
      <span className={styles.callouts__head}>
        <span className={styles.callouts__badge}>
          <Icon size={15} strokeWidth={2.1} aria-hidden="true" />
        </span>
        <span className={styles.callouts__heading}>
          <span className={styles.callouts__number}>{feature.number}</span>
          <span className={styles.callouts__name}>{feature.name}</span>
        </span>
      </span>

      <span className={styles.callouts__discipline}>{feature.discipline}</span>
      <span className={styles.callouts__blurb}>{feature.blurb}</span>
    </Link>
  );
}
