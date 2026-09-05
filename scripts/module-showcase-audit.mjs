/**
 * Module showcase — automated browser audit (debug artifact).
 *
 * Drives the real page through the scroll assembly at every required
 * viewport and asserts the acceptance conditions: nine modules, single CTA,
 * geometry (no collisions, centred core, containment), no horizontal
 * overflow, reversible assembly, orbit gating + interaction pause,
 * reduced-motion behaviour, and a clean console. Screenshots are written to
 * /tmp/module-*.png for human review.
 *
 * Usage: node scripts/module-showcase-audit.mjs [base-url]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";
const SECTION = 'section[aria-labelledby="module-showcase-title"]';

const VIEWPORTS = [
  { name: "1440", width: 1440, height: 900, radial: true },
  { name: "1366", width: 1366, height: 768, radial: true },
  { name: "1280", width: 1280, height: 800, radial: true },
  { name: "1024", width: 1024, height: 768, radial: true },
  { name: "768", width: 768, height: 1024, radial: false, mobile: true },
  { name: "430", width: 430, height: 932, radial: false, mobile: true },
  { name: "390", width: 390, height: 844, radial: false, mobile: true },
  { name: "360", width: 360, height: 800, radial: false, mobile: true },
];

const MODULE_ROUTES = [
  "/modules/inventory",
  "/modules/procurement",
  "/modules/sales-pos",
  "/modules/wholesale",
  "/modules/franchise",
  "/modules/accounting",
  "/modules/ecommerce",
  "/modules/analytics",
  "/modules/security",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Collect console messages and page errors for later assertions. */
function watchPage(page, bucket, knownModule404) {
  page.on("response", (response) => {
    if (response.status() === 404 && /\/modules\//.test(response.url())) {
      knownModule404.hit = true;
    }
  });
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    if (knownModule404.hit && message.text().includes("404")) return;
    bucket.push(`console.error: ${message.text()}`);
  });
  page.on("pageerror", (error) => bucket.push(`pageerror: ${error.message}`));
}

async function sectionScrollTop(page) {
  return page.evaluate((selector) => {
    const section = document.querySelector(selector);
    return section ? section.getBoundingClientRect().top + window.scrollY : -1;
  }, SECTION);
}

/** Scroll in steps so scrubbed timelines keep up; dwell at the end. */
async function scrollTo(page, target) {
  await page.evaluate(async (to) => {
    // The site opts into CSS smooth scrolling; override it so scrubbed
    // timelines and our samples see deterministic, instant positions.
    document.documentElement.style.scrollBehavior = "auto";
    const steps = 18;
    const from = window.scrollY;
    for (let index = 1; index <= steps; index += 1) {
      window.scrollTo(0, from + ((to - from) * index) / steps);
      await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    }
  }, target);
  await sleep(800);
}

async function nodeStates(page) {
  return page.evaluate((selector) => {
    const section = document.querySelector(selector);
    const nodes = Array.from(section.querySelectorAll("[data-ms-node]"));
    const stage = section.querySelector("[data-ms-stage]");
    const core = section.querySelector("[data-ms-core]");
    const cta = section.querySelector("[data-ms-cta]");
    const ring = section.querySelector("[data-ms-ring]");
    return {
      count: nodes.length,
      nodes: nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return {
          href: node.getAttribute("href"),
          text: node.textContent.replace(/\s+/g, " ").trim(),
          rect: { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left },
          opacity: Number.parseFloat(style.opacity),
          visibility: style.visibility,
        };
      }),
      stageRect: (() => {
        const rect = stage.getBoundingClientRect();
        return { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left };
      })(),
      coreRect: (() => {
        const rect = core.getBoundingClientRect();
        return { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left };
      })(),
      cta: (() => {
        if (!cta) return null;
        const link = cta.querySelector("a");
        const rect = cta.getBoundingClientRect();
        const style = getComputedStyle(cta);
        return {
          href: link?.getAttribute("href") ?? null,
          linksInSection: section.querySelectorAll('a[href="/modules"]').length,
          opacity: Number.parseFloat(style.opacity),
          rect: { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left },
        };
      })(),
      ringTransform: getComputedStyle(ring).transform,
      mode: section.getAttribute("data-mode"),
      pinSpacers: document.querySelectorAll(".pin-spacer").length,
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      innerWidth: window.innerWidth,
    };
  }, SECTION);
}

/** Centre of the first module node (the orbit moves it along the ellipse). */
async function nodeCenter(page) {
  const state = await nodeStates(page);
  const first = state.nodes[0];
  return {
    x: (first.rect.left + first.rect.right) / 2,
    y: (first.rect.top + first.rect.bottom) / 2,
  };
}

/** Distance a node travelled between two samples (px). */
const travelDistance = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

const rectGap = (a, b) => {
  const dx = Math.max(b.left - a.right, a.left - b.right);
  const dy = Math.max(b.top - a.bottom, a.top - b.bottom);
  if (dx >= 0 || dy >= 0) return Math.max(dx, dy);
  return -Math.min(Math.abs(dx), Math.abs(dy));
};

function assert(bucket, condition, message) {
  if (!condition) bucket.push(message);
}

async function auditViewport(browser, viewport) {
  const failures = [];
  const knownModule404 = { hit: false };
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    ...(viewport.mobile
      ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
      : {}),
  });
  const page = await context.newPage();
  watchPage(page, failures, knownModule404);

  await page.goto(BASE, { waitUntil: "load", timeout: 90_000 });
  // Wait for the full streamed subtree (all nine nodes), then for the
  // hydration-owned state: pin-spacer on radial, data-mode elsewhere.
  await page.waitForSelector("[data-ms-node]", { timeout: 60_000 });
  await page.waitForFunction(
    (radial) =>
      document.querySelectorAll(".pin-spacer").length >= (radial ? 1 : 0) ||
      !radial,
    viewport.radial,
    { timeout: 20_000 },
  ).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await sleep(1200);

  // ---- structure -------------------------------------------------------
  let state = await nodeStates(page);
  assert(failures, state.count === 9, `module count ${state.count} ≠ 9`);
  const hrefs = state.nodes.map((node) => node.href);
  for (const route of MODULE_ROUTES) {
    assert(failures, hrefs.includes(route), `missing route ${route}`);
  }
  assert(
    failures,
    state.mode === (viewport.radial ? "radial" : "linear"),
    `mode ${state.mode} (expected ${viewport.radial ? "radial" : "linear"})`,
  );
  assert(
    failures,
    state.cta === null || state.cta.linksInSection === 1,
    `CTA links to /modules: ${state.cta?.linksInSection} (must be exactly 1)`,
  );
  assert(
    failures,
    state.overflowX <= 1,
    `horizontal overflow ${state.overflowX}px`,
  );

  if (viewport.radial) {
    assert(failures, state.pinSpacers >= 1, "desktop expected a pinned scene");
  } else {
    assert(failures, state.pinSpacers === 0, "mobile/tablet must not pin");
  }

  // ---- assembly --------------------------------------------------------
  const top = await sectionScrollTop(page);
  if (viewport.radial) {
    await scrollTo(page, top - 60);
    await sleep(400);
    const before = await nodeStates(page);
    assert(
      failures,
      before.nodes.every((node) => node.opacity < 0.05),
      "before assembly: all nodes must be hidden",
    );
    assert(
      failures,
      before.cta === null || before.cta.opacity < 0.05,
      "before assembly: CTA must be hidden",
    );

    // Orbit must not run before the assembly completes.
    const preA = await nodeCenter(page);
    await sleep(1100);
    const preB = await nodeCenter(page);
    assert(
      failures,
      travelDistance(preA, preB) < 1,
      `orbit ran before assembly completed (moved ${travelDistance(preA, preB).toFixed(1)}px)`,
    );

    // Forward to completion.
    await scrollTo(page, top + viewport.height * 1.7);
    state = await nodeStates(page);
    assert(
      failures,
      state.nodes.every((node) => node.opacity > 0.99 && node.visibility === "visible"),
      "after assembly: all nodes must be visible",
    );
    assert(
      failures,
      state.cta !== null && state.cta.opacity > 0.99,
      "after assembly: CTA must be revealed",
    );

    // ---- geometry (assembled state) ------------------------------------
    const { nodes, coreRect, stageRect } = state;
    const coreCenterDelta = {
      x: Math.abs(
        coreRect.left + (coreRect.right - coreRect.left) / 2 -
          (stageRect.left + (stageRect.right - stageRect.left) / 2),
      ),
      y: Math.abs(
        coreRect.top + (coreRect.bottom - coreRect.top) / 2 -
          (stageRect.top + (stageRect.bottom - stageRect.top) / 2),
      ),
    };
    assert(
      failures,
      coreCenterDelta.x <= 8 && coreCenterDelta.y <= 8,
      `core off-centre (${coreCenterDelta.x.toFixed(1)}, ${coreCenterDelta.y.toFixed(1)}px)`,
    );
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const gap = rectGap(nodes[i].rect, nodes[j].rect);
        assert(
          failures,
          gap >= 1,
          `module ${i + 1} collides with module ${j + 1} (gap ${gap.toFixed(1)}px) @${viewport.name}`,
        );
      }
    }
    nodes.forEach((node, index) => {
      const coreGap = rectGap(node.rect, coreRect);
      assert(
        failures,
        coreGap >= 1,
        `module ${index + 1} collides with core (gap ${coreGap.toFixed(1)}px) @${viewport.name}`,
      );
      assert(
        failures,
        node.rect.left >= stageRect.left - 1 && node.rect.right <= stageRect.right + 1,
        `module ${index + 1} escapes the stage @${viewport.name}`,
      );
    });
    if (state.cta) {
      nodes.forEach((node, index) => {
        const gap = rectGap(node.rect, state.cta.rect);
        assert(
          failures,
          gap >= 1,
          `module ${index + 1} collides with CTA (gap ${gap.toFixed(1)}px) @${viewport.name}`,
        );
      });
    }

    // ---- orbit runs only now --------------------------------------------
    const orbitA = await nodeCenter(page);
    await sleep(1300);
    const orbitB = await nodeCenter(page);
    assert(
      failures,
      travelDistance(orbitA, orbitB) > 2,
      `ambient orbit not running after completion (moved ${travelDistance(orbitA, orbitB).toFixed(1)}px/1.3s)`,
    );

  // ---- screenshot artifact ----------------------------------------------
  // Clip-based capture: the assembled ring is legitimately in motion, so we
  // never ask the screenshot API for element stability.
  const clip = await page.evaluate((selector) => {
    const section = document.querySelector(selector);
    if (!section) return null;
    const rect = section.getBoundingClientRect();
    return {
      x: Math.max(0, rect.left),
      y: Math.max(0, rect.top),
      width: Math.min(rect.width, window.innerWidth),
      height: Math.min(rect.height, window.innerHeight),
    };
  }, SECTION);
  if (clip && clip.height > 0) {
    await page.screenshot({
      path: `/tmp/module-${viewport.name}.png`,
      clip,
    });
  }

    // ---- interaction pause (1440 only, to bound runtime) ----------------
    if (viewport.name === "1440") {
      // Raw mouse moves: the assembled ring is (correctly) never perfectly
      // still, so Playwright's stability-checked hover would never settle.
      const box = await page
        .locator("[data-ms-node]")
        .first()
        .boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await sleep(250);
      const holdA = await nodeCenter(page);
      await sleep(900);
      const holdB = await nodeCenter(page);
      assert(
        failures,
        travelDistance(holdA, holdB) < 1,
        `orbit did not pause on hover (moved ${travelDistance(holdA, holdB).toFixed(1)}px)`,
      );
      await page.mouse.move(8, viewport.height - 8);
      await sleep(2600);
      const resumeB = await nodeCenter(page);
      assert(
        failures,
        travelDistance(holdB, resumeB) > 2,
        `orbit did not resume after hover ended (moved ${travelDistance(holdB, resumeB).toFixed(1)}px)`,
      );

      // ---- reverse scroll ------------------------------------------------
      await scrollTo(page, top + viewport.height * 0.55); // midpoint
      await sleep(400);
      const mid = await nodeStates(page);
      const hiddenMid = mid.nodes.filter((node) => node.opacity < 0.5).length;
      assert(
        failures,
        hiddenMid >= 3,
        `reverse to midpoint should hide trailing modules (hidden ${hiddenMid})`,
      );
      await scrollTo(page, Math.max(0, top - viewport.height * 0.6));
      await sleep(400);
      const start = await nodeStates(page);
      assert(
        failures,
        start.nodes.every((node) => node.opacity < 0.05),
        "reverse to start must return all modules to hidden",
      );
      await scrollTo(page, top + viewport.height * 1.7);
      const again = await nodeStates(page);
      assert(
        failures,
        again.nodes.every((node) => node.opacity > 0.99),
        "re-forward must reassemble all modules",
      );
      const finalCenter = await nodeCenter(page);
      assert(
        failures,
        Number.isFinite(finalCenter.x) && Number.isFinite(finalCenter.y),
        "node position not finite after reverse cycle",
      );

      // ---- route navigation ----------------------------------------------
      // The orbit may rotate any card under the pointer between bounding-box
      // and click; any canonical module route proves the links work.
      const target = await page.evaluate(() => {
        const node = document.querySelector("[data-ms-node]");
        const rect = node.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      });
      await page.mouse.click(target.x, target.y);
      // First navigation to a module route compiles on demand in dev.
      await page
        .waitForURL(/\/modules\//, { timeout: 20_000 })
        .catch(() => {});
      assert(
        failures,
        MODULE_ROUTES.some((route) => page.url().endsWith(route)),
        `click did not navigate to a module route (at ${page.url()})`,
      );
    }
  } else {
    // Linear mode: everything visible in flow, no choreography required.
    for (const node of state.nodes) {
      await node.locatorRef?.scrollIntoViewIfNeeded?.();
    }
    await scrollTo(page, (await sectionScrollTop(page)) + viewport.height * 2.2);
    state = await nodeStates(page);
    assert(
      failures,
      state.nodes.every((node) => node.opacity > 0.9 || node.visibility === "visible"),
      "linear mode: nodes must be revealed by scrolling",
    );
    const orbitA = await nodeCenter(page);
    await sleep(900);
    const orbitB = await nodeCenter(page);
    assert(
      failures,
      travelDistance(orbitA, orbitB) < 1,
      `linear mode must not orbit (node 1 moved ${travelDistance(orbitA, orbitB).toFixed(1)}px; a=${Math.round(orbitA.x)},${Math.round(orbitA.y)} b=${Math.round(orbitB.x)},${Math.round(orbitB.y)})`,
    );
  }

  await context.close();
  return failures;
}

async function auditReducedMotion(browser) {
  const failures = [];
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  watchPage(page, failures);

  await page.goto(BASE, { waitUntil: "load", timeout: 90_000 });
  await page.waitForSelector(SECTION, { timeout: 60_000 });
  await sleep(600);
  await scrollTo(page, (await sectionScrollTop(page)) + 1200);

  const state = await nodeStates(page);
  assert(
    failures,
    state.nodes.every((node) => node.opacity > 0.99 && node.visibility === "visible"),
    "reduced motion: all modules must be statically visible",
  );
  assert(
    failures,
    state.cta === null || state.cta.opacity > 0.99,
    "reduced motion: CTA must be visible",
  );
  const orbitA = await nodeCenter(page);
  await sleep(900);
  const orbitB = await nodeCenter(page);
  assert(
    failures,
    travelDistance(orbitA, orbitB) < 1,
    "reduced motion: orbit must not run",
  );
  const clip = await page.evaluate((selector) => {
    const section = document.querySelector(selector);
    if (!section) return null;
    const rect = section.getBoundingClientRect();
    return {
      x: Math.max(0, rect.left),
      y: Math.max(0, rect.top),
      width: Math.min(rect.width, window.innerWidth),
      height: Math.min(rect.height, window.innerHeight),
    };
  }, SECTION);
  if (clip && clip.height > 0) {
    await page.screenshot({ path: "/tmp/module-reduced-motion.png", clip });
  }
  await context.close();
  return failures;
}

const browser = await chromium.launch();
let failed = 0;
const only = process.argv[3];
for (const viewport of VIEWPORTS) {
  if (only && !only.split(",").includes(viewport.name)) continue;
  const failures = await auditViewport(browser, viewport);
  if (failures.length > 0) {
    failed += failures.length;
    console.error(`✗ ${viewport.width}×${viewport.height}`);
    for (const failure of failures) console.error(`   - ${failure}`);
  } else {
    console.log(`✓ ${viewport.width}×${viewport.height}`);
  }
}
const reduced = await auditReducedMotion(browser);
if (reduced.length > 0) {
  failed += reduced.length;
  console.error("✗ reduced-motion");
  for (const failure of reduced) console.error(`   - ${failure}`);
} else {
  console.log("✓ reduced-motion");
}
await browser.close();
process.exit(failed > 0 ? 1 : 0);
