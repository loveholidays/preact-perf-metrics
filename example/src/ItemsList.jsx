// @ts-nocheck
import React from 'react';

const ITEMS = ['one', 'two', 'three', 'four', 'five', 'six'];

const ListItem = ({ text, selected, as: Wrapper }) => {
  return <Wrapper className={`list-item ${selected ? 'selected' : ''}`}>{text}</Wrapper>;
};

const ItemComponent = (props) => {
  return <div {...props}>{props.children}</div>;
};

/** Description:
 * despite using the same `ListItem` component, the way of definining how to render an item (`as` prop) affects performance.
 * In this example, passing `as: Item` (component) is faster than passing `as: () => ...` (inline-function), despite doing the same thing.
 * The inline-function is unmounted/mounted on every render, while the component is not.
 * 
 * see `perf-test/listitem.spec.ts` for reference.
 */
export const ItemsList = ({ renderStrategy }) => {
  const [selected, setSelected] = React.useState(0);
  const onClickCb = () => {
    setSelected((selected) => (selected + 1) % ITEMS.length);
  }

  return (
    <div class="example">
      <button onClick={onClickCb}>{`${renderStrategy} Next`}</button>

      {renderStrategy === 'as-inline-function' &&
        ITEMS.map((item, index) => (
          <ListItem
            key={index}
            text={item}
            selected={index === selected}
            as={(props) => <div {...props}/>}
          />
        ))}

      {renderStrategy === 'as-component' &&
        ITEMS.map((item, index) => (
          <ListItem 
            key={index} 
            text={item} 
            selected={index === selected} 
            as={ItemComponent} 
          />
        ))}
    </div>
  );
};
