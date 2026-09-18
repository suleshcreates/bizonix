import { modules } from "@/lib/content/home/home";

/* ===========================================================================
   MODULE ORBIT PLACEMENT

   The module vocabulary itself is NOT redefined here -- it is imported from
   `home.ts`, which stays the single source of truth for slug, title, body and
   icon. This file adds one presentation concern on top: where each module
   sits in the ecosystem.

   Placement is art-directed, not computed. Positions are percentages of the
   stage measured from its centre. Most nodes sit near the primary orbit at
   ~50%, while Security is pulled inward onto the secondary orbit so the ring
   reads as an ecosystem rather than a clock face.
   =========================================================================== */

export type ModuleOrbitPlacement = {
  slug: string;
  /** Percent of stage width, from centre. Negative is left. */
  x: number;
  /** Percent of stage height, from centre. Negative is up. */
  y: number;
};

export const moduleOrbitPlacements: readonly ModuleOrbitPlacement[] = [
  { slug: "inventory", x: 23, y: -46 },
  { slug: "sales-pos", x: 49, y: -16 },
  { slug: "accounting", x: 45, y: 19 },
  { slug: "analytics", x: 33, y: 37 },
  { slug: "ecommerce", x: -6, y: 47 },
  { slug: "franchise", x: -39, y: 31 },
  { slug: "wholesale", x: -49, y: -1 },
  { slug: "security", x: -36, y: -25 },
  { slug: "procurement", x: -23, y: -46 },
] as const;

export type EcosystemModule = (typeof modules)[number] & ModuleOrbitPlacement;

/** The nine documented modules, each with its place in the ecosystem. */
export const ecosystemModules: readonly EcosystemModule[] =
  moduleOrbitPlacements.map((placement) => {
    const found = modules.find((entry) => entry.slug === placement.slug);
    if (!found) {
      throw new Error(
        `Unknown module slug in orbit placement: ${placement.slug}`
      );
    }
    return { ...found, ...placement };
  });

/* Decorative indicators along the primary orbit. Irregular by intent, and
   capped well below anything that would read as a spider-web. */
export const connectionPoints: readonly number[] = [
  8, 38, 63, 96, 129, 158, 196, 231, 274, 311,
] as const;
