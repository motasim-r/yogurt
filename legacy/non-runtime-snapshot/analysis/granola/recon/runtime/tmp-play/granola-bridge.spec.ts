import { test } from '@playwright/test';

test('bridge page loads without route error', async ({ page }) => {
  await page.goto('http://127.0.0.1:4793/index-browser-auth-capture.html?figmacapture=dummy&figmaendpoint=https%3A%2F%2Fmcp.figma.com%2Fmcp%2Fcapture%2Fdummy%2Fsubmit&figmadelay=500', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  const state = await page.evaluate(() => ({
    href: location.href,
    hash: location.hash,
    text: (document.body.innerText || '').slice(0, 240),
    hasBridgeButton: !!document.querySelector('#figma-capture-bridge button')
  }));
  console.log('state', JSON.stringify(state));
  await page.screenshot({ path: '/Users/motasimrahman/Desktop/codex/yoghurt/analysis/granola/recon/runtime/live-captures/granola-bridge-validation.png' });
});
