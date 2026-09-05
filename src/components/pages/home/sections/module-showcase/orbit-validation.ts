/**
 * Development-only geometry diagnostics for the module orbit.
 *
 * Measures the live DOM after layout and asserts the invariants the design
 * depends on: no module overlaps, core centring within tolerance, clearances
 * from the heading and CTA, containment inside the section, and no horizontal
 * page overflow. Production builds never call into this module.
 */

type Rect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

const rectGap = (a: Rect, b: Rect): number => {
  const dx = Math.max(b.left - a.right, a.left - b.right);
  const dy = Math.max(b.top - a.bottom, a.top - b.bottom);
  // Separated on at least one axis → the gap is the larger axis distance.
  if (dx >= 0 || dy >= 0) return Math.max(dx, dy);
  // Overlapping on both axes → negative penetration depth.
  return -Math.min(Math.abs(dx), Math.abs(dy));
};

const fmt = (label: string, rect: Rect): string =>
  `${label}(${Math.round(rect.left)},${Math.round(rect.top)} → ${Math.round(
    rect.right,
  )},${Math.round(rect.bottom)})`;

/** Runs every geometry assertion; logs a concise report. Dev only. */
export function validateOrbitGeometry(section: HTMLElement): boolean {
  if (process.env.NODE_ENV === "production") return true;

  const stage = section.querySelector<HTMLElement>("[data-ms-stage]");
  const core = section.querySelector<HTMLElement>("[data-ms-core]");
  const header = section.querySelector<HTMLElement>("[data-ms-header]");
  const cta = section.querySelector<HTMLElement>("[data-ms-cta]");
  const nodes = Array.from(
    section.querySelectorAll<HTMLElement>("[data-ms-node]"),
  );
  if (!stage || !core || nodes.length === 0) return true;

  const errors: string[] = [];
  const stageRect = stage.getBoundingClientRect();
  const coreRect = core.getBoundingClientRect();
  const nodeRects = nodes.map((node) => node.getBoundingClientRect());

  // 1. Core centring: the orbit's mathematical centre is the stage centre.
  const centerTolerance = 8;
  const coreOffsetX = Math.abs(
    coreRect.left + coreRect.width / 2 - (stageRect.left + stageRect.width / 2),
  );
  const coreOffsetY = Math.abs(
    coreRect.top + coreRect.height / 2 - (stageRect.top + stageRect.height / 2),
  );
  if (coreOffsetX > centerTolerance || coreOffsetY > centerTolerance) {
    errors.push(
      `core is off-centre by (${coreOffsetX.toFixed(1)}px, ${coreOffsetY.toFixed(1)}px) — tolerance ${centerTolerance}px`,
    );
  }

  // 2. Module ↔ module clearance.
  for (let i = 0; i < nodeRects.length; i += 1) {
    for (let j = i + 1; j < nodeRects.length; j += 1) {
      const gap = rectGap(nodeRects[i], nodeRects[j]);
      if (gap < 2) {
        errors.push(
          `module ${i + 1} overlaps module ${j + 1} (gap ${gap.toFixed(1)}px) — ${fmt(
            "a",
            nodeRects[i],
          )} ${fmt("b", nodeRects[j])}`,
        );
      }
    }
  }

  // 3. Module ↔ core clearance.
  nodeRects.forEach((rect, index) => {
    const gap = rectGap(rect, coreRect);
    if (gap < 2) {
      errors.push(
        `module ${index + 1} overlaps the core (gap ${gap.toFixed(1)}px)`,
      );
    }
  });

  // 4. Module ↔ heading / CTA clearance.
  for (const [label, rect] of [
    ["heading", header?.getBoundingClientRect()],
    ["CTA", cta?.getBoundingClientRect()],
  ] as const) {
    if (!rect) continue;
    nodeRects.forEach((nodeRect, index) => {
      const gap = rectGap(nodeRect, rect);
      if (gap < 2) {
        errors.push(
          `module ${index + 1} overlaps the ${label} (gap ${gap.toFixed(1)}px)`,
        );
      }
    });
  }

  // 5. Modules stay inside the section's horizontal bounds.
  const sectionRect = section.getBoundingClientRect();
  nodeRects.forEach((rect, index) => {
    if (rect.left < sectionRect.left - 1 || rect.right > sectionRect.right + 1) {
      errors.push(
        `module ${index + 1} escapes the section horizontally — ${fmt(
          "node",
          rect,
        )} ${fmt("section", sectionRect)}`,
      );
    }
  });

  // 6. No horizontal page overflow; name the offenders if there are any.
  const overflow = document.documentElement.scrollWidth - window.innerWidth;
  if (overflow > 1) {
    const offenders = Array.from(document.querySelectorAll<HTMLElement>("*"))
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.right > window.innerWidth + 1;
      })
      .slice(0, 5)
      .map((el) => el.tagName.toLowerCase() + (el.className ? `.${String(el.className).split(" ")[0]}` : ""));
    errors.push(
      `page overflows horizontally by ${overflow}px — offenders: ${
        offenders.join(", ") || "unknown"
      }`,
    );
  }

  if (errors.length > 0) {
    console.error(
      `[module-showcase] geometry validation failed (${errors.length}):\n - ${errors.join("\n - ")}`,
    );
    return false;
  }
  console.info(
    `[module-showcase] geometry validated @ ${Math.round(sectionRect.width)}×${Math.round(
      sectionRect.height,
    )} — 9 modules, centred core (Δ${coreOffsetX.toFixed(1)},${coreOffsetY.toFixed(1)}px)`,
  );
  return true;
}
