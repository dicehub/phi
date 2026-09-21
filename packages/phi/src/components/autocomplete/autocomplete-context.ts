import { inject, provide, type ComputedRef } from "vue";
import type { ListCollection } from "@ark-ui/vue/combobox";

export type AutocompleteContext = {
  collection: ComputedRef<ListCollection<unknown>>;
};

const autocompleteContextKey = Symbol("phi-autocomplete-context");

export const provideAutocompleteContext = (context: AutocompleteContext) => {
  provide(autocompleteContextKey, context);
};

export const useAutocompleteContext = () => inject<AutocompleteContext | null>(autocompleteContextKey, null);
