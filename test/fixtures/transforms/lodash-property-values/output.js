import _snakeCase from "lodash/snakeCase";
import _kebabCase from "lodash/kebabCase";
import _camelCase from "lodash/camelCase";
export const formatters = {
  camelCase: _camelCase,
  'kebabCase': _kebabCase,
  'snakeCase': _snakeCase
};