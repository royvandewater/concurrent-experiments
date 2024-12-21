import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: [
      "jsdom-worker",
      "vitest-register-dom-matchers.js",
      "vitest-cleanup-after-each.js",
    ],
  },
});
