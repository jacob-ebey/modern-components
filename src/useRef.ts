export interface Ref<T = any> {
  current?: T;
}
export type UseRefFunc = <T>() => Ref<T>;

export default function useRef(element: any): UseRefFunc {
  let current = 0;

  return function<T>(): Ref<T> {
    const index = current++;

    let ref: Ref<T> = {
      current: undefined
    };

    if (element.refs.length > index) {
      ref = element.refs[index];
    } else {
      element.refs.push(ref);
    }

    return ref;
  };
}
