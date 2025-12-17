import { expect, test } from '@playwright/test';

test.describe('App', () => {
  test('should display the app title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/angular-enterprise-blueprint/i);
  });
});
