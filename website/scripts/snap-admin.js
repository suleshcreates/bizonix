const { chromium } = require('playwright');

async function snap() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:3002/login', { waitUntil: 'networkidle' });
  await page.fill('#email-address', 'admin@bizonix.com');
  await page.fill('#password', 'admin_bizonix123');
  await page.click('button[type="submit"]');
  
  await page.waitForURL('**/dashboard', { timeout: 6000 }).catch(() => {});
  await page.goto('http://localhost:3002/hero', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'admin_hero_cms_authenticated.png' });
  await browser.close();
  console.log('Admin CMS Authenticated Screenshot saved successfully!');
}

snap().catch(console.error);
