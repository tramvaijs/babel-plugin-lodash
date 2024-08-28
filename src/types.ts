import type { Visitor } from "@babel/traverse";
import type { PluginPass } from "@babel/core";

interface BaseSpecifier {
  kind: string;
  local: string;
}
export interface NamedSpecifier extends BaseSpecifier {
  kind: "named";
  imported: string;
}
export interface NamespaceSpecifier extends BaseSpecifier {
  kind: "namespace";
}
export interface DefaultSpecifier extends BaseSpecifier {
  kind: "default";
}

export type Specifier = NamedSpecifier | NamespaceSpecifier | DefaultSpecifier;
