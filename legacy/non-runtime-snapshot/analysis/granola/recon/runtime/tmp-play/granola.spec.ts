import { test } from '@playwright/test';

test('trace real granola web bundle', async ({ page }) => {
  page.on('console', msg => console.log('console:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('pageerror:', err.message));
  page.on('requestfailed', req => console.log('requestfailed:', req.url(), req.failure()?.errorText));
  page.on('response', async res => {
    const st = res.status();
    const url = res.url();
    if (st >= 400 || /api\.granola\.ai/.test(url)) {
      console.log('response:', st, url);
    }
  });

  await page.goto('http://127.0.0.1:4793/index-browser-auth.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(15000);
  const state = await page.evaluate(() => ({
    href: location.href,
    title: document.title,
    bodyClass: document.body.className,
    rootHtmlLen: document.querySelector('#root')?.innerHTML?.length || 0,
    rootText: (document.querySelector('#root')?.textContent || '').slice(0, 200),
    browserDevSession: localStorage.getItem('browserDevSession') ? 'present' : 'missing',
  }));
  console.log('state:', JSON.stringify(state));
  await page.screenshot({ path: '/Users/motasimrahman/Desktop/codex/yoghurt/analysis/granola/recon/runtime/live-captures/granola-auth-debug-playwright.png' });
});
