import fs from "fs";
import glob from "glob";
import path from "path";
import plugin from "../src/index";
import { transformFileSync } from "@babel/core";
import _ from "lodash";

function getLodashId(testPath) {
  const postfix = /\b(?:compat|es)\b/.exec(testPath);
  return "lodash" + (postfix ? "-" + postfix : "");
}

function getTestName(testPath) {
  return path.basename(testPath).replaceAll("-", " ");
}

function getActualPath(testPath) {
  return path.join(testPath, 'actual.js');
}

function getExpectedPath(testPath) {
  return path.join(testPath, 'expected.js');
}

function getCases(filesGlob) {
  return glob
      .sync(path.join(__dirname, filesGlob))
      .map((testPath) => [getTestName(testPath), testPath]);
}

/*----------------------------------------------------------------------------*/

describe("cherry-picked modular builds", function () {
  describe("fixtures", () => {
    const cases = getCases("fixtures/*/")

    test.each(cases)("should work with %s", (testName, testPath) => {
      const lodashId = getLodashId(testName);
      const actualPath = getActualPath(testPath)
      const expectedPath = getExpectedPath(testPath);

      // ------------------

      const expected = fs.readFileSync(expectedPath, "utf8");
      const actual = transformFileSync(actualPath, {
        plugins: [[plugin, { id: [lodashId, "@storybook/addon-links"] }]],
      }).code;

      expect(actual).toStrictEqual(expected);
    });
  });

  describe("error-fixtures", () => {
    const cases = getCases("error-fixtures/*/")

    test.each(cases)("should throw an error with %s", (testName, testPath) => {
      const actualPath = getActualPath(testPath)

      const transform = () =>
        transformFileSync(actualPath, { plugins: [plugin] });

      expect(transform).toThrow();
    });
  });

  describe("mixed-fixtures", () => {
    const cases = getCases("mixed-fixtures/*/")

    test.each(cases)("should work with %s", (testName, testPath) => {
      const actualPath = getActualPath(testPath)
      const expectedPath = getExpectedPath(testPath);
      const optionsPath = path.join(testPath, 'options.json')
      const options = fs.existsSync(optionsPath) ? require(optionsPath) : {}

      // ------------------

      const expected = fs.readFileSync(expectedPath, 'utf8')
      const actual = transformFileSync(actualPath, {
        'plugins': [[plugin, options]]
      }).code

      expect(actual).toStrictEqual(expected);
    });
  });

  describe("parsing-fixtures", () => {
    const cases = getCases("parsing-fixtures/*/")

    test.each(cases)("should not error with %s", (testName, testPath) => {
      const actualPath = getActualPath(testPath)

      const transform = () =>
          transformFileSync(actualPath, { plugins: [plugin] });

      expect(transform).not.toThrow();
    });
  });
});
