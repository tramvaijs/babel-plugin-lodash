import { describe, expect, it } from "@jest/globals";
import { isLodashSource } from "../utils";

describe("utils", () => {
  describe("isLodashImport", () => {
    it.each([
      "lodash",
      "lodash/isObject",
      "lodash/fp",
      "lodash/fp/curry",
      "lodash-es",
      "lodash-es/isObject",
    ])("should return true if it is lodash import", (source) => {
      expect(isLodashSource(source)).toBe(true);
    });
    it.each([
      "webpack",
      "core-js",
      "react/dom",
      "lodash.round",
      "lodash.debounce",
      "@storybook/react",
    ])("should return false if it is not lodash import", (source) => {
      expect(isLodashSource(source)).toBe(false);
    });
  });
});
