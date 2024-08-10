import _take from "lodash-compat/array/take";
import _reject from "lodash-compat/collection/reject";
import _map from "lodash-compat/collection/map";
import _add from "lodash-compat/math/add";
const result = _map([], n => _add(1, n));
_take(_reject(result), 1);