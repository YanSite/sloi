// Телефон не заходит под шапку: на каждом экране с телефоном расстояние от
// нижнего края шапки (логотип / ссылки / «+») до верха корпуса телефона.
// Корпус: на 01 и 04 — экран телефона на фото руки (.pscr) с запасом на рамку,
// на 05 — CSS-телефон (.phone). Запуск: node header-gap.mjs <url> [размеры] [мин. зазор]
import { chromium } from "playwright";

const url = process.argv[2] || "http://localhost:3100/preview/est-chto-pokazat";
const sizes = (process.argv[3] || "390x844,375x667,430x932,1440x900,1280x720,1920x1080")
  .split(",")
  .map((s) => s.split("x").map(Number));
const MIN = Number(process.argv[4] || 24);
// [имя, нажатий ↓ от начала, ожидание после последнего, селектор корпуса]
const PLAN = [
  ["01", 0, 2500, ".pscr"],
  ["01b", 1, 2200, ".pscr"],
  ["04", 4, 6500, ".product"],
  ["05a", 5, 4500, ".s5 .phone"],
  ["05b", 6, 4500, ".s6 .phone"],
];

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
  let pressed = 0;
  const out = [];
  for (const [name, steps, wait, sel] of PLAN) {
    while (pressed < steps) {
      await p.keyboard.press("ArrowDown");
      pressed++;
      if (pressed < steps) await p.waitForTimeout(2300);
    }
    await p.waitForTimeout(wait);
    const r = await p.evaluate((sel) => {
      const head = [".ecp .head .logo", ".ecp .head .navlinks", ".ecp .head .toggle"]
        .map((s) => document.querySelector(s))
        .filter((el) => el && getComputedStyle(el).display !== "none")
        .map((el) => el.getBoundingClientRect().bottom);
      const el = document.querySelector(".ecp " + sel);
      // Рамка корпуса над экраном фото-телефона ≈ 3.1% ширины экрана + остров — берём верх экрана минус 4% его ширины.
      const rc = el.getBoundingClientRect();
      const top = sel === ".pscr" || sel === ".product" ? rc.top - rc.width * 0.04 : rc.top;
      return { head: Math.max(...head), top };
    }, sel);
    const gap = Math.round(r.top - r.head);
    if (gap < MIN) bad++;
    out.push(`${name} ${gap}px${gap < MIN ? " ✗" : ""}`);
  }
  console.log(`${w}x${h}: ${out.join(" · ")}`);
  await p.close();
}
await b.close();
console.log(`меньше ${MIN}px:`, bad);
process.exit(bad ? 1 : 0);
