// Эталонные снимки всех экранов: node tools/qa/screens.js [путь к html] [папка]
// Требует playwright (npm i -D playwright). Снимает мобильный 390×844@2x и десктоп 1440×900.
const { chromium } = require('playwright');
const path = require('path');
const file = path.resolve(process.argv[2] || 'reference/prototype/index.html');
const outDir = process.argv[3] || 'tmp/screens';
for (const d of ['mobile', 'desktop']) require('fs').mkdirSync(outDir + '/' + d, { recursive: true });
const SCREENS = [
  ['01a-first-screen', 0, 3000], ['01b-online-not-visible', 'swipe0', 2200], ['02-gap', 1, 3600],
  ['03-possibility', 2, 3000], ['04-turn-built', 3, 6000], ['05-case-flowers', 4, 4200],
  ['05-case-bakery', 5, 4200], ['06-how-we-work', 6, 3800], ['07-final', 7, 3200], ['07-form-sheet', 'sheet', 1200]
];
(async () => {
  const b = await chromium.launch();
  for (const [w, h, dpr, tag] of [[390, 844, 2, 'mobile'], [1440, 900, 1, 'desktop']]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    await p.goto('file://' + file + '#hero=1');
    for (const [name, step, wait] of SCREENS) {
      if (step === 0) { /* стартовый экран */ }
      else if (step === 'swipe0') await p.keyboard.press('ArrowDown');
      else if (step === 'sheet') await p.evaluate(() => document.querySelector('.s8 [data-sheet]').click());
      else await p.keyboard.press('ArrowDown');
      await p.waitForTimeout(wait);
      if (name.startsWith('05')) { await p.mouse.click(w / 2, h / 2).catch(() => {}); }
      await p.screenshot({ path: `${outDir}/${tag}/${name}.png` });
    }
    await p.close();
  }
  await b.close();
})();
