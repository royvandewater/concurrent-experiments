import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/preact";
import { html } from "htm/preact";

import { App } from "./App.js";

describe("App", () => {
  describe("when rendered", () => {
    beforeEach(() => {
      render(html`<${App} />`);
    });

    it("renders a Run button", () => {
      expect(screen.getByText("Run")).toBeVisible();
    });
  });
});
