import { createElement, MCComponentMethods } from "../element";

export default function WithState({}, { useState }: MCComponentMethods) {
  const [value, setValue] = useState("initialValue");

  const onChange = (event: any) => setValue(event.target.value);

  return <input value={value} onChange={onChange} />;
}
