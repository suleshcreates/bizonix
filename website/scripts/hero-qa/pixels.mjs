// Pixel analysis for hero screenshots (spec §43): measures the bounding box
// of the bright (near-white product UI) region and asserts it is centered.
// This is an objective image metric — not a visual judgment.
//
//   node scripts/hero-qa/pixels.mjs [shotsDir]
import { chromium } from "playwright";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

const dir = resolve(process.argv[2] ?? ".hero-qa/shots");
const browser = await chromium.launch();
const page = await browser.newPage();
let failures = 0;

for (const file of readdirSync(dir).filter((f) => f.endsWith(".png")).sort()) {
  await page.goto("file:///" + resolve(dir, file).replace(/\\/g, "/"));
  const r = await page.evaluate(() => {
    const img = document.querySelector("img");
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 720 / img.naturalWidth);
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let min = canvas.width;
    let max = -1;
    let bright = 0;
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const lum = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
        if (lum > 225) {
          bright++;
          if (x < min) min = x;
          if (x > max) max = x;
        }
      }
    }
    return {
      width: canvas.width,
      brightPct: +((100 * bright) / (canvas.width * canvas.height)).toFixed(2),
      centerOff: +(((min + max) / 2) - canvas.width / 2).toFixed(1),
    };
  });
  const pass = Math.abs(r.centerOff) <= 8;
  if (!pass) failures++;
  console.log(
    `${file} | brightArea=${r.brightPct}% | brightRegionCenterOff=${r.centerOff}px ${pass ? "OK" : "FAIL"}`,
  );
}

await browser.close();
console.log(
  failures === 0
    ? "PIXEL ANALYSIS: ALL PASS (bright regions centered within 8px)"
    : `PIXEL ANALYSIS: ${failures} FAILURES`,
);
process.exitCode = failures === 0 ? 0 : 1;
