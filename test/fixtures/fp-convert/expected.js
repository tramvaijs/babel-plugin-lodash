import _map from "lodash/map";
import _filter from "lodash/filter";
import convert from 'lodash-fp/convert';
const fp = convert({
  filter: _filter,
  map: _map
});