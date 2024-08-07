import _ from "lodash";
import { addDefault } from "@babel/helper-module-imports";
import { mapping } from "./mapping";
import { Package } from "./Package";
import { NodePath } from "@babel/traverse";

/*----------------------------------------------------------------------------*/

function resolvePath(pkgStore: Package, name: string, path: NodePath): string {
  let { base, id } = pkgStore;
  const lower = name.toLowerCase();
  const moduleCache = id ? mapping.modules.map.get(id) : undefined;

  if (!moduleCache) {
    throw path.buildCodeFrameError("module is not found");
  }

  const module = moduleCache.map.get(base);

  if (!module?.map.has(lower)) {
    base = base
      ? ""
      : moduleCache.findKey((mapCache) => mapCache.map.has(lower)) || "";

    if (!base) {
      throw path.buildCodeFrameError(
        [
          `The '${id}' method \`${name}\` is not a known module.`,
          "Please report bugs to https://github.com/lodash/babel-plugin-lodash/issues.",
        ].join("\n"),
      );
    }
  }

  return (
    id +
    "/" +
    (base ? base + "/" : "") +
    (moduleCache.map.get(base)?.map.get(lower) || "")
  );
}

function importModule(pkgStore: Package, name: string, path: NodePath) {
  return addDefault(path, resolvePath(pkgStore, name, path), {
    nameHint: name,
  });
}

export default _.memoize(importModule, (pkgStore, name) =>
  (pkgStore.path + "/" + name).toLowerCase(),
);
