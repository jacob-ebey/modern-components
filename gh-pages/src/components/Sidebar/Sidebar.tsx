import { createElement } from "modern-components";

import github from "./github.png";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <div class="sidebar pure-u-1 pure-u-md-1-4">
      <div class="header">
        <h2 class="brand-title">Modern Components</h2>
        <h3 class="brand-tagline">
          Tiny functional JavaScript components for the modern web
        </h3>

        <nav class="nav">
          <ul class="nav-list">
            <li class="nav-item">
              <a class="pure-button img-button" href="https://github.com/jacob-ebey/modern-components">
                <img class="button-img" src={github} />
                Github
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
