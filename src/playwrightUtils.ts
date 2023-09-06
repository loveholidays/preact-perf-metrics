import type { Page } from '@playwright/test';
import { diff } from 'jest-diff';

const reset = async (page: Page) => {
  await settle(page);
  await page.evaluate(() => {
    const w = window as any;
    w.__PREACT_PERFMETRICS__ = {
      elementsRendered: [],
      renderPhases: [],
      elementsUnmounted: [],
      lastInteraction: performance.now(),
      waitForInteractionsFinished: () => {
        return new Promise<void>((resolve) => {
          function check() {
            if (performance.now() - w.__PREACT_PERFMETRICS__.lastInteraction > 1500) {
              resolve();
            } else {
              setTimeout(check, 500);
            }
          }
          check();
        });
      }
    };
  });
};

const counters = async (page: Page) => await page.evaluate('window.__PREACT_PERFMETRICS__');
const settle = async (page: Page) => await page.evaluate('window.__PREACT_PERFMETRICS__.waitForInteractionsFinished()');

interface Counters {
  elementsRendered?: number;
  renderPhases?: number;
  elementsUnmounted?: number;
}
const equals = (a: any, b: any) => Object.keys(a).every((key) => a[key] === b[key]);

const extension = {
  async toRerenderElements(page: any, expected: string[]) {
    if (!page.evaluate) {
      throw Error("You need to call `toPerformance` from a playwright's `page` object");
    }
    await settle(page);
    const counts = (await counters(page)) as Counters;
    const pass = equals(expected, counts.elementsRendered);
    const messageStr = diff(expected, counts.elementsRendered);

    return {
      message: () => messageStr,
      pass,
    };
  },
  async toPeform(page: any, expected: Counters) {
    if (!page.evaluate) {
      throw Error("You need to call `toPerformance` from a playwright's `page` object");
    }
    await settle(page);
    const counts = (await counters(page)) as Counters;
    const countersN = {} as Counters;

    for (const k of Object.keys(expected)) {
      (countersN as any)[k] = (counts as any)[k].length;
    }

    const pass = equals(expected, countersN);
    const messageStr = diff(expected, countersN);

    return {
      message: () => messageStr,
      pass,
    };
  },
};

declare global {
  export namespace PlaywrightTest {
    export interface Matchers<R, T = unknown> {
      toPeform: (expected: Counters) => Promise<void>;
      toRerenderElements: (rerender: string[]) => Promise<void>;
    }
  }
}

export { extension, counters, reset };
