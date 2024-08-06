"use strict";

var _map2 = _interopRequireDefault(require("lodash/map"));
var _filter2 = _interopRequireDefault(require("lodash/filter"));
var _convert = _interopRequireDefault(require("lodash-fp/convert"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const fp = (0, _convert.default)({
  filter: _filter2.default,
  map: _map2.default
});