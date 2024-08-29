import type * as t from "@babel/types";
import type { Identifier } from "@babel/types";
import type { PluginObj, PluginPass } from "@babel/core";

import { getValue, isTypeOnlyImport, shouldTransformImport } from "./utils";
import { getImportSpecifiers } from "./get-import-specifiers";
import { ImportManager } from "./import-manager";

/** The error message used when chain sequences are detected. */
const CHAIN_ERROR = [
  "Lodash chain sequences are not supported by babel-plugin-transform-lodash-import.",
  "Consider substituting chain sequences with composition patterns.",
  "See https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba",
].join("\n");

type PluginOptions = { ensureModuleExists?: boolean };

interface State extends PluginPass {
  opts: PluginOptions;
  importManager: ImportManager;
}

export default function transformLodashImportsPlugin({
  types,
}: {
  types: typeof t;
}): PluginObj<State> {
  return {
    pre() {
      this.importManager = new ImportManager({
        ensureModuleExists: Boolean(this.opts.ensureModuleExists),
        filename: this.filename || this.cwd,
      });
    },
    post() {
      this.importManager.reset();
    },
    visitor: {
      ImportDeclaration(path, state) {
        const source = path.node.source.value;

        if (
          !shouldTransformImport(source) ||
          isTypeOnlyImport(path.node.importKind)
        )
          return;

        const specifiers = getImportSpecifiers(types, path.node);

        // TODO: add test for type imports
        specifiers.forEach((specifier) => {
          const binding = path.scope.getBinding(specifier.local);
          if (!binding) return;

          const importNode = binding.path.parent;
          if (
            !types.isImportDeclaration(importNode) ||
            isTypeOnlyImport(importNode.importKind)
          )
            return;

          binding.referencePaths.forEach((refPath) => {
            const { parentPath, parent } = refPath;

            /**
             * Handle named import
             * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#named_import
             *
             * before:
             * import { round } from 'lodash';
             * round(1.005, 2);
             *
             * after:
             * import _round from 'lodash/round';
             * _round(1.005, 2);
             */
            if (specifier.kind === "named") {
              if (specifier.imported === "chain") {
                throw refPath.buildCodeFrameError(CHAIN_ERROR);
              }

              const result = state.importManager.addDefaultImport({
                referenceNodePath: refPath,
                importSource: source,
                functionName: specifier.imported,
                importedName: specifier.imported,
              });

              refPath.replaceWith(types.cloneNode(result));
              return;
            }

            /**
             * #1: Handle default import
             * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#default_import
             *
             * before:
             * import _ from 'lodash';
             * _.round(1.005, 2);
             *
             * after:
             * import _round from 'lodash/round';
             * _round(1.005, 2);
             *
             * #2: Handle namespace import
             * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#namespace_import
             *
             * before:
             * import * as _ from 'lodash';
             * _.round(1.005, 2);
             *
             * after:
             * import _round from 'lodash/round';
             * _round(1.005, 2);
             */
            if (
              parentPath &&
              types.isMemberExpression(parent) &&
              (types.isIdentifier(parent.property) ||
                types.isStringLiteral(parent.property))
            ) {
              const key = getValue(parent.property);

              if (key === "chain") {
                throw refPath.buildCodeFrameError(CHAIN_ERROR);
              }

              const result = state.importManager.addDefaultImport({
                referenceNodePath: refPath,
                importSource: source,
                functionName: key,
                importedName: key,
              });

              parentPath.replaceWith(types.cloneNode(result));
              return;
            }

            throw refPath.buildCodeFrameError(
              "Using default import for lodash, all lodash functions will be included into your bundle.",
            );
          });
        });

        /** Remove processed import */
        path.remove();
      },
      ExportNamedDeclaration(path, state) {
        const { node } = path;
        const exportSource = node.source?.value;

        if (!exportSource || !shouldTransformImport(exportSource)) return;

        node.source = null;
        node.specifiers.forEach((spec) => {
          if (types.isExportSpecifier(spec)) {
            const { exported } = spec;
            const importedName = getValue(exported);

            spec.local = state.importManager.addDefaultImport({
              referenceNodePath: path,
              importSource: exportSource,
              functionName: spec.local.name,
              importedName,
            }) as Identifier;
          } else {
            path.buildCodeFrameError(
              `You're trying to export entire '${exportSource}', so all its functions will be included to bundle`,
            );
          }
        });
      },
    },
  };
}
