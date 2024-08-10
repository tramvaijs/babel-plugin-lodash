import _reject from "lodash-es/reject";
import _add from "lodash-es/add";
import _take from "lodash-es/take";
import _map from "lodash-es/map";
const result = _map([], n => _add(1, n));
_take(_reject(result), 1);