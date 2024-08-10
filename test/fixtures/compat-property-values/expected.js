import _snakeCase from "lodash-compat/string/snakeCase";
import _kebabCase from "lodash-compat/string/kebabCase";
import _camelCase from "lodash-compat/string/camelCase";
export const formatters = {
  camelCase: _camelCase,
  'kebabCase': _kebabCase,
  'snakeCase': _snakeCase
};