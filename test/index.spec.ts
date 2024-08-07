import fs from "fs";
import {sync} from "glob";
import path from "path";
import plugin from "../src/index";
import { transformFileSync } from "@babel/core";
import { describe, expect, test } from "@jest/globals";

function getLodashId(testPath: string) {
  const postfix = /\b(?:compat|es)\b/.exec(testPath);
  return "lodash" + (postfix ? "-" + postfix : "");
}

function getTestName(testPath: string) {
  return path.basename(testPath).replaceAll("-", " ");
}

function getActualPath(testPath: string) {
  return path.join(testPath, 'actual.js');
}

function getExpectedPath(testPath: string) {
  return path.join(testPath, 'expected.js');
}

function getCases(filesGlob: string) {
  return sync(path.join(__dirname, filesGlob)).filter((filePath) => filePath.includes('/lodash'))
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
      })?.code;

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
      })?.code

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
