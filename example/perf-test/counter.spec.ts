import { test, expect } from '@playwright/test';
import { reset } from '@loveholidays/preact-perf-metrics';

const RUNNING_URL = 'http://localhost:4173/counters';

test.describe('Counters', () => {
  test.describe('Elements Rendered', () => {
    test('Counter-1 - Memoed button + inline callback', async ({ page }) => {
      await page.goto(RUNNING_URL);
      await reset(page);
      await page.getByText('Counter-1: 0').waitFor();
      await page.getByRole('button', { name: 'Counter-1' }).click();
      await page.getByText('Counter-1: 1').waitFor();
      await expect(page).toPerform({ elementsRendered: 3 });
    });

    test('Counter-2 - Memoed button + useCallback callback', async ({ page }) => {
      await page.goto(RUNNING_URL);
      await reset(page);
      await page.getByText('Counter-2: 0').waitFor();
      await page.getByRole('button', { name: 'Counter-2' }).click();
      await page.getByText('Counter-2: 1').waitFor();
      await expect(page).toPerform({ elementsRendered: 1 });
    });
  });

  test.describe('Render Phases', () => {
    test('Counter-3 - multiples updates in the same event-loop', async ({ page }) => {
      await page.goto(RUNNING_URL);
      await reset(page);
      await page.getByText('Counter-3: 0 and 0').waitFor();
      await page.getByRole('button', { name: 'Counter-3' }).click();
      await page.getByText('Counter-3: 1 and 1').waitFor();
      await expect(page).toPerform({ renderPhases: 1 });
    });
    test('Counter-4 - multiple updates in diffeernt event-loops', async ({ page }) => {
      await page.goto(RUNNING_URL);
      await reset(page);
      await page.getByText('Counter-4: 0 and 0').waitFor();
      await page.getByRole('button', { name: 'Counter-4' }).click();
      await page.getByText('Counter-4: 1 and 1').waitFor();
      await expect(page).toPerform({ renderPhases: 2 });
    });
  });
  test.describe('Unmountings', () => {
    test('Counter-2 - No extra mounting/unmounting', async ({ page }) => {
      await page.goto(RUNNING_URL);
      await reset(page);
      await page.getByText('Counter-2: 0').waitFor();
      await page.getByRole('button', { name: 'Counter-2' }).click();
      await page.getByRole('button', { name: 'Counter-2' }).click();
      await page.getByText('Counter-2: 2').waitFor();
      await expect(page).toPerform({ elementsUnmounted: 0 });
    });
    test('Counter-5 - Conditional mounting/unmounting', async ({ page }) => {
      await page.goto(RUNNING_URL);
      await reset(page);
      await page.getByText('Counter-5: 0').waitFor();
      await page.getByRole('button', { name: 'Counter-5' }).click();
      await page.getByRole('button', { name: 'Counter-5' }).click();
      await page.getByText('Counter-5: 2').waitFor();
      await expect(page).toPerform({ elementsUnmounted: 2 });
    });
  });

  test.describe('Elements Rerendered', () => {
    test('Counter-2 - Memoed Button + useCallback callback', async ({ page }) => {
      await page.goto(RUNNING_URL);
      await reset(page);
      await page.getByText('Counter-2: 0').waitFor();
      await page.getByRole('button', { name: 'Counter-2' }).click();
      await page.getByText('Counter-2: 1').waitFor();
      await expect(page).toRerenderElements(['Counter2']);
      await expect(page).toPerform({ elementsRendered: 1, elementsUnmounted: 0, renderPhases: 1 });
    });
    test('Counter-1 - Memoed Button + inline callback', async ({ page }) => {
      await page.goto(RUNNING_URL);
      await reset(page);
      await page.getByText('Counter-1: 0').waitFor();
      await page.getByRole('button', { name: 'Counter-1' }).click();
      await page.getByText('Counter-1: 1').waitFor();
      await expect(page).toRerenderElements(['Counter1', 'Memo(Button)', 'Button']);
      await expect(page).toPerform({ elementsRendered: 3, elementsUnmounted: 0, renderPhases: 1 });
    });
  });
});
