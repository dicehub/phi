import { inject, provide, type Ref } from "vue";
import type { SelectCollectionItem } from "./select";

type SelectRegistration = Omit<SelectCollectionItem, "valueKey"> & {
  valueKey?: string;
};

export type SelectContext = {
  createItem: (registration: SelectRegistration, fallbackKey: string) => SelectCollectionItem;
  registerItem: (id: string, item: SelectCollectionItem) => void;
  selectItem: (item: SelectCollectionItem, event?: Event) => void;
  unregisterItem: (id: string) => void;
  size: Ref<string>;
};

const selectContextKey = Symbol("phi-select");

export const provideSelectContext = (context: SelectContext) => {
  provide(selectContextKey, context);
};

export const useSelectContext = () => inject<SelectContext | undefined>(selectContextKey, undefined);
