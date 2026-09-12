import {
  galleryFrameAspect,
  HERO_FRAME_ASPECT,
  projectOntoFrame,
} from "./frame-geometry";
import { modulePages } from "./index";
import { outcomeVisualRegistry } from "./outcome-visuals";
import { productScreens } from "./product-screens";
import {
  moduleSlugs,
  problemVisualIds,
  type ModuleData,
  type ModuleSlug,
} from "./types";

/**
 * Development-time validation of the nine module configurations.
 *
 * Split into `errors` (things that must fail a build or test — a broken route,
 * a duplicated meta description, a malformed screenshot) and `warnings`
 * (production assets that are legitimately still missing, such as an uncaptured
 * screen or absent customer proof). Run through `scripts/validate-modules.mjs`.
 */

export type ValidationIssue = { slug: ModuleSlug | "*"; message: string };

export type ValidationReport = {
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
};

const REQUIRED_OUTCOMES = 3;
const REQUIRED_PROBLEMS = 3;
const REQUIRED_CONSEQUENCES = 3;
const REQUIRED_RELATED = 3;
const MIN_WORKFLOW_STEPS = 4;
const MAX_WORKFLOW_STEPS = 6;
const MIN_SHOTS = 4;
const MAX_SHOTS = 6;
const MIN_FAQ = 4;
const MAX_FAQ = 6;

function normalise(text: string) {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * The problem beat.
 *
 * Three columns exactly — the section's geometry is three equal columns, and
 * a fourth pain would either break the grid or be dropped silently. Each one
 * has to name a visual that exists, because an unresolved identifier renders
 * an empty column rather than an obvious error.
 */
function validateProblemSection(
  data: ModuleData,
  fail: (message: string) => void,
) {
  const section = data.problemSection;
  if (section.presentation !== "visual-stories") {
    fail("problem section must use the universal visual-stories presentation");
  }

  for (const [field, value] of [
    ["problemSection.eyebrow", section.eyebrow],
    ["problemSection.title", section.title],
    ["problemSection.intro", section.intro],
    ["problemSection.consequence.title", section.consequence.title],
  ] as const) {
    if (!value || !value.trim()) fail(`missing required field: ${field}`);
  }

  if (section.problems.length !== REQUIRED_PROBLEMS) {
    fail(
      `expected ${REQUIRED_PROBLEMS} problems, found ${section.problems.length}`,
    );
  }

  const ids = section.problems.map((problem) => problem.id);
  if (new Set(ids).size !== ids.length) {
    fail("problem ids must be unique within a module");
  }

  section.problems.forEach((problem, index) => {
    const where = `problem "${problem.id}"`;
    for (const [field, value] of [
      ["title", problem.title],
      ["description", problem.description],
      ["quote", problem.quote],
    ] as const) {
      if (!value || !value.trim()) fail(`${where} is missing ${field}`);
    }
    const expected = String(index + 1).padStart(2, "0");
    if (problem.number !== expected) {
      fail(`${where} is numbered "${problem.number}", expected "${expected}"`);
    }
    if (!(problemVisualIds as readonly string[]).includes(problem.visual)) {
      fail(`${where} names unregistered visual "${problem.visual}"`);
    }
  });

  const visuals = section.problems.map((problem) => problem.visual);
  if (new Set(visuals).size !== visuals.length) {
    fail("a module cannot draw the same problem visual twice");
  }

  const items = section.consequence.items;
  if (items.length !== REQUIRED_CONSEQUENCES) {
    fail(
      `expected ${REQUIRED_CONSEQUENCES} consequences, found ${items.length}`,
    );
  }
  for (const item of items) {
    if (!item.label?.trim() || !item.body?.trim()) {
      fail(`consequence "${item.id}" needs both a label and a body`);
    }
  }

  /* This section describes friction, not measured outcomes. A percentage or a
     currency figure in a consequence would be a fabricated metric — the one
     thing the page must never carry. */
  for (const item of items) {
    if (/\d+\s*%|₹\s*\d|\bhours?\b|\bx\s*faster\b/i.test(item.body)) {
      fail(
        `consequence "${item.id}" reads as a metric; consequences stay qualitative`,
      );
    }
  }
}

function validateModule(
  data: ModuleData,
  errors: ValidationIssue[],
  warnings: ValidationIssue[],
) {
  const slug = data.slug;
  const fail = (message: string) => errors.push({ slug, message });
  const warn = (message: string) => warnings.push({ slug, message });

  /* ------------------------------------------------------------- required */

  for (const [field, value] of [
    ["title", data.title],
    ["eyebrow", data.eyebrow],
    ["outcome", data.outcome],
    ["intro", data.intro],
    ["hero.headline", data.hero.headline],
    ["hero.body", data.hero.body],
    ["seo.title", data.seo.title],
    ["seo.description", data.seo.description],
  ] as const) {
    if (!value || !value.trim()) fail(`missing required field: ${field}`);
  }

  if (data.hero.chain.length < 3) {
    fail(`hero.chain needs at least 3 nodes, has ${data.hero.chain.length}`);
  }
  if (data.hero.facts.length !== 3) {
    fail(`hero.facts must have exactly 3 entries, has ${data.hero.facts.length}`);
  }
  /* The accent is rendered by splitting the headline, so it has to be a real
     suffix of it — otherwise the emphasis would silently disappear. */
  if (!data.hero.headline.endsWith(data.hero.headlineAccent)) {
    fail(
      `hero.headlineAccent "${data.hero.headlineAccent}" is not the end of hero.headline`,
    );
  }
  if (data.hero.headline.split(/\s+/).length > 9) {
    fail(`hero.headline is ${data.hero.headline.split(/\s+/).length} words, max 9`);
  }
  if (data.hero.body.split(/\s+/).length > 24) {
    fail(`hero.body is ${data.hero.body.split(/\s+/).length} words, max 24`);
  }
  if (!data.hero.primaryCta.href) fail("hero.primaryCta.href is empty");

  /* A hero note has to point at something the reader can actually see. The
     hero canvas crops its capture, so a coordinate that is valid against the
     file can still land in the part the crop discarded — `projectOntoFrame`
     returns null for exactly that case, and it is a build failure rather than
     a silently dropped pin. */
  const heroScreen = data.hero.screen;
  if (heroScreen) {
    if (!(heroScreen.id in productScreens)) {
      fail(`hero points at unknown screen "${heroScreen.id}"`);
    }
    if (!heroScreen.alt || heroScreen.alt.length < 20) {
      fail("hero screen needs meaningful alt text");
    }
    const notes = heroScreen.annotations ?? [];
    if (notes.length > 3) {
      fail(`hero carries ${notes.length} notes; three is the maximum`);
    }
    const noteIds = notes.map((note) => note.id);
    if (new Set(noteIds).size !== noteIds.length) {
      fail("hero note ids must be unique");
    }
    for (const note of notes) {
      if (!projectOntoFrame(heroScreen.id, HERO_FRAME_ASPECT, note)) {
        fail(
          `hero note "${note.id}" sits at ${note.x}%,${note.y}% of the capture, which the hero crop removes — it would point at nothing`,
        );
      }
    }
  }

  validateProblemSection(data, fail);
  if (data.outcomesSection.outcomes.length !== REQUIRED_OUTCOMES) {
    fail(`expected ${REQUIRED_OUTCOMES} outcomes, found ${data.outcomesSection.outcomes.length}`);
  }
  data.outcomesSection.outcomes.forEach((outcome, index) => {
    const expectedNumber = String(index + 1).padStart(2, "0");
    if (outcome.number !== expectedNumber) {
      fail(`outcome "${outcome.id}" must be numbered ${expectedNumber}`);
    }
    if (!(outcome.visualVariant in outcomeVisualRegistry)) {
      fail(`outcome "${outcome.id}" has an unknown visual variant`);
    }
    if (!outcome.description.trim()) {
      fail(`outcome "${outcome.id}" needs a description`);
    }
  });
  if (data.capabilities.groups.length < 2) {
    fail("capabilities need at least 2 groups");
  }
  for (const group of data.capabilities.groups) {
    if (group.items.length < 3 || group.items.length > 6) {
      fail(
        `capability group "${group.id}" must hold 3–6 items, has ${group.items.length}`,
      );
    }
  }

  const steps = data.workflow.steps.length;
  if (steps < MIN_WORKFLOW_STEPS || steps > MAX_WORKFLOW_STEPS) {
    fail(`workflow must have ${MIN_WORKFLOW_STEPS}–${MAX_WORKFLOW_STEPS} steps, has ${steps}`);
  }
  /* Lanes are all-or-nothing: the workflow lays every step out on the same
     rows, so a lane on some steps and not others would break the alignment
     and read as missing data rather than as a deliberate absence. */
  const laned = data.workflow.steps.filter((step) => step.lane).length;
  if (laned > 0 && laned < data.workflow.steps.length) {
    fail("a workflow with lanes needs a lane on every step");
  }

  /* ---------------------------------------------------------- screenshots */

  const shots = data.gallery.shots;
  if (shots.length < MIN_SHOTS || shots.length > MAX_SHOTS) {
    fail(`gallery must hold ${MIN_SHOTS}–${MAX_SHOTS} screenshots, has ${shots.length}`);
  }
  const featured = shots.filter((shot) => shot.featured);
  if (featured.length !== 1) {
    fail(`exactly one screenshot must be featured, found ${featured.length}`);
  }
  const orders = shots.map((shot) => shot.order);
  if (new Set(orders).size !== orders.length) {
    fail("screenshot `order` values must be unique");
  }
  const shotIds = shots.map((shot) => shot.id);
  if (new Set(shotIds).size !== shotIds.length) {
    fail("screenshot ids must be unique within a module");
  }
  for (const shot of shots) {
    if (shot.state === "captured") {
      if (!(shot.screen in productScreens)) {
        fail(`screenshot "${shot.id}" points at unknown screen "${shot.screen}"`);
      }
      if (!shot.alt || shot.alt.length < 20) {
        fail(`screenshot "${shot.id}" needs meaningful alt text`);
      }
      const pinIds = (shot.annotations ?? []).map((pin) => pin.id);
      if (new Set(pinIds).size !== pinIds.length) {
        fail(`annotation ids on "${shot.id}" must be unique`);
      }
      for (const pin of shot.annotations ?? []) {
        if (pin.x < 0 || pin.x > 100 || pin.y < 0 || pin.y > 100) {
          fail(`annotation "${pin.id}" on "${shot.id}" is outside the image`);
        } else if (
          !projectOntoFrame(shot.screen, galleryFrameAspect(shot.screen), pin)
        ) {
          fail(
            `annotation "${pin.id}" on "${shot.id}" falls outside the frame the gallery renders`,
          );
        }
      }
    } else {
      warn(`screenshot "${shot.id}" (${shot.title}) is awaiting capture`);
    }
  }
  if (!shots.some((shot) => shot.state === "captured")) {
    warn("no captured product screen on this page — gallery is fully pending");
  }

  /* ------------------------------------------------------------------ faq */

  if (data.faq.length < MIN_FAQ || data.faq.length > MAX_FAQ) {
    fail(`FAQ must hold ${MIN_FAQ}–${MAX_FAQ} questions, has ${data.faq.length}`);
  }

  /* -------------------------------------------------------------- related */

  if (data.relatedModules.length !== REQUIRED_RELATED) {
    fail(
      `expected ${REQUIRED_RELATED} related modules, found ${data.relatedModules.length}`,
    );
  }
  for (const related of data.relatedModules) {
    if (related === slug) fail("a module cannot list itself as related");
    if (!(related in modulePages)) fail(`related module "${related}" does not exist`);
  }
  if (new Set(data.relatedModules).size !== data.relatedModules.length) {
    fail("related modules must be distinct");
  }

  /* --------------------------------------------------- optional evidence */

  if (!data.proof) warn("no approved customer proof — proof section omitted");
  if (!data.video) warn("no walkthrough recording — video section omitted");
  if (
    !data.verticalRelevance.apparel ||
    !data.verticalRelevance.jewellery ||
    !data.verticalRelevance.franchise
  ) {
    fail("context section requires apparel, jewellery and franchise content");
  }
}

/** Detects the same copy being reused across two different modules. */
function validateCrossModule(errors: ValidationIssue[]) {
  const seen = new Map<string, { slug: ModuleSlug; field: string }>();

  const claim = (slug: ModuleSlug, field: string, value: string) => {
    const key = `${field}::${normalise(value)}`;
    const previous = seen.get(key);
    if (previous) {
      errors.push({
        slug,
        message: `${field} duplicates ${previous.slug} — module content must be distinct`,
      });
      return;
    }
    seen.set(key, { slug, field });
  };

  for (const slug of moduleSlugs) {
    const data = modulePages[slug];
    claim(slug, "seo.title", data.seo.title);
    claim(slug, "seo.description", data.seo.description);
    claim(slug, "hero.headline", data.hero.headline);
    claim(slug, "hero.body", data.hero.body);
    claim(slug, "outcome", data.outcome);
    for (const problem of data.problemSection.problems) {
      claim(slug, "problem", problem.title);
      /* A visual belongs to exactly one module. Sharing one would mean two
         modules illustrating their friction with the same drawing, which is
         the failure mode this section exists to avoid. */
      claim(slug, "problem visual", problem.visual);
    }
    claim(slug, "problem headline", data.problemSection.title);
    for (const item of data.problemSection.consequence.items) {
      claim(slug, "consequence", item.label);
    }
    for (const outcome of data.outcomesSection.outcomes) claim(slug, "outcome item", outcome.title);
    for (const item of data.faq) claim(slug, "faq question", item.question);
  }
}

export function validateModulePages(): ValidationReport {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  const slugs = new Set<string>();
  for (const slug of moduleSlugs) {
    const data = modulePages[slug];
    if (!data) {
      errors.push({ slug: "*", message: `no data registered for "${slug}"` });
      continue;
    }
    if (data.slug !== slug) {
      errors.push({ slug, message: `data.slug is "${data.slug}" but registered as "${slug}"` });
    }
    if (slugs.has(slug)) {
      errors.push({ slug, message: "duplicate slug in the registry" });
    }
    slugs.add(slug);
    validateModule(data, errors, warnings);
  }

  validateCrossModule(errors);

  return { errors, warnings };
}

let asserted = false;

/**
 * Build-time gate, called from the route's `generateStaticParams`.
 *
 * Errors throw and take the build down — a broken related slug or a duplicated
 * meta description must never reach production. Warnings are printed once:
 * they record content that is legitimately still outstanding (an uncaptured
 * screen, absent customer proof) and are the checklist to work through before
 * launch.
 */
export function assertModulePagesValid(): void {
  if (asserted) return;
  asserted = true;

  const { errors, warnings } = validateModulePages();

  if (process.env.NODE_ENV !== "production" && warnings.length > 0) {
    const grouped = warnings.reduce<Record<string, string[]>>((all, issue) => {
      (all[issue.slug] ??= []).push(issue.message);
      return all;
    }, {});
    console.warn(
      `\n[modules] ${warnings.length} content items pending across ${Object.keys(grouped).length} modules:\n` +
        Object.entries(grouped)
          .map(([slug, messages]) =>
            messages.map((message) => `  · ${slug}: ${message}`).join("\n"),
          )
          .join("\n") +
        "\n",
    );
  }

  if (errors.length > 0) {
    throw new Error(
      `Module page data is invalid:\n${errors
        .map((issue) => `  · ${issue.slug}: ${issue.message}`)
        .join("\n")}`,
    );
  }
}
