import _merge from "lodash/merge";
function foo(object) {
  return _merge(object, {
    'a': 1
  });
}