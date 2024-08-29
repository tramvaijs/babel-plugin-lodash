import _kebabCase from "lodash/fp/kebabCase";
import _camelCase from "lodash/fp/camelCase";
import _snakeCase from "lodash/fp/snakeCase";
export const formatters = {
  camelCase: _camelCase,
  'kebabCase': _kebabCase,
  'snakeCase': _snakeCase
};
