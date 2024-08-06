"use strict";

var _take2 = _interopRequireDefault(require("lodash/fp/take"));
var _reject2 = _interopRequireDefault(require("lodash/fp/reject"));
var _map2 = _interopRequireDefault(require("lodash/fp/map"));
var _add2 = _interopRequireDefault(require("lodash/fp/add"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const mapper = (0, _map2.default)((0, _add2.default)(1));
const result = mapper([]);
(0, _take2.default)(1, (0, _reject2.default)(Boolean, result));