// Public entrypoint for @dicehub/phi.
// The package shape comes first; real implementations land incrementally.
export * from "./components";
export * from "./primitives";
export * from "./blocks";
export type { RegistryComponentName } from "./registry/generated";
export type {
  ComponentRegistry,
  RegistryComponent,
  RegistryComponentType,
  RegistrySearchIndex,
} from "./registry/types";
