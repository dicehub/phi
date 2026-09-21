export type RegistryComponentType = "block" | "component";

export interface RegistryComponent {
  name: string;
  type: RegistryComponentType;
  group: string;
  importPath: string;
  sourceFile: string;
  description: string;
  parts?: readonly string[];
}

export interface RegistrySearchIndex {
  byGroup: Readonly<Record<string, readonly string[]>>;
  byName: readonly string[];
  byType: Readonly<Record<RegistryComponentType, readonly string[]>>;
}

export interface RegistryBlockTemplateFile {
  /** POSIX path inside the packaged template directory. */
  source: string;
  /** POSIX path relative to the consumer's configured blocksDir. */
  target: string;
}

export interface RegistryBlockTemplate {
  name: string;
  type: "block";
  /** Copied into the consumer codebase instead of imported from the package. */
  delivery: "copy";
  group: string;
  description: string;
  entryFile: string;
  files: readonly RegistryBlockTemplateFile[];
  /** Registry component names the template imports from the package. */
  dependencies: readonly string[];
}

export interface ComponentRegistry {
  schemaVersion: 1;
  package: {
    name: string;
    version: string;
  };
  components: Readonly<Record<string, RegistryComponent>>;
  /** Absent or empty when no installable source blocks exist. */
  blockTemplates?: Readonly<Record<string, RegistryBlockTemplate>>;
  search: RegistrySearchIndex;
}
