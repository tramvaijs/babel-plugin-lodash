import _snakeCase from "lodash/fp/snakeCase";
import _kebabCase from "lodash/fp/kebabCase";
import _camelCase from "lodash/fp/camelCase";
export const formatters = {
  camelCase: _camelCase,
  'kebabCase': _kebabCase,
  'snakeCase': _snakeCase
};