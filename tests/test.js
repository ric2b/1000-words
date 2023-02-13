import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Die 1000 häufigsten deutschen Wörter' })).toBeVisible();
});
