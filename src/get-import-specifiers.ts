import type {
  ExportNamedDeclaration,
  ExportAllDeclaration,
  ImportDeclaration,
} from "@babel/types";
import type * as t from "@babel/types";

import type { Specifier } from "./types";

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
    }

    if (types.isImportSpecifier(specifier)) {
      const importedNode = specifier.imported;
      const importedName = types.isIdentifier(importedNode)
        ? importedNode.name
        : importedNode.value;
      specifiers.push({
        kind: "named",
        imported: importedName,
        local: specifier.local.name,
      });
    }

    if (types.isImportNamespaceSpecifier(specifier)) {
      specifiers.push({
        kind: "namespace",
        local: specifier.local.name,
      });
    }
  }

  return specifiers;
}

// export function getExportSpecifiers(
//   types: typeof t,
//   node: ExportNamedDeclaration | ExportAllDeclaration,
// ): Specifier[] {
//   const specifiers: Specifier[] = [];
//
//   if (types.isExportAllDeclaration(node)) {
//     specifiers.push({
//       kind: "namespace",
//       local: "*",
//     });
//
//     return specifiers;
//   }
//
//   for (const specifier of node.specifiers) {
//     if (types.isExportDefaultSpecifier(specifier)) {
//       specifiers.push({
//         kind: "default",
//         local: specifier.exported.name,
//       });
//     }
//
//     if (types.isExportSpecifier(specifier)) {
//       const importedNode = specifier.exported;
//       const exportedName = types.isIdentifier(importedNode)
//         ? importedNode.name
//         : importedNode.value;
//       specifiers.push({
//         kind: "named",
//         imported: importedName,
//         local: exportedName,specifier.local.name,
//       });
//     }
//
//     if (types.isExportNamespaceSpecifier(specifier)) {
//       specifiers.push({
//         kind: "namespace",
//         local: specifier.local.name,
//       });
//     }
//   }
//
//   return specifiers;
// }
