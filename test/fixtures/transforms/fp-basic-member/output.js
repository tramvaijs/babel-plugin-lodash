import _take from "lodash/fp/take";
import _reject from "lodash/fp/reject";
import _map from "lodash/fp/map";
import _add from "lodash/fp/add";
const mapper = _map(_add(1));
const result = mapper([]);
_take(1, _reject(Boolean, result));