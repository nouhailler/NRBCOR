import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = path.resolve(process.cwd(), 'public/screenshots');

async function capture() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
    defaultViewport: null
  });

  const targets = [
    {
      name: 'nrbcor_desktop_home.png',
      url: 'http://localhost:3000/?skip_onboarding=1',
      viewport: { width: 1366, height: 860, deviceScaleFactor: 2 }
    },
    {
      name: 'nrbcor_desktop_perimetres.png',
      url: 'http://localhost:3000/?sub=carte-perimetres&skip_onboarding=1',
      viewport: { width: 1366, height: 860, deviceScaleFactor: 2 }
    },
    {
      name: 'nrbcor_desktop_encyclopedie.png',
      url: 'http://localhost:3000/?sub=encyclopedie&skip_onboarding=1',
      viewport: { width: 1366, height: 860, deviceScaleFactor: 2 }
    },
    {
      name: 'nrbcor_desktop_plan.png',
      url: 'http://localhost:3000/?tab=mon-plan&skip_onboarding=1',
      viewport: { width: 1366, height: 860, deviceScaleFactor: 2 }
    },
    {
      name: 'nrbcor_mobile_home.png',
      url: 'http://localhost:3000/?skip_onboarding=1',
      viewport: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
    },
    {
      name: 'nrbcor_mobile_reagir.png',
      url: 'http://localhost:3000/?tab=reagir&skip_onboarding=1',
      viewport: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
    },
    {
      name: 'nrbcor_mobile_kit72h.png',
      url: 'http://localhost:3000/?tab=preparation&skip_onboarding=1',
      viewport: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
    },
    {
      name: 'nrbcor_mobile_monplan.png',
      url: 'http://localhost:3000/?tab=mon-plan&skip_onboarding=1',
      viewport: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
    },
    {
      name: 'nrbcor_mobile_perimetres.png',
      url: 'http://localhost:3000/?sub=carte-perimetres&skip_onboarding=1',
      viewport: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
    }
  ];

  for (const t of targets) {
    const page = await browser.newPage();
    await page.setViewport(t.viewport);

    // Pre-seed localStorage so onboarding is completed and demo data is ready
    await page.evaluateOnNewDocument(() => {
      const settings = {
        onboardingCompleted: true,
        householdSize: 4,
        savedCommune: { name: 'Lyon 3e Arrondissement', inSevesoZone: false, inNppRadius: true },
        preferredTheme: 'light',
        profileMode: 'simplified',
        textScale: 'normal',
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('nrbc_settings', JSON.stringify(settings));
      localStorage.setItem('nrbcor_profile_mode', 'simplified');
    });

    console.log(`Navigating to ${t.name}...`);
    await page.goto(t.url, { waitUntil: 'networkidle0', timeout: 25000 });
    // Let animations and fonts settle
    await new Promise((r) => setTimeout(r, 1200));

    const outPath = path.join(SCREENSHOTS_DIR, t.name);
    await page.screenshot({ path: outPath, type: 'png', fullPage: false });
    console.log(`Saved screenshot: ${outPath}`);
    await page.close();
  }

  // Update public/nrbcor_screenshot.jpg with authentic Desktop Home screenshot
  const mainDesktopPage = await browser.newPage();
  await mainDesktopPage.setViewport({ width: 1376, height: 860, deviceScaleFactor: 1 });
  await mainDesktopPage.evaluateOnNewDocument(() => {
    const settings = {
      onboardingCompleted: true,
      householdSize: 4,
      savedCommune: { name: 'Lyon 3e Arrondissement', inSevesoZone: false, inNppRadius: true },
      preferredTheme: 'light',
      profileMode: 'simplified',
      textScale: 'normal',
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('nrbc_settings', JSON.stringify(settings));
  });

  await mainDesktopPage.goto('http://localhost:3000/?skip_onboarding=1', { waitUntil: 'networkidle0', timeout: 25000 });
  await new Promise((r) => setTimeout(r, 1200));
  const mainJpgPath = path.resolve(process.cwd(), 'public/nrbcor_screenshot.jpg');
  await mainDesktopPage.screenshot({ path: mainJpgPath, type: 'jpeg', quality: 92 });
  console.log(`Updated public/nrbcor_screenshot.jpg with authentic app screenshot!`);
  await mainDesktopPage.close();

  await browser.close();
  console.log('All real screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
