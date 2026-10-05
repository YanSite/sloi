// Правило 2 (07_QA): на повороте экран сайта совпадает с корпусом телефона.
// Сайт в телефоне (.product) и экран телефона на фото руки (.pscr внутри .hand)
// сравниваются по прямоугольникам на 3.7 / 4.1 / 5.4 с после прихода на 04.
// Допуск — 1px. Запуск: node sync.mjs <url> [размеры]
import { chromium } from "playwright";

const url = process.argv[2] || "http://localhost:3100/preview/est-chto-pokazat";
const sizes = (process.argv[3] || "390x844,375x667,430x932,1440x900,1280x720,1920x1080")
  .split(",")
  .map((s) => s.split("x").map(Number));
const AT = [3700, 4100, 5400];
const TOL = 1;

const b = await chromium.launch();
let bad = 0;
for (const [w, h] of sizes) {
  const mobile = w < 900;
  const p = await b.newPage({
    viewport: { width: w, height: h },
    hasTouch: mobile,
    isMobile: mobile,
  });
  await p.goto(url, { waitUntil: "networkidle" });
  for (let i = 0; i < 3; i++) {
    await p.keyboard.press("ArrowDown");
    await p.waitForTimeout(2300);
  }
  await p.keyboard.press("ArrowDown");
  const t0 = Date.now();
  for (const at of AT) {
    await p.waitForTimeout(Math.max(0, at - (Date.now() - t0)));
    const r = await p.evaluate(() => {
      const a = document.querySelector(".ecp .product").getBoundingClientRect();
      const s = document.querySelector(".ecp .pscr").getBoundingClientRect();
      return {
        d: Math.max(...["left", "top", "right", "bottom"].map((k) => Math.abs(a[k] - s[k]))),
      };
    });
    const ok = r.d <= TOL;
    if (!ok) bad++;
    console.log(
      `${w}x${h} ${(at / 1000).toFixed(1)} с: расхождение ${r.d.toFixed(2)}px ${ok ? "" : "— НЕ СОВПАДАЕТ"}`,
    );
  }
  await p.close();
}
await b.close();
console.log("несовпадений", bad);
process.exit(bad ? 1 : 0);
