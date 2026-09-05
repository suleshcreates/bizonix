import type { IndustryId } from "./industries";

/* ===========================================================================
   INDUSTRY -> MODULE MAPPING

   PROVENANCE NOTE -- READ BEFORE EDITING.

   The SRS does not publish an explicit industry -> module table, and no such
   mapping existed anywhere in this codebase. Nothing here is invented: every
   link below is a direct lexical match between authored product copy that is
   already committed to the repo and a module's own definition in
   `home.ts`. The exact sentence each link came from is recorded in `basis`
   so the derivation stays auditable.

   Two links (apparel -> wholesale, apparel -> franchise) come from the SRS
   capability bullets supplied for the Industries index rather than from
   committed copy; they are marked `sourced: "srs-bullet"`.

   If product has a definitive mapping, replace `moduleSlugs` here. This file
   is the only place the relationship is expressed -- the section reads it and
   renders whatever it finds, including a shorter list.
   =========================================================================== */

export type MappingSource = "content" | "srs-bullet";

export type MappedModule = {
  /** Must match a `slug` in the `modules` array in `home.ts`. */
  slug: string;
  /** The authored sentence this link was derived from. */
  basis: string;
  sourced: MappingSource;
};

export type IndustryModuleMapping = {
  industryId: IndustryId;
  modules: readonly MappedModule[];
};

export const industryModuleMap: readonly IndustryModuleMapping[] = [
  {
    industryId: "apparel",
    modules: [
      {
        slug: "inventory",
        basis:
          "Size, colour and seasonal inventory create too many stock decisions.",
        sourced: "content",
      },
      {
        slug: "wholesale",
        basis: "Wholesale packs",
        sourced: "srs-bullet",
      },
      {
        slug: "franchise",
        basis: "Franchise sell-through",
        sourced: "srs-bullet",
      },
    ],
  },
  {
    industryId: "jewellery",
    modules: [
      {
        slug: "inventory",
        basis: "Design-heavy SKUs, piece barcodes and fast POS.",
        sourced: "content",
      },
      {
        slug: "sales-pos",
        basis: "Barcode, POS and supplier movement stay linked.",
        sourced: "content",
      },
      {
        slug: "procurement",
        basis: "Barcode, POS and supplier movement stay linked.",
        sourced: "content",
      },
    ],
  },
  {
    industryId: "franchise",
    modules: [
      {
        slug: "franchise",
        basis: "Central control, allocation and entity-aware operations.",
        sourced: "content",
      },
      {
        slug: "security",
        basis: "Allocation and entity boundaries stay clear.",
        sourced: "content",
      },
    ],
  },
] as const;

export function mappedSlugsFor(industryId: IndustryId): readonly string[] {
  return (
    industryModuleMap
      .find((entry) => entry.industryId === industryId)
      ?.modules.map((module) => module.slug) ?? []
  );
}
