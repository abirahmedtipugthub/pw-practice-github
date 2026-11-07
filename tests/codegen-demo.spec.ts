import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://demo.automationtesting.in/Static.html');
  await page.locator('#droparea').click();
  await page.locator('#aswift_2_host').getByRole('link', { name: 'Compare TVs' }).click();
  await page.locator('#hd-modal-background').click();
});