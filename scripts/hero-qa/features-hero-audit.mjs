/**
 * /features hero — senior design acceptance test.
 *
 * Drives the real page and asserts the acceptance conditions for the hero's
 * card-and-mockup composition against rendered geometry rather than source:
 * navbar clearance, the exact two-line heading and its accent treatment, CTA
 * placement and destinations, product-screen dominance and scale, the radial
 * card arrangement, connector alignment, containment, and the explicit
 * mobile collapse.
 *
 * Screenshots are written to the output directory for human review — this
 * script measures geometry, it does not judge how anything looks.
 *
 * Usage: node scripts/hero-qa/features-hero-audit.mjs [base-url] [out-dir]
 */
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";
const OUT = process.argv[3] ?? "./.audit/features-hero";

const DESKTOP = [
  { name: "1920", width: 1920, height: 1080, shot: true },
  { name: "1680", width: 1680, height: 1050 },
  { name: "1536", width: 1536, height: 960, shot: true },
  { name: "1440", width: 1440, height: 900, shot: true, strict: true },
  { name: "1366", width: 1366, height: 768 },
  { name: "1280", width: 1280, height: 800, shot: true },
];
const MOBILE = [
  { name: "1023", width: 1023, height: 900, shot: true },
  { name: "768", width: 768, height: 1024, shot: true },
  { name: "390", width: 390, height: 844, shot: true },
];

const HEAD_1 = "Five powerful capabilities.";
const HEAD_2 = "One connected system.";

const results = [];
const record = (vp, name, pass, detail) => {
  results.push({ vp, name, pass, detail });
  console.log(
    `  ${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`,
  );
};

/** Geometry of every part of the composition, in viewport pixels. */
async function measure(page) {
  return page.evaluate(() => {
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: r.x,
        y: r.y,
        w: r.width,
        h: r.height,
        right: r.right,
        bottom: r.bottom,
      };
    };
    const hero = document.querySelector(
      'section[aria-labelledby="features-title"]',
    );
    if (!hero) return { error: "hero section not found" };

    const header = document.querySelector("header");
    const shell = hero.querySelector("[class*=shell]");
    const screen = hero.querySelector("[data-screen]");
    const h1 = hero.querySelector("h1");
    const cards = [...hero.querySelectorAll("[data-slot]")];

    const lines = h1 ? [...h1.querySelectorAll("span")] : [];
    const topLines = lines.filter((el) => !el.parentElement?.closest("span"));
    const accented = lines.find((el) => {
      const cs = getComputedStyle(el);
      return (
        cs.webkitTextFillColor === "rgba(0, 0, 0, 0)" ||
        cs.color === "rgba(0, 0, 0, 0)"
      );
    });
    const h1Lines = h1
      ? Math.round(
          h1.getBoundingClientRect().height /
            Number.parseFloat(getComputedStyle(h1).lineHeight || "1"),
        )
      : 0;

    const ctas = [...hero.querySelectorAll("a")].filter((a) =>
      /book a demo|explore all features/i.test(a.textContent ?? ""),
    );

    const cardInfo = cards.map((el) => {
      const cs = getComputedStyle(el);
      const badge = el.querySelector("[class*=badge]");
      return {
        slot: el.getAttribute("data-slot"),
        name: el.querySelector("[class*=name]")?.textContent?.trim() ?? "?",
        box: box(el),
        width: Number.parseFloat(cs.width),
        height: Number.parseFloat(cs.height),
        padding: `${cs.paddingTop}/${cs.paddingRight}/${cs.paddingBottom}/${cs.paddingLeft}`,
        radius: cs.borderRadius,
        badge: badge
          ? `${getComputedStyle(badge).width}x${getComputedStyle(badge).height}`
          : null,
        bg: `${cs.backgroundColor} | ${cs.backgroundImage.slice(0, 40)}`,
        overflowY: el.scrollHeight - el.clientHeight,
        overflowX: el.scrollWidth - el.clientWidth,
      };
    });

    const layer = hero.querySelector("[class*=layer]");
    const wiresVisible = layer ? getComputedStyle(layer).display !== "none" : false;
    const wires = layer
      ? [...layer.querySelectorAll("path")].map((p) => {
          const cs = getComputedStyle(p);
          return { strokeWidth: cs.strokeWidth, stroke: cs.stroke };
        })
      : [];
    const nodes = layer
      ? [...layer.querySelectorAll("[class*=node]")].map((el) => {
          const r = el.getBoundingClientRect();
          return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        })
      : [];

    const ledeEl = hero.querySelector("p[class*=lede], p[class*=description]");

    return {
      docScrollW: document.documentElement.scrollWidth,
      docClientW: document.documentElement.clientWidth,
      header: box(header),
      hero: box(hero),
      shell: box(shell),
      screen: box(screen),
      h1: box(h1),
      h1Text: h1?.textContent?.replace(/\s+/g, " ").trim() ?? "",
      h1Lines,
      lineTexts: topLines.map((el) => el.textContent?.trim()),
      accentText: accented?.textContent?.trim() ?? null,
      lede: box(ledeEl),
      ledeText: ledeEl?.textContent?.replace(/\s+/g, " ").trim() ?? "",
      ctas: ctas.map((a) => ({
        text: a.textContent?.replace(/\s+/g, " ").trim(),
        href: a.getAttribute("href"),
        box: box(a),
      })),
      cards: cardInfo,
      wires: wiresVisible ? wires : [],
      nodes: wiresVisible ? nodes : [],
    };
  });
}

async function run() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const consoleErrors = [];

  for (const vp of [...DESKTOP, ...MOBILE]) {
    const isDesktop = DESKTOP.includes(vp);
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(`${vp.name}: ${m.text()}`);
    });
    await page.goto(`${BASE}/features`, { waitUntil: "networkidle" });
    await page.waitForTimeout(3000); // let the entry sequence settle

    const m = await measure(page);
    console.log(`\n=== ${vp.name}px (${isDesktop ? "desktop" : "mobile"}) ===`);
    if (m.error) {
      record(vp.name, "hero present", false, m.error);
      await page.close();
      continue;
    }
    const T = 0.6;

    // ------------------------------------------------------------- navbar
    record(vp.name, "hero starts below navbar",
      !!m.header && m.hero.y >= m.header.bottom - T,
      `heroTop=${m.hero.y.toFixed(0)} navBottom=${m.header?.bottom.toFixed(0)}`);
    record(vp.name, "heading clears navbar",
      !!m.header && !!m.h1 && m.h1.y >= m.header.bottom + 24,
      `h1Top=${m.h1?.y.toFixed(0)} navBottom=${m.header?.bottom.toFixed(0)}`);

    // ------------------------------------------------------------ heading
    record(vp.name, "heading line 1 is the authored text",
      m.lineTexts.includes(HEAD_1), m.lineTexts.join(" / "));
    record(vp.name, "heading line 2 is the authored text",
      m.lineTexts.includes(HEAD_2), m.lineTexts.join(" / "));
    record(vp.name, "old headline is gone",
      !/everything you need to run/i.test(m.h1Text), m.h1Text.slice(0, 54));
    record(vp.name, "line 2 carries the accent treatment",
      m.accentText === HEAD_2, `accented="${m.accentText}"`);
    if (isDesktop) {
      record(vp.name, "heading is exactly 2 lines", m.h1Lines === 2,
        `${m.h1Lines} lines, h=${m.h1?.h.toFixed(0)}`);
      const off = Math.abs(m.h1.x + m.h1.w / 2 - (m.shell.x + m.shell.w / 2));
      record(vp.name, "heading is centred", off <= 2, `off=${off.toFixed(1)}px`);
    }

    // ------------------------------------------------------- support + CTA
    record(vp.name, "supporting copy is the authored sentence",
      m.ledeText.startsWith("From identification to invoicing"),
      m.ledeText.slice(0, 56));
    record(vp.name, "two CTAs present", m.ctas.length === 2,
      m.ctas.map((c) => c.text).join(" | "));
    const hrefs = m.ctas.map((c) => c.href ?? "");
    record(vp.name, "CTA destinations are real",
      hrefs.length === 2 && hrefs.every((h) => h && h !== "#" && h.length > 1),
      hrefs.join(" | "));
    if (m.ctas.length === 2 && m.lede) {
      record(vp.name, "CTAs sit beneath the copy",
        m.ctas.every((c) => c.box.y >= m.lede.bottom - T),
        `ctaTop=${Math.min(...m.ctas.map((c) => c.box.y)).toFixed(0)}`);
    }

    // -------------------------------------------------------- containment
    record(vp.name, "no horizontal page scroll", m.docScrollW <= m.docClientW,
      `scrollW=${m.docScrollW} clientW=${m.docClientW}`);
    const escapees = m.cards
      .filter((c) => c.box.x < m.shell.x - T || c.box.right > m.shell.right + T)
      .map((c) => `${c.name}(${c.box.x.toFixed(0)}..${c.box.right.toFixed(0)})`);
    record(vp.name, "cards inside shell bounds", escapees.length === 0,
      escapees.length
        ? escapees.join(", ")
        : `shell=${m.shell.x.toFixed(0)}..${m.shell.right.toFixed(0)}`);
    const spill = m.cards
      .filter((c) => c.overflowY > 1 || c.overflowX > 1)
      .map((c) => `${c.name}(+${c.overflowY}y/+${c.overflowX}x)`);
    record(vp.name, "no text clipped inside cards", spill.length === 0,
      spill.join(", "));

    // --------------------------------------------------------- uniformity
    record(vp.name, "5 cards render", m.cards.length === 5, `${m.cards.length}`);
    const uniq = (f) => [...new Set(m.cards.map(f))];
    record(vp.name, "identical card width",
      uniq((c) => Math.round(c.width)).length === 1,
      uniq((c) => Math.round(c.width)).join(" | "));
    record(vp.name, "identical card padding", uniq((c) => c.padding).length === 1,
      uniq((c) => c.padding).join(" | "));
    record(vp.name, "identical card radius", uniq((c) => c.radius).length === 1,
      uniq((c) => c.radius).join(" | "));
    record(vp.name, "identical icon badge", uniq((c) => c.badge).length === 1,
      uniq((c) => c.badge).join(" | "));
    const white = m.cards.filter((c) => /rgb\(25[0-5], 25[0-5], 25[0-5]\)/.test(c.bg));
    record(vp.name, "cards are dark, not white surfaces", white.length === 0,
      white.map((c) => c.name).join(", "));

    if (isDesktop) {
      // ------------------------------------------------------- composition
      const cx = m.screen.x + m.screen.w / 2;
      const cy = m.screen.y + m.screen.h / 2;
      const outer = m.cards.filter((c) => c.slot !== "bottom-center");
      record(vp.name, "4 outer cards around the screen", outer.length === 4,
        outer.map((c) => c.slot).join(", "));
      const xs = outer.map((c) => Number((c.box.x + c.box.w / 2 - cx).toFixed(1)));
      record(vp.name, "outer cards mirrored about centre",
        Math.abs(xs.reduce((a, b) => a + b, 0)) <= 1.5, `offsets=${xs.join(", ")}`);
      const dists = outer.map((c) =>
        Math.hypot(c.box.x + c.box.w / 2 - cx, c.box.y + c.box.h / 2 - cy));
      const spread = Math.max(...dists) - Math.min(...dists);
      record(vp.name, "outer cards equidistant from screen", spread <= 2,
        `spread=${spread.toFixed(2)}px`);
      const tail = m.cards.find((c) => c.slot === "bottom-center");
      if (tail) {
        const off = Math.abs(tail.box.x + tail.box.w / 2 - cx);
        record(vp.name, "5th card centred under screen", off <= 1.5,
          `off=${off.toFixed(2)}px`);
        record(vp.name, "5th card below the screen",
          tail.box.y >= m.screen.bottom - T,
          `tailTop=${tail.box.y.toFixed(0)} screenBottom=${m.screen.bottom.toFixed(0)}`);
      }
      const boxes = [
        ...m.cards.map((c) => ({ n: c.name, b: c.box })),
        { n: "screen", b: m.screen },
      ];
      const hits = [];
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i].b;
          const b = boxes[j].b;
          if (
            a.x < b.right - T && b.x < a.right - T &&
            a.y < b.bottom - T && b.y < a.bottom - T
          ) {
            hits.push(`${boxes[i].n}x${boxes[j].n}`);
          }
        }
      }
      record(vp.name, "nothing collides", hits.length === 0, hits.join(", "));

      // --------------------------------------------------------- the screen
      const widest = Math.max(...m.cards.map((c) => c.width));
      record(vp.name, "screen dominates every card", m.screen.w >= widest * 2.4,
        `screen=${m.screen.w.toFixed(0)} card=${widest.toFixed(0)}`);
      const scx = Math.abs(cx - (m.shell.x + m.shell.w / 2));
      record(vp.name, "screen horizontally centred", scx <= 2, `off=${scx.toFixed(1)}px`);
      if (vp.strict) {
        record(vp.name, "screen 700-820px wide at 1440",
          m.screen.w >= 700 && m.screen.w <= 820, `${m.screen.w.toFixed(0)}px`);
        record(vp.name, "screen 300-390px tall at 1440",
          m.screen.h >= 300 && m.screen.h <= 390, `${m.screen.h.toFixed(0)}px`);
        record(vp.name, "cards 230-280px wide at 1440",
          m.cards.every((c) => c.width >= 230 && c.width <= 280),
          `${Math.round(m.cards[0]?.width)}px`);
        record(vp.name, "cards 110-130px tall at 1440",
          m.cards.every((c) => c.height >= 110 && c.height <= 130),
          `${Math.round(m.cards[0]?.height)}px`);
        record(vp.name, "hero is 750-850px tall",
          m.hero.h >= 750 && m.hero.h <= 850, `${m.hero.h.toFixed(0)}px`);
      }

      // ------------------------------------------------------- connectors
      record(vp.name, "5 connector paths", m.wires.length === 5, `${m.wires.length}`);
      const sw = [...new Set(m.wires.map((w) => w.strokeWidth))];
      record(vp.name, "one connector stroke width", sw.length === 1, sw.join(" | "));
      const near = (v, t) => Math.abs(v - t) <= 3.5;
      const onEdge = (p) => {
        if (
          (near(p.x, m.screen.x) || near(p.x, m.screen.right)) &&
          p.y >= m.screen.y - 4 && p.y <= m.screen.bottom + 4
        ) return true;
        if (
          near(p.y, m.screen.bottom) &&
          p.x >= m.screen.x - 4 && p.x <= m.screen.right + 4
        ) return true;
        return m.cards.some(
          (c) =>
            (near(p.x, c.box.x) || near(p.x, c.box.right) ||
              near(p.y, c.box.y) || near(p.y, c.box.bottom)) &&
            p.x >= c.box.x - 4 && p.x <= c.box.right + 4 &&
            p.y >= c.box.y - 4 && p.y <= c.box.bottom + 4,
        );
      };
      const stranded = m.nodes.filter((p) => !onEdge(p));
      record(vp.name, "every connector endpoint meets an edge",
        m.nodes.length > 0 && stranded.length === 0,
        `${m.nodes.length} markers, ${stranded.length} stranded`);
    } else {
      // -------------------------------------------------------- responsive
      const stacked = m.cards.every(
        (c, i, a) => i === 0 || c.box.y >= a[i - 1].box.y - T,
      );
      record(vp.name, "cards stack in document order", stacked);
      record(vp.name, "screen leads the stack",
        !!m.screen && m.cards.every((c) => c.box.y >= m.screen.y - T));
      record(vp.name, "connectors removed below 1024", m.wires.length === 0,
        `${m.wires.length} visible`);
    }

    if (vp.shot) {
      await page.screenshot({ path: `${OUT}/features-hero-${vp.name}.png` });
    }
    await page.close();
  }

  await browser.close();

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${"=".repeat(62)}`);
  console.log(`${results.length - failed.length}/${results.length} checks passed`);
  if (consoleErrors.length) {
    console.log(`Console errors:\n  ${consoleErrors.slice(0, 10).join("\n  ")}`);
  }
  if (failed.length) {
    console.log("\nFAILURES:");
    for (const f of failed) console.log(`  [${f.vp}] ${f.name} — ${f.detail ?? ""}`);
  }
  await writeFile(
    `${OUT}/report.json`,
    JSON.stringify({ results, consoleErrors }, null, 2),
  );
  process.exitCode = failed.length === 0 ? 0 : 1;
}

run();
