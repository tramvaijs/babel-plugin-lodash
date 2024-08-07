import _ from "lodash";
import { extractPackageName } from "./util";

const reLodash = /^lodash(?:-compat|-es)?$/;

/*----------------------------------------------------------------------------*/

export class Package {
  base: string;
  id: string | null;
  isLodash: () => boolean;
  path: string;

  constructor(pkgPath: string) {
    pkgPath = _.toString(pkgPath);
    const pkgName = extractPackageName(pkgPath);

    this.base = pkgPath.replace(new RegExp(pkgName + "/?"), "");
    this.id = pkgName;
    this.isLodash = _.constant(reLodash.test(this.id || ""));
    this.path = pkgPath;
  }
}
