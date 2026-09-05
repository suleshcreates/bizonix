// No-vision QA utility for the Bizonix home hero (spec §40–§43, §47).
//
// Measures DOM geometry (bounding boxes, center offsets, overflow) and frozen
// background state at fixed viewports. Produces JSON + screenshot artifacts —
// these are DEBUG ARTIFACTS for human review / objective checks, not visual
// judgments.
//
// Usage:
//   node scripts/hero-qa/measure.mjs --era baseline --out .hero-qa/baseline.json
//   node scripts/hero-qa/measure.mjs --era new --out .hero-qa/after.json --shots .hero-qa/shots
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const VIEWPORTS = [
  [1440, 900],
  [1366, 768],
  [1280, 800],
  [1024, 768],
  [768, 1024],
  [430, 932],
  [390, 844],
  [360, 800],
];

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const era = arg("era", "new");
const outFile = resolve(arg("out", `.hero-qa/${era}.json`));
const shotsDir = arg("shots", null) ? resolve(arg("shots", null)) : null;
const base = process.env.HERO_QA_BASE_URL ?? "http://localhost:3000/";

/** Page-side measurement payload for one viewport. */
async function measurePage(page) {
  return page.evaluate(() => {
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        left: +r.left.toFixed(2),
        top: +r.top.toFixed(2),
        width: +r.width.toFixed(2),
        height: +r.height.toFixed(2),
        centerX: +(r.left + r.width / 2).toFixed(2),
        centerOffsetX: +(r.left + r.width / 2 - innerWidth / 2).toFixed(2),
        display: cs.display,
        transform: cs.transform,
      };
    };

    const hero = document.querySelector('section[aria-labelledby="home-hero-heading"]');
    const content =
      document.querySelector('[data-hero="content"]') ??
      hero?.querySelector("h1")?.parentElement?.parentElement ??
      null;
    const product =
      document.querySelector('[data-hero="product-stage"]') ??
      hero?.querySelector('[role="img"]') ??
      null;
    const rail = document.querySelector('[data-hero="state-rail"]');

    // Frozen-background snapshot: every direct child of the hero that paints
    // at a negative z-index (beams / grain / scrim / horizon / floor glow).
    const bgLayers = [];
    if (hero) {
      for (const el of hero.children) {
        const cs = getComputedStyle(el);
        if (parseInt(cs.zIndex || "0", 10) < 0) {
          bgLayers.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.getAttribute("class") || "").split(" ")[0].slice(0, 48),
            zIndex: cs.zIndex,
            opacity: cs.opacity,
            mixBlendMode: cs.mixBlendMode,
            filter: cs.filter === "none" ? "none" : cs.filter.slice(0, 60),
            animationName: cs.animationName,
            animationDuration: cs.animationDuration,
            hasCanvas: !!el.querySelector("canvas"),
            backgroundPreview:
              cs.backgroundImage === "none"
                ? "none"
                : cs.backgroundImage.replace(/\s+/g, " ").slice(0, 90),
          });
        }
      }
    }

    const ctaGroup = (() => {
      const a = hero?.querySelector('a[href="/contact"]');
      const b = hero?.querySelector('a[href="/modules"]');
      if (!a || !b) return null;
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      const left = Math.min(ra.left, rb.left);
      const right = Math.max(ra.right, rb.right);
      return {
        left: +left.toFixed(2),
        right: +right.toFixed(2),
        width: +(right - left).toFixed(2),
        centerOffsetX: +((left + right) / 2 - innerWidth / 2).toFixed(2),
      };
    })();

    const headlineLines = (() => {
      const h = document.querySelector("#home-hero-heading");
      if (!h) return null;
      const cs = getComputedStyle(h);
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.1;
      return +(h.getBoundingClientRect().height / lh).toFixed(2);
    })();

    const heroCs = hero ? getComputedStyle(hero) : null;
    const doc = document.documentElement;

    return {
      viewport: { width: innerWidth, height: innerHeight },
      overflowX: Math.max(0, +(doc.scrollWidth - doc.clientWidth).toFixed(2)),
      bodyOverflowX: Math.max(
        0,
        +(document.body.scrollWidth - doc.clientWidth).toFixed(2),
      ),
      hero: rect(hero),
      heroBackground:
        heroCs && heroCs.backgroundImage !== "none"
          ? heroCs.backgroundImage.replace(/\s+/g, " ").slice(0, 120)
          : "none",
      navbar: rect(document.querySelector("header")),
      content: rect(content),
      headline: rect(document.querySelector("#home-hero-heading")),
      eyebrow: rect(hero?.querySelector("p:first-of-type")),
      ctaPrimary: rect(hero?.querySelector('a[href="/contact"]')),
      ctaSecondary: rect(hero?.querySelector('a[href="/modules"]')),
      ctaGroup,
      headlineLines,
      product: rect(product),
      rail: rect(rail),
      headlineLineHeight: (() => {
        const h = document.querySelector("#home-hero-heading");
        if (!h) return null;
        const cs = getComputedStyle(h);
        return { fontSize: cs.fontSize, lineHeight: cs.lineHeight, textAlign: cs.textAlign };
      })(),
      // Live CSS animation inventory (background regression signal).
      cssAnimations: [
        ...new Set(
          document
            .getAnimations({ subtree: true })
            .map((a) => {
              const effect = a.effect?.getKeyframes?.() ?? [];
              const name =
                effect.find((k) => k.animationName)?.animationName ??
                (a.animationName ?? "");
              return name;
            })
            .filter(Boolean),
        ),
      ].slice(0, 20),
      bgLayers,
      consoleErrors: window.__heroQaErrors ?? [],
    };
  });
}

const browser = await chromium.launch();
const report = { era, base, capturedAt: new Date().toISOString(), viewports: [] };

for (const [width, height] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 200)));
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
  await page.goto(base, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForSelector('section[aria-labelledby="home-hero-heading"]', {
    timeout: 30000,
  });
  // Let entrance animations settle before measuring.
  await page.waitForTimeout(2500);
  await page.evaluate((errs) => (window.__heroQaErrors = errs), errors);
  const data = await measurePage(page);
  if (shotsDir) {
    await page.screenshot({
      path: resolve(shotsDir, `bizonix-hero-${width}.png`),
      clip: { x: 0, y: 0, width, height },
    });
  }
  report.viewports.push(data);
  await page.close();
}

await browser.close();
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(report, null, 2));

// Console-side assertion summary (spec §41 + §40 CTA-group target).
let failures = 0;
for (const v of report.viewports) {
  const w = v.viewport.width;
  const desktop = w >= 1180;
  const notes = [];
  const bad = (msg) => {
    notes.push(msg);
    failures++;
  };
  if (v.overflowX > 0) bad(`horizontal overflow ${v.overflowX}px`);
  if (desktop) {
    if (v.product && Math.abs(v.product.centerOffsetX) > 8)
      bad(`product center offset ${v.product.centerOffsetX}px (>8px)`);
    if (v.headline && Math.abs(v.headline.centerOffsetX) > 4)
      bad(`headline center offset ${v.headline.centerOffsetX}px (>4px)`);
    if (v.headline && v.headline.width > 1000) bad(`headline width ${v.headline.width}px (>1000px)`);
    if (v.ctaGroup && Math.abs(v.ctaGroup.centerOffsetX) > 4)
      bad(`CTA group center offset ${v.ctaGroup.centerOffsetX}px (>4px)`);
    if (v.headlineLines && (v.headlineLines < 2 || v.headlineLines > 3))
      bad(`headline occupies ${v.headlineLines} lines (want 2–3)`);
    const fs = v.headlineLineHeight ? parseFloat(v.headlineLineHeight.fontSize) : 0;
    if (fs && (fs < 64 || fs > 78)) bad(`headline font-size ${fs}px (want 64–78px)`);
  }
  console.log(
    `${w}x${v.viewport.height}` +
      ` | overflowX=${v.overflowX}` +
      (v.headline ? ` | headlineW=${v.headline.width} off=${v.headline.centerOffsetX}` : "") +
      (v.headlineLines ? ` lines=${v.headlineLines}` : "") +
      (v.ctaGroup ? ` | ctaGroupOff=${v.ctaGroup.centerOffsetX}` : "") +
      (v.product ? ` | productW=${v.product.width} off=${v.product.centerOffsetX}` : " | product=?") +
      (notes.length ? ` | FAIL: ${notes.join("; ")}` : " | OK"),
  );
}
console.log(failures === 0 ? "ALL GEOMETRY ASSERTIONS PASS" : `${failures} ASSERTION FAILURES`);
process.exitCode = failures === 0 ? 0 : 1;
