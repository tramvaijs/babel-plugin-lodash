const lodashEsRegex = /^lodash-es(\/[a-zA-Z]+)?$/;
const lodashRegex = /^lodash((\/fp)?(\/[a-zA-Z]+)?)?$/;

const importCache = new Set<string>();

export function isLodashSource(source: string): boolean {
  if (importCache.has(source)) return true;

  const isLodash = lodashRegex.test(source) || lodashEsRegex.test(source);

  if (isLodash) {
    importCache.add(source);
  }

  return isLodash;
}

export function shouldTransformImport(source: string): boolean {
  return ["lodash", "lodash-es", "lodash/fp"].includes(source);
}

export function createDefaultImportSource(
  source: string,
  functionName: string,
): string {
  return `${source}/${functionName}`;
}

/**
 * `importKind` was introduced to distinguish type-only imports in Typescript and Flow
 * from common value imports.
 *
 * "type" - TS type import
 * "typeof" - Flow type import
 * "value" - value import in TS/Flow
 * null/undefined - value import in JS
 */
type ImportKind = "value" | "type" | "typeof" | null | undefined;

export function isTypeOnlyImport(importKind: ImportKind): boolean {
  return importKind === "type" || importKind === "typeof";
}
