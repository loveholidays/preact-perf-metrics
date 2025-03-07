import { test, expect } from '@playwright/test';
import { reset } from '@loveholidays/preact-perf-metrics';

const RUNNING_URL = 'http://localhost:5173/items-list';

test.describe('Nodes Rendered', () => {
  test('ListItem as Function', async ({ page }) => {
    await page.goto(RUNNING_URL);
    await page.getByRole('button', { name: 'as-inline-function Next' }).waitFor();
    await reset(page);
    await page.getByRole('button', { name: 'as-inline-function Next' }).click();
    await expect(page).toPerform({ nodesUnmounted: 18 });
  });
  test('ListItem as Component', async ({ page }) => {
    await page.goto(RUNNING_URL);
    await page.getByRole('button', { name: 'as-component Next' }).waitFor();
    await reset(page);
    await page.getByRole('button', { name: 'as-component Next' }).click();
    await expect(page).toPerform({ nodesUnmounted: 0 });
  });

  test.describe('toPerformAtMost', () => {
    test('to pass when within limits', async ({page}) => {
      await page.goto(RUNNING_URL);
      await page.getByRole('button', {name: 'as-inline-function Next'}).waitFor();
      await reset(page);
      await page.getByRole('button', {name: 'as-inline-function Next'}).click();
      await expect(page).toPerformAtMost({nodesUnmounted: 20});
    });
  });
  test.describe('toPerformAtMost failure', () => {
    test('to fail when limits exceeded', async ({ page }) => {
      await page.goto(RUNNING_URL);
      await page.getByRole('button', { name: 'as-inline-function Next' }).waitFor();
      await reset(page);
      await page.getByRole('button', { name: 'as-inline-function Next' }).click();
      await expect(page)
          .not
          .toPerformAtMost({ nodesUnmounted: 10 });
    });
  });
});
