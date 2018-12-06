export interface StateUpdate {
  index: number;
  value: any;
}

export type UseStateArr<T> = [T, (newValue: T) => void];
export type UseStateFunc = <T>(initialValue: T) => UseStateArr<T>;

export default function useState(
  element: any,
  scheduleUpdate: (stateNode: any, update: StateUpdate) => void
): UseStateFunc {
  let current = 0;

  return function<T>(initialValue: T) {
    const index = current++;
    let value = initialValue;

    if (element.states.length > index) {
      value = element.states[index];
    } else {
      element.states.push(initialValue);
    }

    return [
      value,
      newValue => {
        scheduleUpdate(element, { index, value: newValue });
      }
    ];
  };
}
