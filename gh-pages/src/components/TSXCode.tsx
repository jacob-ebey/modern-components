import { createElement, MCComponentMethods } from "modern-components";
import * as Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/themes/prism.css";

export interface JSXCodeProps {
  code?: string;
}

export default function TSXCode(
  { code }: JSXCodeProps,
  { useLayoutEffect, useRef }: MCComponentMethods
) {
  const ref = useRef<HTMLElement>();
  useLayoutEffect(() => {
    if (ref.current) {
      Prism.highlightElement(ref.current);
    }
  });

  return (
    <pre>
      <code ref={ref} class="language-tsx">{code}</code>
    </pre>
  );
}
