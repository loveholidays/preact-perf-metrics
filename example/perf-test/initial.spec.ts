import { test, expect } from '@playwright/test';
import { reset } from '@loveholidays/preact-perf-metrics';

const RUNNING_URL = 'http://localhost:5173';

test.describe('Elements Rendered', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(RUNNING_URL);
  });
  test('Counter-1', async ({ page }) => {
    await reset(page);
    await page.getByText('Counter-1: 0').waitFor();
    await page.getByRole('button', { name: 'Counter-1' }).click();
    await page.getByText('Counter-1: 1').waitFor();
    await expect(page).toPerform({ elementsRendered: 3 });
  });

  test('Counter-2', async ({ page }) => {
    await reset(page);
    await page.getByText('Counter-2: 0').waitFor();
    await page.getByRole('button', { name: 'Counter-2' }).click();
    await page.getByText('Counter-2: 1').waitFor();
    await expect(page).toPerform({ elementsRendered: 1 });
  });
});

test.describe('Render Phases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(RUNNING_URL);
  });
  test('Counter-3', async ({ page }) => {
    await reset(page);
    await page.getByText('Counter-3: 0 and 0').waitFor();
    await page.getByRole('button', { name: 'Counter-3' }).click();
    await page.getByText('Counter-3: 1 and 1').waitFor();
    await expect(page).toPerform({ renderPhases: 1 });
  });
  test('Counter-4', async ({ page }) => {
    await reset(page);
    await page.getByText('Counter-4: 0 and 0').waitFor();
    await page.getByRole('button', { name: 'Counter-4' }).click();
    await page.getByText('Counter-4: 1 and 1').waitFor();
    await expect(page).toPerform({ renderPhases: 2 });
  });
});
test.describe('Unmountings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(RUNNING_URL);
  });
  test('Counter-2', async ({ page }) => {
    await reset(page);
    await page.getByText('Counter-2: 0').waitFor();
    await page.getByRole('button', { name: 'Counter-2' }).click();
    await page.getByRole('button', { name: 'Counter-2' }).click();
    await page.getByText('Counter-2: 2').waitFor();
    await expect(page).toPerform({ elementsUnmounted: 0 });
  });
  test('Counter-4', async ({ page }) => {
    await reset(page);
    await page.getByText('Counter-6: 0').waitFor();
    await page.getByRole('button', { name: 'Counter-6' }).click();
    await page.getByRole('button', { name: 'Counter-6' }).click();
    await page.getByText('Counter-6: 2').waitFor();
    await expect(page).toPerform({ elementsUnmounted: 2 });
  });
});

test.describe('Elements Rerendered', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(RUNNING_URL);
  });
  test('Counter-2', async ({ page }) => {
    await reset(page);
    await page.getByText('Counter-2: 0').waitFor();
    await page.getByRole('button', { name: 'Counter-2' }).click();
    await page.getByText('Counter-2: 1').waitFor();
    await expect(page).toRerenderElements(['Counter2']);
  });
  test('Counter-1', async ({ page }) => {
    await reset(page);
    await page.getByText('Counter-1: 0').waitFor();
    await page.getByRole('button', { name: 'Counter-1' }).click();
    await page.getByText('Counter-1: 1').waitFor();
    await expect(page).toRerenderElements([ 'Counter1', 'Memo(Button)', 'Button']);
    // await expect(page).toRerenderElements(['Counter1']);
    await expect(page).toPerform({ elementsRendered: 3, elementsUnmounted: 0, renderPhases: 1 });
  });
});
