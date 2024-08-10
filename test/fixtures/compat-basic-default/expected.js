import _reject from "lodash-compat/collection/reject";
import _take from "lodash-compat/array/take";
import _add from "lodash-compat/math/add";
import _map from "lodash-compat/collection/map";
const result = _map([], n => _add(1, n));
_take(_reject(result), 1);