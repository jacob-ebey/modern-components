//@ts-ignore
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

import createRenderer from "./renderer";

export {
  MCComponent,
  MCComponentMethods,
  MCElement,
  createElement,
  createTextElement
} from "./element";
export { UseLayoutEffectFunc, UseLayoutCallbackFunc } from "./useLayoutEffect";
export { Ref, UseRefFunc } from "./useRef";
export { UseStateArr, UseStateFunc } from "./useState";

export { createRenderer };
