import _ from "lodash";

/*----------------------------------------------------------------------------*/

/**
 * Normalizes `pkgPath` by converting path separators to forward slashes.
 *
 * @static
 * @memberOf util
 * @param {string} [pkgPath=''] The package path to normalize.
 * @returns {string} Returns the normalized package path.
 */
export function normalizePath(pkgPath: string) {
  return _.toString(pkgPath).replace(/\\/g, "/");
}

const scopePattern = /^(?:(@[^/]+)[/]+)([^/]+)[/]?/;
const basePattern = /^([^/]+)[/]?/;

export function extractPackageName(str: string, isBase = false): string | null {
  if (/^@/.test(str)) {
    var match = scopePattern.exec(str);
    if (!match || !match[1] || !match[2]) return null;
    if (isBase) return match[2] || null;

    return [match[1], match[2]].join("/");
  } else {
    var match = basePattern.exec(str);
    if (!match) return null;
    return match[1] || null;
  }
}

export function resolveModule(module: string): string | null {
  try {
    return require.resolve(module);
  } catch (e) {
    return null;
  }
}
