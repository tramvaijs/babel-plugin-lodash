// @ts-nocheck
import _ from "lodash";
import { isImportOrExportDeclaration } from "@babel/types";
import * as t from "@babel/types";

import { config, PluginOptions } from "./config";
import importModule from "./importModule";
import { mapping } from "./mapping";
import { Store } from "./Store";
import { Visitor } from "@babel/core";

/** The error message used when chain sequences are detected. */
const CHAIN_ERROR = [
  "Lodash chain sequences are not supported by babel-plugin-lodash.",
  "Consider substituting chain sequences with composition patterns.",
  "See https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba",
].join("\n");

/*----------------------------------------------------------------------------*/

interface Specifier {
  kind: "named" | "namespace";
  imported?: string;
  local: string;
}

function getSpecifiers(node: t.ImportDeclaration): {
  specifiers: Specifier[];
  imported: string[];
} {
  const imported: string[] = [];

  for (const specifier of node.specifiers) {
    if (t.isImportDefaultSpecifier(specifier)) {
      imported.push("default");
      specifiers.push({
        kind: "named",
        imported: "default",
        local: specifier.local.name,
      });
    }

    if (t.isImportSpecifier(specifier)) {
      const importedNode = specifier.imported;
      const importedName = t.isIdentifier(importedNode)
        ? importedNode.name
        : importedNode.value;
      imported.push(importedName);
      specifiers.push({
        kind: "named",
        imported: importedName,
        local: specifier.local.name,
      });
    }

    if (t.isImportNamespaceSpecifier(specifier)) {
      imported.push("*");
      specifiers.push({
        kind: "namespace",
        local: specifier.local.name,
      });
    }
  }

  return { specifiers, imported };
}

export default function lodash({ types }: { types: typeof t }) {
  const identifiers = {
    PLACEHOLDER: types.identifier("placeholder"),
    UNDEFINED: types.identifier("undefined"),
  };

  /**
   * Used to track variables built during the AST pass. We instantiate these in
   * the `Program` visitor in order to support running the plugin in watch mode
   * or on multiple files.
   *
   * @type Store
   */
  const store = new Store();

  function getCallee({ parentPath }) {
    // Trace curried calls to their origin, e.g. `fp.partial(func)([fp, 2])(1)`.
    while (!parentPath.isStatement()) {
      if (parentPath.isCallExpression()) {
        let result = parentPath.node.callee;

        while (types.isCallExpression(result)) {
          result = result.callee;
        }

        return result;
      }

      parentPath = parentPath.parentPath;
    }
  }

  /*--------------------------------------------------------------------------*/

  type State = { opts: PluginOptions };

  const visitor: Visitor<State> = {
    Program(path, state) {
      // const { ids } = _.assign(mapping, config(state.opts));
      // const { file } = path.hub;
      //
      // // Clear tracked method imports.
      // importModule.cache.clear();
      // store.clear();
      //
      // // Populate module paths per package.
      // _.each(ids, (id) => {
      //   store.set(id);
      //   mapping.modules.get(id).forEach((value, key) => {
      //     store.set(id + "/" + key);
      //   });
      // });

      const imports: {
        source: string;
        imported: string[];
        specifiers: Specifier[];
      }[] = [];

      const hasImports = path.node.body.some((node) =>
        isImportOrExportDeclaration(node),
      );

      if (hasImports) {
        /**
         * Find all imports
         */
        path.traverse({
          ImportDeclaration: {
            exit(path) {
              const { specifiers, imported } = getSpecifiers(path.node);

              imports.push({
                source: path.node.source.value,
                imported,
                specifiers,
              });
            },
          },
        });
      }

      console.log("done");

      // Replace old members with their method imports.
      imports.forEach((module) => {
        const pkgStore = store.get(module.source);
        if (!pkgStore) {
          return;
        }
        const isLodash = pkgStore.isLodash();
        const specs = _.sortBy(
          module.specifiers,
          (spec) => spec.imported === "default",
        );

        specs.forEach((spec) => {
          const { imported, local } = spec;
          const binding = path.scope.getBinding(local);
          const { importKind = "value" } = binding.path.parent;

          // Skip type annotation imports.
          if (importKind != "value") {
            return;
          }

          const isChain = isLodash && imported === "chain";

          _.each(binding.referencePaths, (refPath) => {
            const { node, parentPath } = refPath;
            const { type } = node;

            if (imported && imported !== "default") {
              if (isChain && refPath.parentPath.isCallExpression()) {
                throw refPath.buildCodeFrameError(CHAIN_ERROR);
              }
              const { name } = importModule(pkgStore, imported, refPath);
              refPath.replaceWith({ type, name });
            } else if (parentPath.isMemberExpression()) {
              const key = refPath.parent.property.name;

              if (
                isLodash &&
                key === "chain" &&
                parentPath.parentPath.isCallExpression()
              ) {
                throw refPath.buildCodeFrameError(CHAIN_ERROR);
              }

              const { name } = importModule(pkgStore, key, refPath);
              parentPath.replaceWith({ type, name });
            } else if (isLodash) {
              const callee = getCallee(refPath);
              if (callee && callee.name === local) {
                throw refPath.buildCodeFrameError(CHAIN_ERROR);
              }
              refPath.replaceWith(
                callee
                  ? types.memberExpression(callee, identifiers.PLACEHOLDER)
                  : identifiers.UNDEFINED,
              );
            }
          });
        });
      });
    },

    ImportDeclaration(path) {
      // if (store.get(path.node.source.value)) {
      //   // Remove old import.
      //   path.remove();
      // }
    },

    ExportNamedDeclaration(path) {
      // const { node } = path;
      // const pkgPath = _.get(node, "source.value");
      // const pkgStore = store.get(pkgPath);
      //
      // if (!pkgStore) {
      //   return;
      // }
      //
      // node.source = null;
      // _.each(node.specifiers, (spec) => {
      //   spec.local = importModule(pkgStore, spec.local.name, path);
      // });
    },
  };

  return { visitor };
}
