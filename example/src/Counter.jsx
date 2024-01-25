import { useCallback, memo, useState } from 'preact/compat';

const Button = ({ onClick, text }) => {
  return (
    <button class="button" onClick={onClick}>
      {text}
    </button>
  );
};

const ButtonMemoed = memo(Button);

/** Use a Memoed Button declaring **the callback inline**
 */
export const Counter1 = () => {
  const [count, setCount] = useState(0);
  return (
    <div class="example">
      <ButtonMemoed text="Counter-1" onClick={() => setCount((c) => c + 1)} />
      <p>{`Counter-1: ${count}`}</p>
    </div>
  );
};

/** Use a Memoed Button declaring **the callback using useCallback**
 */
export const Counter2 = () => {
  const [count, setCount] = useState(0);
  const onClick = useCallback(() => setCount((c) => c + 1), []);
  return (
    <div class="example">
      <ButtonMemoed text="Counter-2" onClick={onClick} />
      <p>{`Counter-2: ${count}`}</p>
    </div>
  );
};

/* Perform **multiple state updates** in the **same event-loop**
 */
export const Counter3 = () => {
  const [c1, setC1] = useState(0);
  const [c2, setC2] = useState(0);
  const onClick = useCallback(() => {
    setC1((c) => c + 1);
    setC2((c) => c + 1);
  }, []);
  return (
    <div class="example">
      <Button text="Counter-3" onClick={onClick} />
      <p>{`Counter-3: ${c1} and ${c2}`}</p>
    </div>
  );
};

/* Perform **multiple state updates** in **different event-loops**
 */
export const Counter4 = () => {
  const [c1, setC1] = useState(0);
  const [c2, setC2] = useState(0);
  const onClick = useCallback(() => {
    setC1((c) => c + 1);
    setTimeout(() => setC2((c) => c + 1), 0);
  }, []);
  return (
    <div class="example">
      <Button text="Counter-4" onClick={onClick} />
      <p>{`Counter-4: ${c1} and ${c2}`}</p>
    </div>
  );
};

/* Shows/hides an extra component based on a condition
*/
export const Counter5 = () => {
  const [count, setCount] = useState(0);
  const onClick = useCallback(() => setCount((c) => c + 1), []);
  return (
    <div class="example">
      <Button text="Counter-5" onClick={onClick} />
      {count == 1 && <span>Jackpot!</span>}
      <p>{`Counter-5: ${count}`}</p>
    </div>
  );
};
