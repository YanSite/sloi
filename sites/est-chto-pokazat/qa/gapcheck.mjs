// Проверка «щели у краёв кадра» (порт tools/qa/gapcheck.js пакета под URL сайта):
// все экраны, включая первый свайп на 01, по два кадра на экран — через 0.5 с и после анимаций (~3 с).
// Запуск: node gapcheck.mjs <url> [размеры] → снимки в $GC_DIR, затем python3 gapcheck.py.
// Критерии детектора не менялись; изменён только способ открыть страницу (URL вместо file://).
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const url = process.argv[2] || "http://localhost:3100/preview/est-chto-pokazat";
const sizes = (process.argv[3] || "1440x900,1280x720,1920x1080,390x844,375x667,430x932")
  .split(",")
  .map((s) => s.split("x").map(Number));
const OUT = process.env.GC_DIR || "tmp/gc";
const touch = (w) => w < 900;
mkdirSync(OUT, { recursive: true });

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
for (const [w, h] of sizes) {
  const p = await b.newPage({
    viewport: { width: w, height: h },
    hasTouch: touch(w),
    isMobile: touch(w),
  });
  await prepare(p);
  await p.goto(url, { waitUntil: "networkidle" });
  const snap = async (n) => {
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${OUT}/${w}x${h}_${n}_a.png` });
    await p.waitForTimeout(2600);
    await p.screenshot({ path: `${OUT}/${w}x${h}_${n}_b.png` });
  };
  await snap("01");
  await p.keyboard.press("ArrowDown");
  await snap("01b");
  for (let i = 2; i <= 8; i++) {
    await p.keyboard.press("ArrowDown");
    await snap(String(i).padStart(2, "0"));
  }
  await p.close();
}
await b.close();
