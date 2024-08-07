import { normalizePath } from "./util";
import { Package } from "./Package";

export class Store {
  private map = new Map<string, Package>();

  clear() {
    this.map.clear();
  }

  get(pkgPath: string): Package | undefined {
    return this.map.get(normalizePath(pkgPath));
  }

  set(pkgPath: string, pkgStore?: Package) {
    this.map.set(
      normalizePath(pkgPath),
      pkgStore || new Package(normalizePath(pkgPath)),
    );
  }
}
