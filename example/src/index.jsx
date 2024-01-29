import { render } from 'preact';
import { Router } from 'preact-router';

import './style.css';

import { setup } from '@loveholidays/preact-perf-metrics';


import { Counter1, Counter2, Counter3, Counter4, Counter5 } from './Counter';
import { ItemsList } from './ItemsList';

export function App() {
  return (
    <div style="">
      <Router>
        <div path="/items-list">
          <h1>Items List</h1>
          <div style="display:flex;gap:1em">
            <ItemsList renderStrategy="as-component" />
            <ItemsList renderStrategy="as-inline-function" />
          </div>
        </div>
        <div path="/counters">
          <h1>Counters</h1>
          <Counter1 />
          <Counter2 />
          <Counter3 />
          <Counter4 />
          <Counter5 />
        </div>
        <div default>
          <h1>preact-perf-metrics | examples</h1>
          <p>
            <a href="/items-list">Items List</a>
          </p>
          <p>
            <a href="/counters">Counters</a>
          </p>
        </div>
      </Router>
    </div>
  );
}

// instrument the application with `@loveholidays/preact-perf-metrics`
setup();
render(<App />, document.getElementById('app'));
