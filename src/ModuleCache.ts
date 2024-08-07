import orderBy from "lodash/orderBy";
import fs from "fs";
import glob from "glob";
import { MapCache } from "./MapCache";
import { normalizePath } from "./util";
import path from "path";

/*----------------------------------------------------------------------------*/

export class ModuleCache {
  map = new Map<string, MapCache<string, string>>();

  constructor(moduleRoot: string) {
    const pkgPath = path.join(moduleRoot, "package.json");
    const pkgMain =
      (fs.existsSync(pkgPath) && require(pkgPath).main) || "index.js";
    const mainPath = normalizePath(
      path.dirname(path.resolve(moduleRoot, pkgMain)),
    );

    // Sort paths by the “main” entry first.
    const dirPaths = orderBy(
      glob.sync(path.join(moduleRoot, "**/"), {
        ignore: path.join(moduleRoot, "node_modules/**/"),
      }),
      (dirPath) => dirPath.startsWith(mainPath),
      ["desc"],
    );

    dirPaths.forEach((dirPath) => {
      const base = path.relative(moduleRoot, dirPath);
      const filePaths = glob.sync(path.join(dirPath, "*.js"));
      const pairs = filePaths.map((filePath) => {
        const name = path.basename(filePath, ".js");
        return [name.toLowerCase(), name] as const;
      });
      this.map.set(base, new MapCache(pairs));
    });
  }

  findKey(
    iteratee: (
      value: MapCache<string, string>,
      key: string,
      map: Map<string, MapCache<string, string>>,
    ) => boolean,
  ): string | undefined {
    for (let [key, value] of this.map.entries()) {
      if (iteratee(value, key, this.map)) {
        return key;
      }
    }

    return undefined;
  }
}
