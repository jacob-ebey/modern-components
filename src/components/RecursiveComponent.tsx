import { createElement } from "../element";

import BasicDiv from "./BasicDiv";
import StyledDiv from "./StyledDiv";

export default function RecursiveComponent() {
  return (
    <div>
      <BasicDiv name="Recursive Things" />
      <StyledDiv />
    </div>
  );
}
