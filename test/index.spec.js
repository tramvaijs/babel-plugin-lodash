import fs from "fs";
import glob from "glob";
import path from "path";
import plugin from "../src/index";
import { transformFileSync } from "@babel/core";

function getLodashId(testPath) {
  const postfix = /\b(?:compat|es)\b/.exec(testPath);
  return "lodash" + (postfix ? "-" + postfix : "");
}

function getTestName(testPath) {
  return path.basename(testPath).split("-").join(" ");
}

/*----------------------------------------------------------------------------*/

describe("cherry-picked modular builds", function () {
  describe("fixtures", () => {
    const cases = glob
      .sync(path.join(__dirname, "fixtures/*/"))
      .map((path) => [path]);

    test.each(cases)("should work with %s", (testPath) => {
      const testName = getTestName(testPath);
      const lodashId = getLodashId(testName);
      const actualPath = path.join(testPath, "actual.js");
      const expectedPath = path.join(testPath, "expected.js");

      // ------------------

      const expected = fs.readFileSync(expectedPath, "utf8");
      const actual = transformFileSync(actualPath, {
        plugins: [[plugin, { id: [lodashId, "@storybook/addon-links"] }]],
      }).code;

      expect(actual).toStrictEqual(expected);
    });
  });
});
