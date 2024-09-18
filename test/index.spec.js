import runner from "@babel/helper-plugin-test-runner/esm.mjs";
import { describe } from "@jest/globals";

// wrap in additional `describe` to run/debug tests in IDE
describe("tests", () => {
  runner(import.meta.url);
});
