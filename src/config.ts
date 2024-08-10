import { MapCache } from "./MapCache";
import { ModuleCache } from "./ModuleCache";
import { resolveModule } from "./util";

const defaultIds = ["lodash", "lodash-es"];

let oldCwd: string;
const ids: string[] = [];
const modules = new MapCache<string, ModuleCache>();

/*----------------------------------------------------------------------------*/

export interface PluginOptions {
  id?: string | string[];
  cwd?: string;
}

export function config(params: PluginOptions = {}) {
  const cwd = params.cwd || process.cwd();
  const id = params.id || defaultIds;

  if (oldCwd !== cwd) {
    oldCwd = cwd;
    modules.map.clear();
  }

  const idArray = Array.isArray(id) ? id : [id];

  idArray.forEach((id) => {
    if (modules.map.has(id)) return;

    const moduleRoot = resolveModule(id);

    if (moduleRoot) {
      ids.push(id);
      modules.map.set(id, new ModuleCache(moduleRoot));
    }
  });

  return { ids, modules };
}
