import { options, Fragment } from 'preact';

const reset = () => {
  (window as any).__PREACT_PERFMETRICS__ = {
    elementsRendered: [],
    renderPhases: [],
    elementsUnmounted: [],
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
    w.__PREACT_PERFMETRICS__.elementsRendered.push(displayName(vnode));
    render(vnode);
  };
  o.__c = (vnode: any, commitQueue: any) => {
    w.__PREACT_PERFMETRICS__.renderPhases.push(displayName(vnode));
    commit(vnode, commitQueue);
  };

  o.unmount = (vnode: any) => {
    w.__PREACT_PERFMETRICS__.elementsUnmounted.push(displayName(vnode));
    unmount(vnode);
  };
};

export { setup };
