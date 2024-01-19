// @ts-nocheck
import React, { useCallback, useEffect } from 'react';

const ListItem = ({ text, selected, as: Wrapper = 'div' }) => {
  return <Wrapper className={`list-item ${selected ? 'selected': ''}`}>{text}</Wrapper>;
};

const ListItemMemoed = React.memo(ListItem);

const CustomListItem = ({ children, className }) => {
  return <div className={`custom ${className}`}>{children}</div>;
}

const CustomListItemMemoed = React.memo(CustomListItem);


const MyButton = ({ children, className }) => {
  useEffect(() => {
    console.info('[MB mounted] ',children)
    return () => console.info('[MB unmounted] ',children)
  }, []);
    return <div className={`custom ${className}`}>{children}</div>;
};



export const ListExample = () => {
  const [ selected, setSelected ] = React.useState(0);

  const items = ['one', 'two', 'three', 'four', 'five', 'six'];
  const onClick = useCallback(() => {
    setSelected((selected) => (selected + 1) % items.length);
  },[]);


  return (
    <>
      <button onClick={onClick}>Next</button>
      {items.map((item, index) => (
        // <ListItemMemoed key={index} text={item} selected={index === selected} as={CustomListItemMemoed}
        <ListItemMemoed key={index} text={item} selected={index === selected} as={
            ({children, className}) => (<MyButton key={index} className={`custom ${className}`}>{children}</MyButton>)
        } 
        />
      ))}
    </>
  );
};
