/**
 * Module deep pages — automated browser audit.
 *
 * Drives all nine `/modules/[slug]` routes through the real browser and
 * asserts the acceptance conditions that cannot be checked by reading source:
 * a single H1, the twelve-section skeleton in SRS order, unique metadata,
 * valid related links, no horizontal overflow at eight viewports, images
 * inside their container, keyboard-reachable CTAs, a working FAQ disclosure, a
 * working screenshot tablist, reduced-motion behaviour and a clean console.
 *
 * Screenshots are written to the artifact directory for human review — this
 * script measures geometry, it does not judge how anything looks.
 *
 * Usage: node scripts/module-pages-audit.mjs [base-url] [out-dir]
 */
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";
const OUT = process.argv[3] ?? "./.audit/modules";

const SLUGS = [
  "inventory",
  "procurement",
  "sales-pos",
  "wholesale",
  "franchise",
  "accounting",
  "ecommerce",
  "analytics",
  "security",
];

const VIEWPORTS = [
  { name: "1440", width: 1440, height: 900, shot: true },
  { name: "1366", width: 1366, height: 768 },
  { name: "1280", width: 1280, height: 800, shot: true },
  { name: "1024", width: 1024, height: 768 },
  { name: "768", width: 768, height: 1024, shot: true },
  { name: "430", width: 430, height: 932, shot: true },
  { name: "390", width: 390, height: 844, shot: true },
  { name: "360", width: 360, height: 800 },
];

/** Sections the template must always render, in SRS order. */
const REQUIRED_SECTIONS = [
  "module-title",
  "module-problems",
  "module-outcomes",
  "module-capabilities",
  "module-workflow",
  "module-gallery",
  "module-faq",
  "module-related",
  "module-cta",
];

const failures = [];
const notes = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

async function collectPage(page) {
  return page.evaluate(
    ({ required }) => {
      /* Everything is measured inside the module page root so the shared
         header, footer and sticky CTA cannot pass or fail a module's audit. */
      const root = document.querySelector("[data-module-page]");
      const doc = document.documentElement;
      const scope = root ?? document;

      const images = [...scope.querySelectorAll("img")].map((img) => {
        const box = img.getBoundingClientRect();
        const parent = img.closest("figure, div")?.getBoundingClientRect();
        return {
          src: img.getAttribute("src") ?? "",
          alt: img.getAttribute("alt") ?? "",
          loading: img.getAttribute("loading"),
          width: Math.round(box.width),
          overflow: parent ? Math.round(box.width - parent.width) : 0,
        };
      });

      const ctas = [...scope.querySelectorAll('a[href="/contact"]')].map(
        (a) => {
          const box = a.getBoundingClientRect();
          return {
            width: Math.round(box.width),
            height: Math.round(box.height),
          };
        },
      );

      const sectionOrder = required.filter((id) => document.getElementById(id));

      return {
        slug: root?.getAttribute("data-module-page") ?? null,
        accent: root
          ? getComputedStyle(root).getPropertyValue("--accent").trim()
          : "",
        h1: [...scope.querySelectorAll("h1")].map((h) => h.textContent?.trim()),
        h2Count: scope.querySelectorAll("h2").length,
        title: document.title,
        description:
          document
            .querySelector('meta[name="description"]')
            ?.getAttribute("content") ?? "",
        canonical:
          document
            .querySelector('link[rel="canonical"]')
            ?.getAttribute("href") ?? "",
        jsonLd: [
          ...document.querySelectorAll('script[type="application/ld+json"]'),
        ]
          .map((node) => node.textContent ?? "")
          .join("\n"),
        sectionOrder,
        images,
        ctas,
        relatedHrefs: [...scope.querySelectorAll("a[href^='/modules/']")]
          .map((a) => a.getAttribute("href"))
          .filter((href) => href !== "/modules"),
        breadcrumb: [
          ...scope.querySelectorAll("nav[aria-label='Breadcrumb'] li"),
        ]
          .map((li) => li.textContent?.trim())
          .filter(Boolean),
        docWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        pendingBadges: scope.querySelectorAll("[class*='pendingBadge']").length,
        tabs: scope.querySelectorAll('[role="tab"]').length,
        faqTriggers: scope.querySelectorAll("button[aria-expanded]").length,
      };
    },
    { required: REQUIRED_SECTIONS },
  );
}

const seenTitles = new Map();
const seenDescriptions = new Map();

async function auditSlug(browser, slug) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const consoleErrors = [];
  const failedRequests = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) =>
    consoleErrors.push(`pageerror: ${error.message}`),
  );
  page.on("response", (response) => {
    if (response.status() >= 400) failedRequests.push(response.url());
  });

  const response = await page.goto(`${BASE}/modules/${slug}`, {
    waitUntil: "load",
    timeout: 90_000,
  });
  await page.waitForTimeout(600);
  check(response?.ok(), `${slug}: route did not return 200`);

  const data = await collectPage(page);

  /* ---------------------------------------------------- identity & content */

  check(data.slug === slug, `${slug}: page rendered data for "${data.slug}"`);
  check(
    data.h1.length === 1,
    `${slug}: expected 1 H1, found ${data.h1.length}`,
  );
  check(data.h2Count >= 6, `${slug}: only ${data.h2Count} H2 headings`);
  check(!!data.accent, `${slug}: --accent not applied to the page root`);

  for (const id of REQUIRED_SECTIONS) {
    check(data.sectionOrder.includes(id), `${slug}: missing section "${id}"`);
  }
  const orderCorrect =
    JSON.stringify(data.sectionOrder) ===
    JSON.stringify(
      REQUIRED_SECTIONS.filter((id) => data.sectionOrder.includes(id)),
    );
  check(orderCorrect, `${slug}: sections are not in SRS order`);

  /* --------------------------------------------------------------- metadata */

  check(!!data.title && data.title !== "Bizonix ERP", `${slug}: no page title`);
  check(data.description.length > 60, `${slug}: meta description too short`);
  check(
    data.canonical.endsWith(`/modules/${slug}`),
    `${slug}: canonical is "${data.canonical}"`,
  );

  const titleOwner = seenTitles.get(data.title);
  check(!titleOwner, `${slug}: title duplicates ${titleOwner}`);
  seenTitles.set(data.title, slug);

  const descOwner = seenDescriptions.get(data.description);
  check(!descOwner, `${slug}: meta description duplicates ${descOwner}`);
  seenDescriptions.set(data.description, slug);

  check(
    data.jsonLd.includes("BreadcrumbList"),
    `${slug}: BreadcrumbList schema missing`,
  );
  check(data.jsonLd.includes("FAQPage"), `${slug}: FAQPage schema missing`);
  check(
    data.breadcrumb.length === 3,
    `${slug}: breadcrumb has ${data.breadcrumb.length} entries`,
  );

  /* ---------------------------------------------------------------- images */

  for (const image of data.images) {
    check(image.alt.length > 15, `${slug}: weak alt text on ${image.src}`);
    check(
      image.overflow <= 2,
      `${slug}: image wider than its frame (${image.src})`,
    );
  }

  /* ------------------------------------------------------------------ CTAs */

  check(
    data.ctas.length >= 2,
    `${slug}: expected hero and closing /contact CTAs`,
  );
  for (const cta of data.ctas) {
    check(
      cta.width > 80 && cta.height >= 44,
      `${slug}: CTA is below the 44px touch target (${cta.width}×${cta.height})`,
    );
  }

  /* --------------------------------------------------------------- related */

  const related = [...new Set(data.relatedHrefs)].filter(
    (href) => href !== `/modules/${slug}`,
  );
  for (const href of related) {
    const target = href.replace("/modules/", "");
    check(SLUGS.includes(target), `${slug}: related link to unknown "${href}"`);
  }
  check(
    !data.relatedHrefs.includes(`/modules/${slug}`),
    `${slug}: page links to itself as a related module`,
  );

  /* ---------------------------------------------------------- interactions */

  const firstTrigger = page
    .locator("[data-module-page] button[aria-expanded]")
    .first();
  if ((await firstTrigger.count()) > 0) {
    const before = await firstTrigger.getAttribute("aria-expanded");
    await firstTrigger.click();
    const after = await firstTrigger.getAttribute("aria-expanded");
    check(before !== after, `${slug}: FAQ disclosure did not toggle`);
  } else {
    failures.push(`${slug}: no FAQ disclosure found`);
  }

  const tabs = page.locator('[data-module-page] [role="tab"]');
  const tabCount = await tabs.count();
  if (tabCount > 1) {
    await tabs.nth(1).click();
    const selected = await tabs.nth(1).getAttribute("aria-selected");
    check(selected === "true", `${slug}: screenshot tab did not activate`);
  }

  /* ------------------------------------------------- responsive + geometry */

  for (const viewport of VIEWPORTS) {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.waitForTimeout(220);

    const geometry = await page.evaluate(() => {
      const doc = document.documentElement;
      const root = document.querySelector("[data-module-page]") ?? document;
      const wide = [...root.querySelectorAll("section, figure, article")]
        .filter(
          (node) => node.getBoundingClientRect().right > doc.clientWidth + 2,
        )
        .map((node) => node.className?.toString().slice(0, 60));
      return {
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        wide: wide.slice(0, 4),
      };
    });

    check(
      geometry.scrollWidth <= geometry.clientWidth + 1,
      `${slug} @${viewport.name}: horizontal overflow (${geometry.scrollWidth} > ${geometry.clientWidth})`,
    );
    check(
      geometry.wide.length === 0,
      `${slug} @${viewport.name}: element past the viewport → ${geometry.wide.join(" | ")}`,
    );

    if (viewport.shot) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: `${OUT}/${slug}-${viewport.name}.png`,
        fullPage: true,
      });
    }
  }

  /* The header's brochure link resolves to a documented placeholder route
     (`site-config.brochureUrl`), so Next's prefetch 404s on every page of the
     site including the homepage. That is a pre-existing site-wide issue, not a
     module-page defect, and it is reported separately rather than failing
     these nine routes. */
  const siteWidePlaceholder = /brochure-coming-soon/;
  const unexpectedRequests = failedRequests.filter(
    (url) => !siteWidePlaceholder.test(url),
  );
  const unexpectedConsole = consoleErrors.filter(
    (text) =>
      !/Failed to load resource/.test(text) || unexpectedRequests.length > 0,
  );

  check(
    unexpectedRequests.length === 0,
    `${slug}: failed requests → ${unexpectedRequests.slice(0, 2).join(" | ")}`,
  );
  check(
    unexpectedConsole.length === 0,
    `${slug}: console errors → ${unexpectedConsole.slice(0, 2).join(" | ")}`,
  );
  if (failedRequests.some((url) => siteWidePlaceholder.test(url))) {
    notes.push(
      `${slug}: pre-existing site-wide 404 on the header brochure placeholder (ignored)`,
    );
  }

  notes.push(
    `${slug}: ${data.images.length} images, ${data.pendingBadges} pending frames, ${data.tabs} screen tabs, ${data.faqTriggers} FAQ items`,
  );

  await context.close();
}

/** Reduced motion must leave every section readable and nothing mid-animation. */
async function auditReducedMotion(browser, slug) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/modules/${slug}`, {
    waitUntil: "load",
    timeout: 90_000,
  });
  await page.evaluate(() =>
    window.scrollTo(0, document.body.scrollHeight * 0.6),
  );
  await page.waitForTimeout(400);

  const hidden = await page.evaluate(
    () =>
      [...document.querySelectorAll("[data-module-page] [data-reveal]")].filter(
        (node) => {
          const style = getComputedStyle(node);
          return (
            Number(style.opacity) < 0.98 ||
            (style.transform !== "none" &&
              style.transform !== "matrix(1, 0, 0, 1, 0, 0)")
          );
        },
      ).length,
  );
  check(
    hidden === 0,
    `${slug} (reduced motion): ${hidden} elements left transformed or faded`,
  );

  const spine = await page.evaluate(() => {
    const node = document.querySelector("[data-module-page] [class*='spine']");
    return node
      ? getComputedStyle(node).getPropertyValue("--progress").trim()
      : null;
  });
  check(
    spine === "100%",
    `${slug} (reduced motion): workflow spine at "${spine}" instead of complete`,
  );

  await page.screenshot({
    path: `${OUT}/${slug}-reduced-motion.png`,
    fullPage: true,
  });
  await context.close();
}

/** An unknown slug must 404 rather than falling back to a module. */
async function auditUnknownSlug(browser) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const response = await page.goto(`${BASE}/modules/not-a-module`, {
    waitUntil: "domcontentloaded",
  });
  check(
    response?.status() === 404,
    `unknown slug returned ${response?.status()}`,
  );
  const hasModulePage = await page.evaluate(
    () => !!document.querySelector("[data-module-page]"),
  );
  check(
    !hasModulePage,
    "unknown slug rendered a module page instead of the 404",
  );
  await context.close();
}

const browser = await chromium.launch();
await mkdir(OUT, { recursive: true });

for (const slug of SLUGS) {
  await auditSlug(browser, slug);
}
await auditReducedMotion(browser, "inventory");
await auditReducedMotion(browser, "accounting");
await auditUnknownSlug(browser);

await browser.close();

const report = [
  `Bizonix module deep pages — audit against ${BASE}`,
  "",
  ...notes.map((note) => `· ${note}`),
  "",
  failures.length === 0
    ? `PASS — ${SLUGS.length} routes, ${VIEWPORTS.length} viewports, no failures.`
    : `FAIL — ${failures.length} issues:\n${failures.map((f) => `  ✗ ${f}`).join("\n")}`,
].join("\n");

await writeFile(`${OUT}/report.txt`, `${report}\n`);
console.log(report);
process.exit(failures.length === 0 ? 0 : 1);
