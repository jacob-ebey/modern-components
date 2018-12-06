import { createElement, createRenderer } from "modern-components";
import App from "./App";

it("renders without crashing", () => {
  const div = document.createElement("div");
  createRenderer().render(<App />, div);
});
