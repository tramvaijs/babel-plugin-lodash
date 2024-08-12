import _reject from "lodash/fp/reject";
import _take from "lodash/fp/take";
import _add from "lodash/fp/add";
import _map from "lodash/fp/map";
const mapper = _map(_add(1));
const result = mapper([]);
_take(1, _reject(Boolean, result));