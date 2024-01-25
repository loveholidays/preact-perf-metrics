import { expect } from '@playwright/test';

// extend `expect` with @loveholidays/preact-perf-metrics matchers
import { extension } from '@loveholidays/preact-perf-metrics';
expect.extend(extension);

const config = {
  testDir: './perf-test',
};

export default config;
