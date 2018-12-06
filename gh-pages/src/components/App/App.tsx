import { createElement } from "modern-components";

import Home from "../Home";
import Sidebar from "../Sidebar/Sidebar";
import "./App.css";

export default function App() {
  return (
    <div class="app pure-g">
      <Sidebar />
      <div class="content pure-u-1 pure-u-md-3-4">
        <Home />
      </div>
    </div>
  );
}
