"use strict";

var _partial2 = _interopRequireDefault(require("lodash/fp/partial"));
var _toUpper2 = _interopRequireDefault(require("lodash/toUpper"));
var _round2 = _interopRequireDefault(require("lodash/round"));
var _isString2 = _interopRequireDefault(require("lodash/isString"));
var _isNumber2 = _interopRequireDefault(require("lodash/isNumber"));
var _cond2 = _interopRequireDefault(require("lodash/cond"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
(0, _cond2.default)([[_isNumber2.default, _round2.default], [_isString2.default, _toUpper2.default]])(1.8);
(0, _partial2.default)(func)([_partial.placeholder, 2])(1);