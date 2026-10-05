// Правило 3 (07_QA): на невысоких телефонах ничего не налезает на нижнюю строку «Дальше» / счётчик.
// Для каждого экрана после анимаций сравнивает нижний край видимого контента активного экрана
// с прямоугольниками «Дальше» и счётчика. Запуск: node overlap.mjs <url> [размеры]
import { chromium } from "playwright";

const url = process.argv[2] || "http://localhost:3100/preview/est-chto-pokazat";
const sizes = (process.argv[3] || "375x667,390x844,430x932,1280x720")
  .split(",")
  .map((s) => s.split("x").map(Number));
const NAMES = ["01", "01b", "02", "03", "04", "05a", "05b", "06", "07"];

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
  for (let i = 0; i < NAMES.length; i++) {
    if (i > 0) await p.keyboard.press("ArrowDown");
    await p.waitForTimeout(i === 4 ? 6000 : 3600);
    const r = await p.evaluate(() => {
      // Сами «Дальше» и счётчик (не отступ строки над ними).
      const marks = [".ecp .foot .next:not([hidden]) [data-next-label]", ".ecp .foot .counter"]
        .map((s) => document.querySelector(s))
        .filter(Boolean)
        .map((el) => el.getBoundingClientRect());
      const top = Math.min(...marks.map((m) => m.top));
      const hits = [];
      document.querySelectorAll(".ecp .screen.active .wrap *").forEach((el) => {
        if (el.children.length && !el.matches("p, li, h1, h2, h3, button, a")) return;
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) === 0) return;
        const rc = el.getBoundingClientRect();
        if (rc.height === 0 || rc.width === 0) return;
        const cross = marks.some(
          (m) => rc.bottom > m.top + 0.5 && rc.right > m.left && rc.left < m.right,
        );
        if (cross)
          hits.push(
            `${el.tagName.toLowerCase()}.${el.className} ↓${Math.round(rc.bottom - top)}px`,
          );
      });
      return { top: Math.round(top), hits };
    });
    if (r.hits.length) {
      bad += r.hits.length;
      console.log(`${w}x${h} ${NAMES[i]}: строка на ${r.top}px —`, r.hits.join("; "));
    }
  }
  await p.close();
}
await b.close();
console.log("наложений", bad);
process.exit(bad ? 1 : 0);
