import { render } from "preact";
import { html } from "htm/preact";

import { App } from "./App.js";

render(
  html`<${App} workerUrl="./src/experiment-worker.js" />`,
  document.getElementById("app")
);
