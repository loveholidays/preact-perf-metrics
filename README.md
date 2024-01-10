# preact-perf-metrics




### Install

```
npm install @loveholidays/preact-perf-metrics
```


### Instrument your app


```{js}
import { setup } from "@loveholidays/preact-perf-metrics/lib/setup"
...


setup();
```

### Test

setup playwright
```
import { expect } from '@playwright/test';

import { extension } from '@loveholidays/preact-perf-metrics';
expect.extend(extension);

```

test!
```
import { reset } from '@loveholidays/preact-perf-metrics';

...
test("...", await ({page}) => {
    await page.goto('http://localhost:5173');
    await reset(page);
    // action
    await expect(page).toPerform({elementsRendered: 1, renderPhases: 1});
})
```
