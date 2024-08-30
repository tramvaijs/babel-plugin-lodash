import type { ImportDeclaration } from "@babel/types";
import type * as t from "@babel/types";

import type { Specifier } from "./types";
import { checkExhaustiveness, getValue } from "./utils";

export function getImportSpecifiers(
  types: typeof t,
  node: ImportDeclaration,
): Specifier[] {
  const specifiers: Specifier[] = [];

  for (const specifier of node.specifiers) {
    if (types.isImportDefaultSpecifier(specifier)) {
      specifiers.push({
        kind: "default",
        local: specifier.local.name,
      });
      continue;
    }

    if (types.isImportSpecifier(specifier)) {
      const importedNode = specifier.imported;
      const importedName = getValue(importedNode);
      specifiers.push({
        kind: "named",
        imported: importedName,
        local: specifier.local.name,
      });
      continue;
    }

    if (types.isImportNamespaceSpecifier(specifier)) {
      specifiers.push({
        kind: "namespace",
        local: specifier.local.name,
      });
    } else {
      checkExhaustiveness(specifier);
    }
  }

  return specifiers;
}
