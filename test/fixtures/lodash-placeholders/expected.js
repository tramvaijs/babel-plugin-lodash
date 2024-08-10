import _bind from "lodash/bind";
import _partial from "lodash/fp/partial";
_bind(func, _bind.placeholder, 1);
_partial(func, _partial.placeholder, 1);