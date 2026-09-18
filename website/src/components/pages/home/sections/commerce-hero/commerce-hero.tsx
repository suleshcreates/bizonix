import React from "react";
import { CommerceHeroShell } from "./commerce-hero-shell";
import { CommerceHeroCopy } from "./commerce-hero-copy";
import { CommerceHeroVisual } from "./commerce-hero-visual";

export interface CommerceHeroConfig {
  eyebrow?: string;
  headline?: string;
  accentText?: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function CommerceHero({ config }: { config?: CommerceHeroConfig }) {
  return (
    <section className="w-full relative select-none" aria-label="Commerce Hero">
      <CommerceHeroShell
        leftContent={<CommerceHeroCopy config={config} />}
        rightVisual={<CommerceHeroVisual />}
      />
    </section>
  );
}

export default CommerceHero;
