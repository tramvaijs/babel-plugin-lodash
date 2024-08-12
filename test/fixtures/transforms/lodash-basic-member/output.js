import _take from "lodash/take";
import _reject from "lodash/reject";
import _map from "lodash/map";
import _add from "lodash/add";
const result = _map([], n => _add(1, n));
_take(_reject(result), 1);