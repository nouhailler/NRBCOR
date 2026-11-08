import puppeteer from 'puppeteer';
import path from 'path';

async function testTour() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
    defaultViewport: { width: 1280, height: 820, deviceScaleFactor: 2 }
  });

  const page = await browser.newPage();
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
  });

  console.log('Loading page with ?tour=1...');
  await page.goto('http://localhost:3000/?tour=1&skip_onboarding=1', { waitUntil: 'networkidle0', timeout: 25000 });
  await new Promise((r) => setTimeout(r, 1500));

  const screenshotPath = path.resolve(process.cwd(), 'public/screenshots/tour_step1_preview.png');
  await page.screenshot({ path: screenshotPath, type: 'png' });
  console.log('Saved tour preview:', screenshotPath);

  // Test pause click
  const pauseButton = await page.$('button[title*="Pause"]');
  if (pauseButton) {
    await pauseButton.click();
    console.log('Clicked pause button successfully!');
  }

  await browser.close();
}

testTour().catch(console.error);
