import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/preact";
import { html } from "htm/preact";
import "jsdom-worker";

import { App } from "./App.js";

describe("App", () => {
  let workerUrl;

  beforeEach(() => {
    // let code = `onmessage = e => postMessage(e.data*2)`;
    let code = `onmessage = e => {}`;
    workerUrl = URL.createObjectURL(new Blob([code]));
    // new Worker(workerUrl);
  });

  describe("when rendered", () => {
    beforeEach(() => {
      render(html`<${App} workerUrl="${workerUrl}" />`);
    });

    it("renders a Run button", () => {
      expect(screen.getByText("Run")).toBeVisible();
    });
  });
});
