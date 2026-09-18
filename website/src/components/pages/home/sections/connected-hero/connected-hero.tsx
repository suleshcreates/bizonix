import React from "react";
import { ConnectedHeroShell } from "./connected-hero-shell";
import { ConnectedHeroCopy } from "./connected-hero-copy";
import { ConnectedHeroVisual } from "./connected-hero-visual";

export interface ConnectedHeroConfig {
  eyebrow?: string;
  headline?: string;
  accentText?: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  microCopy?: string;
  proofPoints?: Array<{ title: string; subtitle: string }>;
}

export function ConnectedHero({ config }: { config?: ConnectedHeroConfig }) {
  return (
    <section className="w-full relative select-none" aria-label="Connected Hero">
      <ConnectedHeroShell
        leftContent={<ConnectedHeroCopy config={config} />}
        rightVisual={<ConnectedHeroVisual />}
      />
    </section>
  );
}

export default ConnectedHero;
