import { computed, inject, provide, type ComputedRef, type Ref } from "vue";
import type { ListCollection } from "@ark-ui/vue/combobox";
import type { ComboboxPositioningOptions } from "./combobox";

export type ComboboxSize = "xs" | "sm" | "base" | "lg";

type ComboboxContext = {
  clearContentPositioning: () => void;
  collection: ComputedRef<ListCollection<unknown>>;
  describedBy: ComputedRef<string | undefined>;
  filterValue: Ref<string>;
  invalid: ComputedRef<boolean>;
  setContentPositioning: (positioning: ComboboxPositioningOptions) => void;
  setFilterValue: (value: string) => void;
  size: ComputedRef<ComboboxSize>;
};

const comboboxContextKey = Symbol("PhiComboboxContext");

const fallbackCollection = computed(() => ({
  items: [],
  getItemValue: (item: unknown) => String(item ?? ""),
  stringifyItem: (item: unknown) => String(item ?? ""),
  stringify: (value: string | null) => value,
  find: () => null,
} as unknown as ListCollection<unknown>));

const fallbackContext: ComboboxContext = {
  clearContentPositioning: () => {},
  collection: fallbackCollection,
  describedBy: computed(() => undefined),
  filterValue: computed({
    get: () => "",
    set: () => {},
  }),
  invalid: computed(() => false),
  setContentPositioning: () => {},
  setFilterValue: () => {},
  size: computed(() => "base"),
};

export const provideComboboxContext = (context: ComboboxContext) => {
  provide(comboboxContextKey, context);
};

export const usePhiComboboxContext = () => inject(comboboxContextKey, fallbackContext);
