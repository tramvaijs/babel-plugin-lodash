import _partial from "lodash/fp/partial";
import _toUpper from "lodash/toUpper";
import _round from "lodash/round";
import _isString from "lodash/isString";
import _isNumber from "lodash/isNumber";
import _cond from "lodash/cond";
_cond([[_isNumber, _round], [_isString, _toUpper]])(1.8);
_partial(func)([_partial.placeholder, 2])(1);