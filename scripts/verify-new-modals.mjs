import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.join(process.cwd(), 'public', 'gallery');

async function verify() {
  console.log('Connecting headless browser to localhost:3000...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
    defaultViewport: { width: 1440, height: 960, deviceScaleFactor: 1.5 }
  });

  const page = await browser.newPage();

  // 1. Open Marketplace and authenticate as judge so checkout works directly
  console.log('Navigating to marketplace...');
  await page.goto('http://localhost:3000/marketplace', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.setItem('araxie_user', JSON.stringify({
      id: 'usr-judge-sandbox',
      name: 'Judge Evaluator',
      email: 'judge.sandbox@araxie.edu',
      university: 'Stanford University (Stanford \'26)',
      role: 'student_buyer',
      verified: true,
      avatar: '/avatars/marcus.svg'
    }));
  });
  await page.reload({ waitUntil: 'networkidle2' });

  // 2. Open AI Concierge & capture UI
  console.log('Opening AI Concierge...');
  await page.keyboard.down('Control');
  await page.keyboard.press('j');
  await page.keyboard.up('Control');
  await new Promise(r => setTimeout(r, 1000));

  // Type in prompt
  const inputEl = await page.$('input[placeholder="Chat a message..."]');
  if (inputEl) {
    await inputEl.type('Sophomore CS student taking algorithms and web dev with a $20 budget.');
    await page.keyboard.press('Enter');
    console.log('Waiting for AI Concierge bundle...');
    await new Promise(r => setTimeout(r, 3500));
    await page.screenshot({ path: path.join(OUT_DIR, 'verify_01_ai_concierge.png') });
    console.log('Captured verify_01_ai_concierge.png');

    // Click "Proceed to PayPal Checkout"
    console.log('Clicking Proceed to PayPal Checkout inside AI Concierge...');
    const payBtns = await page.$$('button');
    for (const b of payBtns) {
      const txt = await page.evaluate(el => el.textContent, b);
      if (txt && txt.includes('Proceed to PayPal Checkout')) {
        await b.click();
        await new Promise(r => setTimeout(r, 1200));
        break;
      }
    }
  }

  // 3. Capture PayPal Checkout Step 1: Review
  console.log('Capturing PayPal Checkout Step 1...');
  await page.screenshot({ path: path.join(OUT_DIR, 'verify_02_paypal_step1_review.png') });
  console.log('Captured verify_02_paypal_step1_review.png');

  // 4. Click "Debit or Credit Card" to go to Step 2
  console.log('Navigating to Step 2: Debit or Credit Card...');
  const cardBtns = await page.$$('button');
  for (const b of cardBtns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && txt.includes('Debit or Credit Card')) {
      await b.click();
      await new Promise(r => setTimeout(r, 1000));
      break;
    }
  }

  // Click "Autofill Demo Card"
  const autofillBtn = await page.$$('button');
  for (const b of autofillBtn) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && txt.includes('Autofill Demo Card')) {
      await b.click();
      await new Promise(r => setTimeout(r, 500));
      break;
    }
  }
  await page.screenshot({ path: path.join(OUT_DIR, 'verify_03_paypal_step2_card.png') });
  console.log('Captured verify_03_paypal_step2_card.png');

  // 5. Submit Card Payment to trigger Step 3
  console.log('Submitting card payment...');
  const submitBtns = await page.$$('button');
  for (const b of submitBtns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && txt.includes('Pay') && txt.includes('Now')) {
      await b.click();
      console.log('Waiting for payment capture...');
      await new Promise(r => setTimeout(r, 3000));
      break;
    }
  }
  await page.screenshot({ path: path.join(OUT_DIR, 'verify_04_paypal_step3_success.png') });
  console.log('Captured verify_04_paypal_step3_success.png');

  // 6. Close checkout to see AINotificationToast
  console.log('Closing checkout to see AI notification toast...');
  const lockerBtn = await page.$$('button');
  for (const b of lockerBtn) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && txt.includes('View in My Locker')) {
      await b.click();
      await new Promise(r => setTimeout(r, 1000));
      break;
    }
  }
  await page.screenshot({ path: path.join(OUT_DIR, 'verify_05_ai_notification_toast.png') });
  console.log('Captured verify_05_ai_notification_toast.png');

  await browser.close();
  console.log('All verification screenshots captured successfully!');
}

verify().catch(e => {
  console.error('Error during verification:', e);
  process.exit(1);
});
