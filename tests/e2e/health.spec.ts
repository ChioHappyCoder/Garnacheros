import { test, expect } from '@playwright/test';

test.describe('Health Checks', () => {
  test('Backend API health endpoint returns 200', async ({ request }) => {
    const response = await request.get('http://localhost:3000/health');
    expect(response.status()).toBe(200);
  });

  test('Frontend loads login page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Garnacheros');
  });
});
