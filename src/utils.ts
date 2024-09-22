import { Identifier, StringLiteral } from "@babel/types";

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

export function getValue(node: Identifier | StringLiteral) {
  return node.type === "Identifier" ? node.name : node.value;
}

export function checkExhaustiveness(value: never) {}

export function getEntirePackageExportError(source: string): string {
  return `You're trying to export entire '${source}', so all its functions will be included to bundle`;
}
