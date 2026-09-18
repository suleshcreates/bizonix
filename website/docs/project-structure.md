# Project structure

Run commands from `website/`, the Next.js application root.

```text
src/
  app/                     Routes, metadata, API endpoints and global CSS
  components/
    layout/                Shared header, footer, navigation and CTA
    ui/                    Reusable primitives and their scoped styles
    pages/<page>/          Page components, sections, parts and <page>.module.css
  hooks/                   Shared client hooks
  lib/content/<page>/      Typed page and section content
  lib/site-config.ts       Site identity and navigation
public/images/
  shared/brand/            Logos, icon and footer photograph
  shared/social/           Open Graph artwork
  shared/product-screens/  Screenshots reused across pages
  about/                   Hero, story and values
  product/                 Hero, day-in-life, operating-model, pillars, security, etc.
  modules/                 Hero and overview/editorial imagery
  industries/              Industry detail, overview, pain and proof imagery
references/                Design references and source artwork; not served
scripts/                   Repeatable project and browser audits
docs/                      Architecture, inventories and requirements
```

## CSS conventions

Each page family has one real CSS Module, not an import-only wrapper: Home, Product, Features, Modules, Industries, About and Contact. Index and dynamic detail routes share their family's stylesheet. Find a section using its `SECTION` comment. Classes and keyframes have section prefixes to avoid collisions. CSS compositions are preserved. Add new styles to the family file and import it using `@/components/pages/<page>/<page>.module.css`.

Shared UI primitives can keep their own module. `src/app/globals.css` retains Tailwind, tokens, shared layout and existing global selectors to preserve the current cascade. It contains historical page rules and overrides; consolidation does not establish that those rules are all needed. Remove them only after route-by-route visual comparison. Inline animation, chart geometry and data-driven color values remain in components.

The [style migration map](style-migration.json) records original stylesheet paths, new paths, prefixes and removed unreferenced stylesheets.

## Images

Use `/images/...` URLs; `public` is not part of the URL. Shared images have one canonical copy. [Image inventory](image-inventory.md) lists every image and its direct consuming section or content file. Product imagery reused by Modules stays under its Product section and lists both consumers. UI simulations may be JSX, SVG or canvas rather than stored images.

[Asset migration](asset-migration.json) maps previous and new URLs. Application references are updated; external consumers of old asset URLs would need updating. Framework icons remain in `src/app/icon.svg` and `src/app/favicon.ico`. Design source material is in `references/source-images/` and requirements in `docs/requirements/`.

## Unused code

[Unused code](unused-code.md) lists files unreachable from App Router entry points via imports, re-exports or literal dynamic imports. Candidates are retained for review. [Legacy style issues](legacy-style-issues.json) records missing classes in unreachable components; repair these before reuse. Static reachability cannot prove that computed runtime references or external public URLs are unused.

## Verification

- `pnpm audit:project` validates local imports, active static CSS references, stylesheet locations and literal image URLs.
- `pnpm audit:project:write` refreshes the inventories.
- `pnpm check` runs the structure audit, lint, TypeScript and production build.
- Browser audits are in `scripts/hero-qa/` and `scripts/module-*-audit.mjs`.

Local migration backups and logs are ignored under `.audit/`; they are not production source.

## Remaining release checks

A successful build is not a full production-readiness certification. Review [content gaps](content-gaps.md), legal content, contact details and email transport configuration before release. The API's in-memory rate limiter needs a shared store for multiple instances. Visual and interaction coverage should include responsive layouts and animated sections before pruning historical global CSS.
