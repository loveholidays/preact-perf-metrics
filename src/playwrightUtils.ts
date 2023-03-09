import type { Page } from '@playwright/test';
import { diff } from 'jest-diff';

const reset = async (page: Page) => {
  await page.evaluate(() => {
    (window as any).__PREACT_PERFMETRICS__ = {
      elementsRendered: [],
      renderPhases: [],
      elementsUnmounted: [],
    };
  });
};
const counters = async (page: Page) => await page.evaluate('window.__PREACT_PERFMETRICS__');

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
