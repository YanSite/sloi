// Сверка с прототипом: одни и те же шаги и моменты времени в прототипе (file://) и в сборке (URL).
// Запуск: node compare.mjs <url> <папка> [план], план — "имя:шаги:мс,…" (шаги — число нажатий ↓ от начала).
// Снимки: <папка>/<вид>-<имя>-proto.png и -site.png.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const url = process.argv[2] || "http://localhost:3100/preview/est-chto-pokazat";
const out = process.argv[3] || "tmp/cmp";
const plan = (process.argv[4] || "01:0:3000,01b:1:2200,02:2:3600,03:3:3000")
  .split(",")
  .map((s) => s.split(":"))
  .map(([name, steps, ms]) => ({ name, steps: Number(steps), ms: Number(ms) }));
const views = (process.env.VIEWS || "mobile,desktop").split(",");
const proto =
  "file://" +
  resolve("design-reference/est-chto-pokazat-site/reference/prototype/index.html") +
  "#hero=1";
mkdirSync(out, { recursive: true });

const b = await chromium.launch();
for (const view of views) {
  const mobile = view === "mobile";
  const [w, h] = mobile ? [390, 844] : [1440, 900];
  for (const [kind, target] of [
    ["proto", proto],
    ["site", url],
  ]) {
    for (const { name, steps, ms } of plan) {
      const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: mobile });
      await p.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
      await p.goto(target, { waitUntil: "networkidle" });
      await p.addStyleTag({ content: "nextjs-portal,.proto{display:none!important}" });
      await p.waitForTimeout(400);
      for (let i = 0; i < steps; i++) {
        await p.keyboard.press("ArrowDown");
        await p.waitForTimeout(i === steps - 1 ? 0 : 2300);
      }
      await p.waitForTimeout(ms);
      await p.screenshot({ path: `${out}/${view}-${name}-${kind}.png` });
      await p.close();
    }
  }
}
await b.close();
