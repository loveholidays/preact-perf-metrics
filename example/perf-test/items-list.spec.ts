import { test, expect } from '@playwright/test';
import { reset } from '@loveholidays/preact-perf-metrics';

const RUNNING_URL = 'http://localhost:5173/items-list';

test.describe('Elements Rendered', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(RUNNING_URL);
  });
  test('ListItem as Function', async ({ page }) => {
    await reset(page);
    await page.getByRole('button', { name: 'as-inline-function Next' }).click();
    await expect(page).toPerform({ elementsUnmounted: 18 });
  });
  test('ListItem as Component', async ({ page }) => {
    await reset(page);
    await page.getByRole('button', { name: 'as-component Next' }).click();
    await expect(page).toPerform({ elementsUnmounted: 0 });
  });
});
