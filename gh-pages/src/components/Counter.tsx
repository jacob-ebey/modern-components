import { createElement, MCComponentMethods } from "modern-components";

export default function Counter({}, { useState }: MCComponentMethods) {
  const [count, setCount] = useState(0);

  const decrementCount = () => setCount(count - 1);
  const incrementCount = () => setCount(count + 1);
  const resetCount = () => setCount(0);

  return (
    <div>
      <p>Count: {count}</p>

      <div class="pure-button-group" role="group">
        <button
          class="pure-button pure-button-primary"
          onClick={decrementCount}
        >
          -
        </button>
        <button
          class="pure-button pure-button-primary"
          onClick={incrementCount}
        >
          +
        </button>
        <button class="pure-button pure-button-primary" onClick={resetCount}>
          Reset
        </button>
      </div>
    </div>
  );
}
