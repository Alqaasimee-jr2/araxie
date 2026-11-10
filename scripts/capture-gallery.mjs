import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.join(process.cwd(), 'public', 'gallery');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  console.log('Launching Chromium...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--ignore-certificate-errors'],
    defaultViewport: { width: 1440, height: 960, deviceScaleFactor: 1.5 }
  });

  const page = await browser.newPage();

  // 1. Landing Page
  console.log('1. Capturing 01_landing_hero.png...');
  await page.goto('https://araxie.vercel.app', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '01_landing_hero.png') });

  // 2. Marketplace Storefront
  console.log('2. Capturing 02_marketplace_storefront.png...');
  await page.goto('https://araxie.vercel.app/marketplace', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(OUT_DIR, '02_marketplace_storefront.png') });

  // 3. AI Concierge Modal
  console.log('3. Capturing 03_ai_concierge_modal.png...');
  try {
    const aiBtn = await page.$('button[title*="araxieAi"], button:has(svg.lucide-sparkles)');
    if (aiBtn) {
      await aiBtn.click();
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: path.join(OUT_DIR, '03_ai_concierge_modal.png') });
      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 800));
    }
  } catch (err) {
    console.error('Error in AI concierge:', err.message);
  }

  // 4. PayPal Checkout Modal
  console.log('4. Capturing 04_paypal_checkout_modal.png...');
  try {
    const buyBtns = await page.$$('button');
    for (const b of buyBtns) {
      const txt = await page.evaluate(el => el.textContent, b);
      if (txt && txt.trim() === 'Buy') {
        await b.click();
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: path.join(OUT_DIR, '04_paypal_checkout_modal.png') });
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 800));
        break;
      }
    }
  } catch (err) {
    console.error('Error in PayPal modal:', err.message);
  }

  // 5. In-Browser Tool Preview (Flow7 / AlgoVisualizer)
  console.log('5. Capturing 05_interactive_tool_preview.png...');
  try {
    const previewBtns = await page.$$('button');
    for (const b of previewBtns) {
      const txt = await page.evaluate(el => el.textContent, b);
      if (txt && txt.includes('Preview')) {
        await b.click();
        await new Promise(r => setTimeout(r, 2500));
        await page.screenshot({ path: path.join(OUT_DIR, '05_interactive_tool_preview.png') });
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 800));
        break;
      }
    }
  } catch (err) {
    console.error('Error in tool preview:', err.message);
  }

  // 6. Campus Trust Center & Legal Terms
  console.log('6. Capturing 06_trust_center_ferpa_terms.png...');
  await page.goto('https://araxie.vercel.app/terms', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '06_trust_center_ferpa_terms.png') });

  // 7. Campus Commons / Public Space
  console.log('7. Capturing 07_campus_commons_public.png...');
  await page.goto('https://araxie.vercel.app/public', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '07_campus_commons_public.png') });

  // 8. GitHub Repository Page
  console.log('8. Capturing 08_github_repository.png...');
  await page.goto('https://github.com/Alqaasimee-jr2/araxie', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(OUT_DIR, '08_github_repository.png') });

  await browser.close();
  console.log('Successfully captured all 8 high-res gallery screenshots!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
