import _map from "lodash/fp/map";
import _head from "lodash/fp/head";
import _compose from "lodash/fp/compose";
import _capitalize from "lodash/fp/capitalize";
_compose(_map(_capitalize), _head)([]);