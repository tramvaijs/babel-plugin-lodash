"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.case3 = exports.case2 = exports.case1 = void 0;
var _kebabCase2 = _interopRequireDefault(require("lodash-compat/string/kebabCase"));
var _camelCase2 = _interopRequireDefault(require("lodash-compat/string/camelCase"));
var _string = require("string");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const case1 = exports.case1 = _camelCase2.default;
const case2 = exports.case2 = _kebabCase2.default;
const case3 = exports.case3 = _string.snakeCase;