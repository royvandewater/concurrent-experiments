import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/preact";
import { html } from "htm/preact";

import { CustomSlider } from "./CustomSlider.js";

describe("CustomSlider", () => {
  describe("when rendered", () => {
    beforeEach(() => {
      render(html`<div><${CustomSlider} /></div>`);
    });

    it("renders a slider", () => {
      expect(screen.getByRole("slider")).toBeVisible();
    });
  });
});
