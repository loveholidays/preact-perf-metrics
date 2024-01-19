# preact-perf-metrics

## What is it

This utility enabling performance-testing of a preact app, ensure it's internal operations (rerenders, unmountings, etc) don't change unintentionally.
To do that, `preact-perf-metrics` provides (a) a `setup()` function to instrument your web-app, and (b) some helper functions to help writing `playwright` tests.



## Install

```
npm install @loveholidays/preact-perf-metrics
```


## Usage #1 - Instrument your app

```{js}
import { setup } from "@loveholidays/preact-perf-metrics/lib/setup"
...

// somewhere in your app entry-point
if (env.COLLLECT_PREACT_PERF_METRICS) {
    setup();
}
```

> Note: you might want to call `setup()` only in a testing environment, not in the production build. 
> Similarly to what you would do with `preact/debug` for the devtools.

From now on, `preact-perf-metrics` will start collecting performance data in `window.__PREACT_PERF_METRICS__`

## Usage #2 - Write tests

### setup playwright extensions

This extends the `expect` function to support these custom assertions.

```
import { expect } from '@playwright/test';

import { extension } from '@loveholidays/preact-perf-metrics';
expect.extend(extension);
```

### write tests

```
import { expect, test } from '@playwright/test';
import { reset } from '@loveholidays/preact-perf-metrics';

test("...", await ({page}) => {
    await page.goto('...');

    // prepare: clear the counters
    await reset(page); 

    // action
    page.getByText('Button').click();

    // asserts
    await expect(page).toPerform({elementsRendered: 1, renderPhases: 1});
})
```

## Example

See [example](perf-test/counter.spect.ts).


## API Definition

`setup()`

`expect().toPerform({})`
`expect().toRerender([])`
