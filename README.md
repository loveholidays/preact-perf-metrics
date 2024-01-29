<h1 align="center">preact-perf-metrics</h1>

<p align="center"> 
    <i>
    A performance-testing tool for your <a href="https://preactjs.com/">preact</a> based app
    </i>
</p>

## Overview

This utility allows you to instrument you preact application bundle, and to write performance tests using [playwright](https://playwright.dev/) to assert on the framework activity (rerenders, unmountings, etc) during an interaction.

Using this tool, you can ensure that the performance of your pages don't regress unintentionally. 

Read the [release blog post](https://loveholidays.com) and see the [/example](/example) for more information.

<i>Made with ❤️ by loveholidays.com</i>

--- 

## Usage

See an example application in the [/example](example/README.md) subdirectory.

#### 1- Install the library

```bash
npm install @loveholidays/preact-perf-metrics
```

#### 2- Instrument your application

```js
import { setup } from "@loveholidays/preact-perf-metrics/lib/setup"

// ... somewhere in your app entry-point
setup();
```

> [!NOTE]
> you might want to call `setup()` only in a testing environment, not in the production build. 
> Similarly to what you would do with `preact/debug` for the devtools.

#### 3- Configure Playwright extension

This extends the `expect` function to support the libraries' custom matchers.

```js
import { expect } from '@playwright/test';
import { extension } from '@loveholidays/preact-perf-metrics';
expect.extend(extension);
```

> [!NOTE]
> This can also be done on the test file itself or in another file (see [playwright-custom-matchers docs](https://playwright.dev/docs/test-assertions#add-custom-matchers-using-expectextend))

#### 4- Write tests

Write performance tests using `reset()` (reset the counters) and the custom matchers (`toPerform()`, `toRerender()`)

```js
import { expect, test } from '@playwright/test';
import { reset } from '@loveholidays/preact-perf-metrics';

test("...", await ({page}) => {
    await page.goto('...');

    // prepare: clear the counters
    await reset(page);  /

    // action
    await page.getByText('Button').click();

    // test: use of custom matcher `toPerform`
    await expect(page).toPerform({ elementsRendered: 1, renderPhases: 1 });
})
```

## API

The API can be divided in two:
* to instrument the application that runs in the browser: `setup()`, 
* to write playwright tests: `reset()`, `expect.toPerform()`, and `expect.toRerender()`


### `setup()`
Instruments the application to update the counters in `window.__PREACT_PERF_METRICS__` upon any preact internal activity (renders, unmounting, etc).

### `reset()`
Playwright utility to resets all the counters (accummulators) to zero. Used to set the beginning of a measurement.

### `expect().toPerform(...)`
[Playwright Custom matcher](https://playwright.dev/docs/test-assertions#add-custom-matchers-using-expectextend) to assert on the framework activity during an interaction.

The parameter to assert is an object with one or many of the following keys:

```js
interface Counters {
  elementsRendered?: number;
  renderPhases?: number;
  elementsUnmounted?: number;
}
```

Example:
```js
await reset();
await page.locator('.counter').click();
await expect(page).toPerform({ elementsRerendered: 1 });
```

### `expect().toRerender(...)`

[Playwright Custom matcher](https://playwright.dev/docs/test-assertions#add-custom-matchers-using-expectextend) to assert on the list of elements rerendered during an interaction.

The parameter to assert is an array of strings, with the names of the preact-nodes involved:

Example:
```js
await reset();
await page.locator('.counter').click();
await expect(page).toRerender(["MyCounterPage", "Button"]);
```


---



--- 

## License

MIT