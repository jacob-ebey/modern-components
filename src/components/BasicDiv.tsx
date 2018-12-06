import { createElement } from "../element";

export interface BasicDivProps {
  name?: string;
}

export default function BasicDiv({ name }: BasicDivProps) {  
  return <div>Hello {name || "World"}!</div>;
}
