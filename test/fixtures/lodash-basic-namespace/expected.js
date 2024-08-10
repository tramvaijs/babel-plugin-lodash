import _reject from "lodash/reject";
import _take from "lodash/take";
import _add from "lodash/add";
import _map from "lodash/map";
const result = _map([], n => _add(1, n));
_take(_reject(result), 1);