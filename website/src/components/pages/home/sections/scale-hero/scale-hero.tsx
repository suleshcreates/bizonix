import React from "react";
import { ScaleHeroShell } from "./scale-hero-shell";
import { ScaleHeroCopy } from "./scale-hero-copy";
import { ScaleHeroVisual } from "./scale-hero-visual";
import { ScaleHeroMetrics } from "./scale-hero-metrics";

export interface ScaleHeroConfig {
  eyebrow?: string;
  headline?: string;
  accentText?: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  proofPoints?: Array<{ title: string; subtitle: string }>;
  metrics?: Array<{ value: string; title: string; subtitle: string }>;
}

export function ScaleHero({ config }: { config?: ScaleHeroConfig }) {
  return (
    <section className="w-full relative select-none" aria-label="Scale Hero">
      <ScaleHeroShell
        leftContent={<ScaleHeroCopy config={config} />}
        rightVisual={<ScaleHeroVisual />}
        bottomMetrics={<ScaleHeroMetrics metrics={config?.metrics} />}
      />
    </section>
  );
}

export default ScaleHero;
