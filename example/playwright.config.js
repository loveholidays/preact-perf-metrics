import { expect } from '@playwright/test';

import { extension } from '@loveholidays/preact-perf-metrics';
expect.extend(extension);

const config = {
  testDir: './perf-test',
};

export default config;
