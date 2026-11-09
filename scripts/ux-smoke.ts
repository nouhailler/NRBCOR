/**
 * Test de parcours UX (fumée) : navigation, menu, mode CRISE, langue, thème, hors-ligne.
 * Usage : tsx scripts/ux-smoke.ts [baseUrl]   (nécessite vite preview + Chromium)
 */
import puppeteer, { Page } from 'puppeteer';

const base = process.argv[2] || 'http://localhost:4173';
const results: { name: string; ok: boolean; info?: string }[] = [];
const check = (name: string, ok: boolean, info?: string) => results.push({ name, ok, info });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function clickText(page: Page, selector: string, text: string) {
  const ok = await page.evaluate((sel, txt) => {
    const el = [...document.querySelectorAll<HTMLElement>(sel)].find((e) => e.offsetParent !== null && e.innerText.trim().includes(txt));
    if (el) { el.click(); return true; }
    return false;
  }, selector, text);
  await sleep(300);
  return ok;
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  const errors: string[] = [];
  for (const vp of [{ w: 390, h: 844, m: true }, { w: 1440, h: 900, m: false }]) {
    const page = await browser.newPage();
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.setViewport({ width: vp.w, height: vp.h, isMobile: vp.m, hasTouch: vp.m });
    await page.goto(`${base}/?skip_onboarding=1`, { waitUntil: 'networkidle0' });
    const tag = vp.m ? 'mobile' : 'desktop';
    const navSel = vp.m ? 'nav.lg\\:hidden button' : 'header nav button';
    for (const [label, expect] of [['Réagir', 'Parcours Réflexes'], ['Guides', 'Guides & Fiches'], ['Préparation', 'Tableau de Bord'], ['Mon Plan', 'Plan Familial'], ['Accueil', 'Ma préparation aux risques']]) {
      const clicked = await clickText(page, navSel, label);
      const txt = await page.evaluate(() => document.body.innerText);
      check(`${tag}: onglet ${label}`, clicked && txt.includes(expect), clicked ? '' : 'bouton introuvable');
    }
    // Indicateurs du tableau de bord
    const dash = await page.evaluate(() => document.body.innerText);
    check(`${tag}: indicateurs kit/plan/inventaire/actions`, ['Kit 72 heures', 'Plan familial', 'Inventaire à vérifier', 'Actions en attente', 'Niveau de préparation'].every((s) => dash.includes(s)));
    // Cartes d'accès rapide
    await clickText(page, 'button', 'Inventaire\nStocks');
    check(`${tag}: accès rapide Inventaire`, (await page.evaluate(() => document.body.innerText)).toLowerCase().includes('inventaire'));
    await page.goto(`${base}/?skip_onboarding=1`, { waitUntil: 'networkidle0' });
    // Mode CRISE depuis l'en-tête
    await clickText(page, 'header button', 'CRISE');
    let txt = await page.evaluate(() => document.body.innerText);
    check(`${tag}: ouverture mode CRISE`, txt.includes('MODE CRISE IMMÉDIAT') || txt.includes('Mode Crise Immédiat'));
    const sticky = await page.evaluate(() => { window.scrollTo(0, 2000); const b = [...document.querySelectorAll('button')].find((e) => e.textContent?.includes('Quitter')); const r = b?.getBoundingClientRect(); return !!r && r.top >= 0 && r.top < 120; });
    check(`${tag}: bouton Quitter visible après défilement`, sticky);
    await clickText(page, 'button', 'ÉVACUER');
    txt = await page.evaluate(() => document.body.innerText);
    check(`${tag}: volet Évacuer déplié`, txt.includes("Uniquement si le Préfet l'ordonne"));
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.evaluate(() => { [...document.querySelectorAll<HTMLElement>('header button')].find((b) => b.innerText.trim().toLowerCase().endsWith('quitter'))?.click(); });
    await sleep(300);
    txt = await page.evaluate(() => document.body.innerText);
    check(`${tag}: sortie du mode CRISE`, txt.includes('Ma préparation aux risques'));
    // Menu latéral + Échap
    await page.goto(`${base}/?skip_onboarding=1`, { waitUntil: 'networkidle0' });
    await page.click('header button[aria-label]');
    await sleep(300);
    const drawerOpen = await page.$('[role="dialog"]');
    await page.keyboard.press('Escape');
    await sleep(300);
    const drawerClosed = !(await page.$('[role="dialog"]'));
    check(`${tag}: menu ouvert puis fermé avec Échap`, !!drawerOpen && drawerClosed);
    // Langue EN
    await clickText(page, 'header button', 'EN');
    txt = await page.evaluate(() => document.body.innerText);
    check(`${tag}: bascule anglais (tableau de bord)`, txt.includes('My risk preparedness') && txt.includes('Preparedness indicators') && !txt.includes('Indicateurs de préparation'));
    await clickText(page, 'header button', 'FR');
    // Hors-ligne
    await page.setOfflineMode(true);
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));
    await sleep(300);
    txt = await page.evaluate(() => document.body.innerText);
    check(`${tag}: indicateur hors-ligne`, txt.includes('Hors ligne') || txt.includes('Hors Ligne'));
    await page.setOfflineMode(false);
    // Thème sombre via le menu
    await page.click('header button[aria-label]');
    await sleep(200);
    await clickText(page, '[role="dialog"] button', 'Sombre');
    const dark = await page.evaluate(() => document.documentElement.classList.contains('dark') && getComputedStyle(document.body).backgroundColor);
    check(`${tag}: thème sombre appliqué`, !!dark && dark !== 'rgb(244, 247, 251)', String(dark));
    await clickText(page, '[role="dialog"] button', 'Clair');
    await page.close();
  }
  // Service worker & cache hors-ligne
  const page = await browser.newPage();
  await page.goto(`${base}/?skip_onboarding=1`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: 'networkidle0' });
  const cached = await page.evaluate(async () => { const c = await caches.open('nrbcor-cache-v2'); return (await c.keys()).map((r) => new URL(r.url).pathname); });
  check('PWA: cache contient Inter + Material Symbols', cached.includes('/fonts/inter-latin-var.woff2') && cached.includes('/fonts/material-symbols-outlined.woff2'), `${cached.length} entrées`);
  await page.setOfflineMode(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await sleep(1200);
  const offTxt = await page.evaluate(() => document.body.innerText);
  check('PWA: rechargement hors-ligne de l\'application', offTxt.includes('Ma préparation aux risques'));
  await browser.close();
  check('Aucune erreur JavaScript', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? '✅' : '❌'} ${r.name}${r.info ? ' — ' + r.info : ''}`);
  const fail = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - fail}/${results.length} vérifications réussies`);
  process.exit(fail ? 1 : 0);
})();
