import type { Page } from '@playwright/test';
import { diff } from 'jest-diff';

interface Counters {
  nodesRendered: number;
  renderPhases: number;
  nodesUnmounted: number;
}

interface PageCounters {
  nodesRendered: string[];
  renderPhases: string[];
  nodesUnmounted: string[];
}

const reset = async (page: Page) => {
  await settle(page);
  await page.evaluate(() => {
    const w = window as any;
    w.__PREACT_PERFMETRICS__ = {
      nodesRendered: [],
      renderPhases: [],
      nodesUnmounted: [],
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
      },
    };
  });
};

const getPageCounters: (page: Page) => Promise<PageCounters> = (page) => page.evaluate('window.__PREACT_PERFMETRICS__');
const settle = async (page: Page) => await page.evaluate('window.__PREACT_PERFMETRICS__.waitForInteractionsFinished()');

const equals = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

const lessThanOrEqualTo = (a: Partial<Counters>, b: Counters): boolean => {
  const keys = Object.keys(a) as (keyof Counters)[];

  return keys.every((key) => {
    const valA = a[key];
    const valB = b[key];

    if (!valA) {
      return true;
    }

    return valB <= valA;
  });
};

const perform = async (page: Page, expected: Partial<Counters>, predicate: (a: Partial<Counters>, b: Counters) => boolean) => {
  if (!page.evaluate) {
    throw Error("You need to call `toPerform` from a playwright's `page` object");
  }
  await settle(page);

  const pageCounters = await getPageCounters(page);

  // PageCounters to Counters, only with the keys we're testing for
  const counters = Object.keys(expected).reduce((acc, key) => {
    acc[key as keyof Counters] = pageCounters[key as keyof Counters].length;
    return acc;
  }, {} as Counters);

  const pass = predicate(expected, counters);
  const messageStr = diff(expected, counters);

  return {
    message: () => messageStr,
    pass,
  };
};

const extension = {
  async toRerenderNodes(page: Page, expected: string[]) {
    if (!page.evaluate) {
      throw Error("You need to call `toRerenderNodes` from a playwright's `page` object");
    }
    await settle(page);

    const pageCounters = await getPageCounters(page);
    const pass = equals(expected, pageCounters.nodesRendered);
    const messageStr = diff(expected, pageCounters.nodesRendered);

    return {
      message: () => messageStr,
      pass,
    };
  },

  async toPerform(page: Page, expected: Partial<Counters>) {
    return perform(page, expected, equals);
  },

  async toPerformAtMost(page: Page, expected: Partial<Counters>) {
    return perform(page, expected, lessThanOrEqualTo);
  },
};

declare global {
  export namespace PlaywrightTest {
    export interface Matchers<R, T = unknown> {
      toPerform: (expected: Partial<Counters>) => Promise<void>;
      toPerformAtMost: (expected: Partial<Counters>) => Promise<void>;
      toRerenderNodes: (rerender: string[]) => Promise<void>;
    }
  }
}

export { extension, getPageCounters as counters, reset };
