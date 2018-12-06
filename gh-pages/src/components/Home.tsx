import { createElement } from "modern-components";

import Counter from "./Counter";
import TSXCode from "./TSXCode";

const counterCode = require("!raw-loader!../../src/components/Counter.tsx"); // tslint:disable-line
const tsxCode = require("!raw-loader!../../src/components/TSXCode.tsx"); // tslint:disable-line

export default function Home() {
  return (
    <div>
      <div class="pure-g">
        <div class="pure-u-1 pure-u-md-1-3 padded-right">
          <section class="post">
            <header class="post-header">
              <h2 class="post-title">Declarative</h2>
            </header>

            <div class="post-description">
              <p>
                Modern Components makes it painless to create interactive UIs.
                Design simple views for each state in your application, and
                Modern Components will efficiently update and render just the
                right components when your data changes.
              </p>
              <p>
                Declarative views make your code more predictable and easier to
                debug.
              </p>
            </div>
          </section>
        </div>
        <div class="pure-u-1 pure-u-md-1-3 padded-right">
          <section class="post">
            <header class="post-header">
              <h2 class="post-title">Component-Based</h2>
            </header>

            <div class="post-description">
              <p>
                Build encapsulated components that manage their own state, then
                compose them to make complex UIs.
              </p>
              <p>
                Since component logic is written in JavaScript instead of
                templates, you can easily pass rich data through your app and
                keep state out of the DOM.
              </p>
            </div>
          </section>
        </div>
        <div class="pure-u-1 pure-u-md-1-3">
          <section class="post">
            <header class="post-header">
              <h2 class="post-title">Small &amp; Fast</h2>
            </header>

            <div class="post-description">
              <p>
                Supporting only functional components allows us to ship a much
                smaller code base that weighs in at 2.18KB gzipped (6.27KB
                uncompressed).
              </p>
              <p>
                Modern Components will also be able to render on the server
                using Node in the near future for the best user experience.
              </p>
            </div>
          </section>
        </div>
      </div>

      <section class="post">
        <header class="post-header">
          <h2 class="post-title">useState</h2>
        </header>

        <div class="post-description">
          <p>
            Like with the new&trade; React hooks API, useState returns a
            stateful value and a function to update it.
          </p>

          <p>
            The simple example that is always presented is a counter, so here ya
            go:
          </p>

          <Counter />
          <TSXCode code={counterCode} />
        </div>
      </section>

      <section class="post">
        <header class="post-header">
          <h2 class="post-title">useLayoutEffect / useRef</h2>
        </header>

        <div class="post-description">
          <p>
            Like with the new&trade; React hooks API, useLayoutEffect runs after
            the component has been mounted to the DOM. This is the perfect place
            to interface with 3rd party libraries such as a code highlighter.
            When the component has been mounted to the DOM, the current element
            will be set to the ref.
          </p>

          <p>The example code below is rendering itself.</p>
          <TSXCode code={tsxCode} />
        </div>
      </section>
    </div>
  );
}
