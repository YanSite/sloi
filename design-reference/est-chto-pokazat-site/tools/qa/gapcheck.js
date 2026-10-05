// Проверка «щели сверху» (и снизу/по краям): все экраны, несколько размеров, кадр в начале и после анимаций.
const { chromium } = require('playwright');
const sizes = (process.argv[2] || '1440x900,1280x720,1920x1080,390x844,375x667,430x932').split(',').map(s => s.split('x').map(Number));
const file = process.argv[3] || 'reference/prototype/index.html';
const OUT = process.env.GC_DIR || 'tmp/gc';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch();
  for (const [w, h] of sizes) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    await p.goto('file://' + require('path').resolve(file) + '#hero=1');
    const snap = async (n) => { await p.waitForTimeout(500); await p.screenshot({ path: `${OUT}/${w}x${h}_${n}_a.png` }); await p.waitForTimeout(2600); await p.screenshot({ path: `${OUT}/${w}x${h}_${n}_b.png` }); };
    await snap('01');
    await p.keyboard.press('ArrowDown'); await snap('01b');
    for (let i = 2; i <= 8; i++) { await p.keyboard.press('ArrowDown'); await snap(String(i).padStart(2, '0')); }
    await p.close();
  }
  await b.close();
})();
