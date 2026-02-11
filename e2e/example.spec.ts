
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Expect a title "to contain" a substring.
    // This might fail if the app is not running or has a different title, 
    // but at least it verifies the runner works.
    // Checking for something generic or just that the page loads.
    await expect(page).toHaveTitle(/AutoFolio/);
});
