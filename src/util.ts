import { ImportDeclaration } from "@babel/types";

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

export function isTypeImport(
  importKind: ImportDeclaration["importKind"],
): boolean {
  return importKind === "type" || importKind === "typeof";
}
