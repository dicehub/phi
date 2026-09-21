import { componentRegistry } from "./generated";
import type { RegistryBlockTemplate, RegistryComponent } from "./types";

export { componentRegistry, registryBlockTemplateNames, registryComponentNames } from "./generated";
export type { RegistryBlockTemplateName, RegistryComponentName } from "./generated";
export type {
  ComponentRegistry,
  RegistryBlockTemplate,
  RegistryBlockTemplateFile,
  RegistryComponent,
  RegistryComponentType,
  RegistrySearchIndex,
} from "./types";

const registryEntries: Readonly<Record<string, RegistryComponent>> = componentRegistry.components;

export const getRegistryComponent = (name: string): RegistryComponent | undefined =>
  Object.hasOwn(registryEntries, name) ? registryEntries[name] : undefined;

const registryBlockTemplates: Readonly<Record<string, RegistryBlockTemplate>> = componentRegistry.blockTemplates;

export const getRegistryBlockTemplate = (name: string): RegistryBlockTemplate | undefined =>
  Object.hasOwn(registryBlockTemplates, name) ? registryBlockTemplates[name] : undefined;
