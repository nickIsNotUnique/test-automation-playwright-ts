import { test, expect } from '@playwright/test';

test('failing test', { tag: ['@p0'] }, async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Failing/);
});
