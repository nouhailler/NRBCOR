/**
 * Capture multi-résolutions des écrans NRBCOR (audit UX/UI avant/après).
 * Usage : tsx scripts/ux-capture.ts <outDir> [baseUrl] [theme=light|dark] [filter]
 * Nécessite un serveur (vite preview / dev) et Chromium (PUPPETEER_EXECUTABLE_PATH ou /usr/bin/chromium).
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve(process.argv[2] || 'ux-shots');
const base = process.argv[3] || 'http://localhost:4173';
const theme = process.argv[4] || 'light';
const filter = process.argv[5] || '';

const screens: Record<string, string> = {
  home: '',
  reagir: 'tab=reagir',
  guides: 'tab=guides',
  preparation: 'tab=preparation',
  monplan: 'tab=mon-plan',
  crise: 'sub=mode-crise',
  inventory: 'sub=inventory',
  suisjepret: 'sub=suis-je-pret',
  perimetres: 'sub=carte-perimetres',
  georisques: 'sub=georisques',
  formation: 'sub=formation',
  encyclo: 'sub=encyclopedie',
  tracabilite: 'sub=tracabilite',
  protocol: 'sub=protocol-chimique',
};
const viewports: Record<string, { width: number; height: number; mobile?: boolean }> = {
  m320: { width: 320, height: 700, mobile: true },
  m390: { width: 390, height: 844, mobile: true },
  t768: { width: 768, height: 1024, mobile: true },
  d1440: { width: 1440, height: 900 },
};

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const report: string[] = [];
  for (const [vpName, vp] of Object.entries(viewports)) {
    for (const [name, q] of Object.entries(screens)) {
      const id = `${name}_${vpName}`;
      if (filter && !id.includes(filter)) continue;
      const page = await browser.newPage();
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
      await page.evaluateOnNewDocument((th) => {
        try { localStorage.setItem('nrbcor_theme_mode', th); } catch {}
      }, theme);
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1, isMobile: !!vp.mobile, hasTouch: !!vp.mobile });
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
      await page.goto(`${base}/?skip_onboarding=1${q ? '&' + q : ''}`, { waitUntil: 'networkidle0' });
      await new Promise((r) => setTimeout(r, 500));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      await page.screenshot({ path: path.join(outDir, `${id}_vp.png`) });
      await page.screenshot({ path: path.join(outDir, `${id}.png`), fullPage: true });
      report.push(`${id}\toverflowX=${overflow}\terrors=${errors.length}${errors.length ? ' ' + errors.slice(0, 2).join(' | ') : ''}`);
      await page.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(outDir, 'report.txt'), report.join('\n') + '\n');
  console.log(report.join('\n'));
})();
