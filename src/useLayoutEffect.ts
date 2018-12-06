export type UseLayoutCallbackFunc = () => void;
export type UseLayoutEffectFunc = (callback: UseLayoutCallbackFunc) => void;

export default function useLayoutEffect(
  element: any
): UseLayoutEffectFunc {
  let current = 0;

  return function(callback: UseLayoutCallbackFunc) {
    const index = current++;

    if (element.layoutEffects.length > index) {
      element.layoutEffects[index] = callback;
    } else {
      element.layoutEffects.push(callback);
    }
  };
}
