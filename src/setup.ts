import { options, Fragment } from 'preact';

const reset = () => {
  const w = window as any;
  w.__PREACT_PERFMETRICS__ = {
    nodesRendered: [],
    renderPhases: [],
    nodesUnmounted: [],
    lastInteraction: performance.now(),
    waitForInteractionsFinished: () => {
      return new Promise<void>((resolve: any) => {
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
};

const displayName = (vnode: any) => {
  if (vnode.type === Fragment) {
    return 'Fragment';
  }
  if (typeof vnode.type === 'function') {
    return vnode.type.displayName || vnode.type.name;
  }
  if (typeof vnode.type === 'string') {
    return vnode.type;
  }

  return '#text';
};

const setup = () => {
  const w = window as any;
  const o = options as any;

  const render = o.__r;
  const commit = o.__c;
  const { unmount } = o;

  reset();
  o.__r = (vnode: any) => {
    w.__PREACT_PERFMETRICS__.nodesRendered.push(displayName(vnode));
    w.__PREACT_PERFMETRICS__.lastInteraction = performance.now();
    render(vnode);
  };
  o.__c = (vnode: any, commitQueue: any) => {
    w.__PREACT_PERFMETRICS__.renderPhases.push(displayName(vnode));
    w.__PREACT_PERFMETRICS__.lastInteraction = performance.now();
    commit(vnode, commitQueue);
  };

  o.unmount = (vnode: any) => {
    w.__PREACT_PERFMETRICS__.nodesUnmounted.push(displayName(vnode));
    w.__PREACT_PERFMETRICS__.lastInteraction = performance.now();
    unmount(vnode);
  };
};

export { setup };
