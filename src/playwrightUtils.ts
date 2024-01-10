import type { Page } from '@playwright/test';
import { diff } from 'jest-diff';

interface Counters {
  elementsRendered: number;
  renderPhases: number;
  elementsUnmounted: number;
}

interface PageCounters {
  elementsRendered: string[],
  renderPhases: string[],
  elementsUnmounted: string[],
}

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

const getPageCounters : (page: Page) => Promise<PageCounters> = (page) => page.evaluate('window.__PREACT_PERFMETRICS__');
const settle = async (page: Page) => await page.evaluate('window.__PREACT_PERFMETRICS__.waitForInteractionsFinished()');

const equals = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

const extension = {
  async toRerenderElements(page: Page, expected: string[]) {
    if (!page.evaluate) {
      throw Error("You need to call `toRerenderElements` from a playwright's `page` object");
    }
    await settle(page);

    const pageCounters = await getPageCounters(page);
    const pass =  equals(expected, pageCounters.elementsRendered);
    const messageStr = diff(expected, pageCounters.elementsRendered);

    return {
      message: () => messageStr,
      pass,
    };
  },

  async toPerform(page: Page, expected: Partial<Counters>) {
    if (!page.evaluate) {
      throw Error("You need to call `toPerform` from a playwright's `page` object");
    }
    await settle(page);

    const pageCounters = await getPageCounters(page);

    // PageCounters to Counters, only with the keys we're testing for
    const counters = Object.keys(expected).reduce((acc, key) => { 
      acc[key as keyof Counters] = pageCounters[key as keyof Counters].length; 
      return acc }, {} as Counters
    ); 

    const pass = equals(expected, counters);
    const messageStr = diff(expected, counters);

    return {
      message: () => messageStr,
      pass,
    };
  },
};

declare global {
  export namespace PlaywrightTest {
    export interface Matchers<R, T = unknown> {
      toPerform: (expected: Partial<Counters>) => Promise<void>;
      toRerenderElements: (rerender: string[]) => Promise<void>;
    }
  }
}

export { extension, getPageCounters as counters, reset };
