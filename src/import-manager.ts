import { createRequire } from "node:module";
import type {
  Identifier,
  MemberExpression,
  SequenceExpression,
} from "@babel/types";
import type { NodePath } from "@babel/traverse";
import { addDefault } from "@babel/helper-module-imports";
import { createDefaultImportSource } from "./util";

/**
 * need cache to not duplicate the same imports multiple times per file
 * for example:
 * import _map from 'lodash/map';
 * import someMap from "lodash/map"; // <-- the second import shouldn't be added
 */
type DefaultImportResult = Identifier | MemberExpression | SequenceExpression;

export class ImportManager {
  private require: NodeRequire | undefined;
  private importCache: Map<string, DefaultImportResult> = new Map();

  constructor(params: { ensureModuleExists: boolean; filename: string }) {
    if (params.ensureModuleExists) {
      this.require = createRequire(params.filename || process.cwd());
    }
  }

  public reset() {
    this.importCache.clear();
    this.require = undefined;
  }

  /**
   * Add new default import:
   * import $importedName from '$importSource/$functionName';
   */
  public addDefaultImport(params: {
    referenceNodePath: NodePath;
    importSource: string;
    functionName: string;
    importedName: string;
  }): DefaultImportResult {
    const { referenceNodePath, importSource, importedName, functionName } =
      params;

    const newImportSource = createDefaultImportSource(
      importSource,
      functionName,
    );

    const cachedResult = this.importCache.get(newImportSource);
    if (cachedResult) return cachedResult;

    if (this.require) {
      try {
        // require.resolve uses cache under the hood, so it won't calculate paths every time
        this.require.resolve(newImportSource);
      } catch (e) {
        throw referenceNodePath.buildCodeFrameError(
          `The '${importSource}' method \`${importedName}\` is not a known module.`,
        );
      }
    }

    const result = addDefault(referenceNodePath, newImportSource, {
      nameHint: importedName,
    });
    this.importCache.set(newImportSource, result);

    return result;
  }
}
