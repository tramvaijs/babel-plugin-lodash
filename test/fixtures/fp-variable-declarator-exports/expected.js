import _kebabCase from "lodash/fp/kebabCase";
import _camelCase from "lodash/fp/camelCase";
import { snakeCase } from 'string';
export const case1 = _camelCase;
export const case2 = _kebabCase;
export const case3 = snakeCase;