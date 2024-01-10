import { render } from 'preact';
import { Counter1, Counter2, Counter3, Counter4, Counter6 } from './Counter';

import { setup } from '@loveholidays/preact-perf-metrics/setup';

import './style.css';

export function App() {
  return (
    <div>
      <h1>Preact Perf Metrics | examples</h1>
      <Counter1 />
      <Counter2 />
      <Counter3 />
	  <Counter4 />
	  <Counter6 />
    </div>
  );
}

setup();
render(<App />, document.getElementById('app'));
