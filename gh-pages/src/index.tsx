import { createElement, createRenderer } from "modern-components";

import App from "./components/App/App";
import "./index.css";

createRenderer().render(<App />, document.body);
