// Эталонные снимки всех экранов (порт tools/qa/screens.js пакета под URL сайта):
// мобильный 390×844 @2x и десктоп 1440×900, имена как в reference/screens/.
// Запуск: node screens.mjs <url> <папка>
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const url = process.argv[2] || "http://localhost:3100/preview/est-chto-pokazat";
const outDir = process.argv[3] || "tmp/screens";
for (const d of ["mobile", "desktop"]) mkdirSync(`${outDir}/${d}`, { recursive: true });
const SCREENS = [
  ["01a-first-screen", 0, 3000],
  ["01b-online-not-visible", "step", 2200],
  ["02-gap", "step", 3600],
  ["03-possibility", "step", 3000],
  ["04-turn-built", "step", 6000],
  ["05a-case-flowers", "step", 4200],
  ["05b-case-bakery", "step", 4200],
  ["06-how-we-work", "step", 3800],
  ["07-final", "step", 3200],
  ["07-form-sheet", "sheet", 1200],
];

// Режим: GC_MODE=rm — prefers-reduced-motion; GC_MODE=lite — облегчённая версия (2 ядра, как слабое устройство).
const MODE = process.env.GC_MODE || "";
const b = await chromium.launch();
const prepare = async (p) => {
  if (MODE === "rm") await p.emulateMedia({ reducedMotion: "reduce" });
  if (MODE === "lite")
    await p.addInitScript(() =>
      Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 2 }),
    );
};
for (const [w, h, dpr, tag] of [
  [390, 844, 2, "mobile"],
  [1440, 900, 1, "desktop"],
]) {
  const mobile = tag === "mobile";
  const p = await b.newPage({
    viewport: { width: w, height: h },
    deviceScaleFactor: dpr,
    hasTouch: mobile,
    isMobile: mobile,
  });
  await prepare(p);
  await p.goto(url, { waitUntil: "networkidle" });
  for (const [name, step, wait] of SCREENS) {
    if (step === "step") await p.keyboard.press("ArrowDown");
    else if (step === "sheet")
      await p.evaluate(() => document.querySelector(".s8 [data-sheet]")?.click());
    await p.waitForTimeout(wait);
    await p.screenshot({ path: `${outDir}/${tag}/${name}.png` });
  }
  await p.close();
}
await b.close();
