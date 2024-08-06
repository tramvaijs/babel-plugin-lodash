"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatters = void 0;
var _snakeCase2 = _interopRequireDefault(require("lodash-es/snakeCase"));
var _kebabCase2 = _interopRequireDefault(require("lodash-es/kebabCase"));
var _camelCase2 = _interopRequireDefault(require("lodash-es/camelCase"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const formatters = exports.formatters = {
  camelCase: _camelCase2.default,
  'kebabCase': _kebabCase2.default,
  'snakeCase': _snakeCase2.default
};