import { UseLayoutEffectFunc } from "./useLayoutEffect";
import { UseRefFunc } from "./useRef";
import { UseStateFunc } from "./useState";

export const TEXT_ELEMENT = "TEXT_ELEMENT";

export type MCDOMChild =
  | MCComponent
  | string
  | number
  | boolean
  | null
  | undefined;

export type MCDOMChildren = MCDOMChild | MCDOMChild[];

export interface MCComponentMethods {
  useLayoutEffect: UseLayoutEffectFunc;
  useRef: UseRefFunc;
  useState: UseStateFunc;
}

export type MCComponent<TProps = {}> = (
  props: TProps,
  methods: MCComponentMethods
) => MCElement;

export interface MCElement<TProps = {}> {
  type: string | MCComponent<TProps>;
  props: TProps;
}

export function createElement<TProps extends {} = {}>(
  type: string | MCComponent,
  config: TProps,
  ...params: any[]
): MCElement<TProps> {
  const props: any = Object.assign({}, config);
  const hasChildren = params.length > 0;
  const rawChildren = hasChildren ? [].concat(...params) : [];
  props.children = rawChildren
    .filter(c => c != null && c !== false)
    .map((c: any) => (c instanceof Object ? c : createTextElement(c)));
  return { type, props };
}

export function createTextElement(value: string) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}

export interface MCInstance {
  render: MCComponent;
  states: any[];
  refs: any[];
}

export function createInstance(fiber: any) {
  return {
    render: fiber.type,
    layoutEffects: [],
    states: [],
    refs: []
  };
}
