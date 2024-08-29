import _take from "lodash/fp/take";
import _map from "lodash/fp/map";
import _reject from "lodash/fp/reject";
import _add from "lodash/fp/add";
const mapper = _map(_add(1));
const result = mapper([1, 2, 3]);
_take(1, _reject(Boolean, result));
