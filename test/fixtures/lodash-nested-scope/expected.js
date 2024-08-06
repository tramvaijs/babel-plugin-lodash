"use strict";

var _merge2 = _interopRequireDefault(require("lodash/merge"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function foo(object) {
  return (0, _merge2.default)(object, {
    'a': 1
  });
}