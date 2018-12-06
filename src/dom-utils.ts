import { TEXT_ELEMENT } from "./element";

export function createDomElement(fiber: any) {
  const isTextElement = fiber.type === TEXT_ELEMENT;
  const dom = isTextElement
    ? document.createTextNode("")
    : document.createElement(fiber.type);
  updateDomProperties(dom, [], fiber.props);
  return dom;
}

const isEvent = (name: string) => name.startsWith("on");
const isAttribute = (name: string) =>
  !isEvent(name) && name != "children" && name != "style";
const isNew = (prev: any, next: any) => (key: string) =>
  prev[key] !== next[key];
const isGone = (_: any, next: any) => (key: string) => !(key in next);

export function updateDomProperties(dom: any, prevProps: any, newProps: any) {
  if (typeof dom.setAttribute !== "function") {
    dom.textContent = newProps.nodeValue;
    return;
  }

  const { ref, ...nextProps } = newProps;
  if (ref) {
    ref.current = dom;
  }

  // Remove event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Remove attributes
  Object.keys(prevProps)
    .filter(isAttribute)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom.removeAttribute(name);
    });

  // Set attributes
  Object.keys(nextProps)
    .filter(isAttribute)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom.setAttribute(name, nextProps[name]);
    });

  // Set style
  prevProps.style = prevProps.style || {};
  nextProps.style = nextProps.style || {};
  Object.keys(nextProps.style)
    .filter(isNew(prevProps.style, nextProps.style))
    .forEach(key => {
      dom.style[key] = nextProps.style[key];
    });
  Object.keys(prevProps.style)
    .filter(isGone(prevProps.style, nextProps.style))
    .forEach(key => {
      dom.style[key] = "";
    });

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}
