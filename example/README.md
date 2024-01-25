# preact-perf-metrics | example

This minimal `preact` app (created following [these instructions](https://preactjs.com/guide/v10/getting-started#create-a-vite-powered-preact-app)) showcases `preact-perf-metrics`.

There're two examples, `/counters` and `/items-list`, and each has an associated perf-test: [/counters](perf-test/counter.spec.ts), [/items-list](perf-test/listitem.spec.ts).

## Run the performance tests

To run the performance tests:

* step into this directory (`/example`)
* Install dependencies: `npm install`
* Run the application: `npm run dev`
* In a different terminal (while de application is running), run the tests: `npm run test:perf`


## Notable details

#### 1- Peformance instrumentation

It happens in [the main file](src/index.jsx) using the `setup()` function from `@loveholidays/preact-perf-metrics/setup`

#### 2- Playwright configuration

It happens in the [playwright config file](playwright.config.js) when doing

```js
import { expect } from '@playwright/test';
import { extension } from '@loveholidays/preact-perf-metrics';
expect.extend(extension);
```

> [!NOTE]
> Note that this can also be done directly on the test file itself, in another file, etc (see [playwright-custom-matchers docs](https://playwright.dev/docs/test-assertions#add-custom-matchers-using-expectextend))

#### 3- Playwright tests

The test files under [perf-test](perf-test/) folder

Note that for each interaction you want to test you need to call `reset()` before (to reset the counters).