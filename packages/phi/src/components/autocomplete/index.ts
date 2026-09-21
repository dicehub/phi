import AutocompleteRoot from "./Autocomplete.vue";
import AutocompleteContent from "./AutocompleteContent.vue";
import AutocompleteEmpty from "./AutocompleteEmpty.vue";
import AutocompleteGroup from "./AutocompleteGroup.vue";
import AutocompleteGroupLabel from "./AutocompleteGroupLabel.vue";
import AutocompleteInputGroup from "./AutocompleteInputGroup.vue";
import AutocompleteItem from "./AutocompleteItem.vue";
import AutocompleteItemIndicator from "./AutocompleteItemIndicator.vue";
import AutocompleteItemText from "./AutocompleteItemText.vue";
import AutocompleteLabel from "./AutocompleteLabel.vue";
import AutocompleteList from "./AutocompleteList.vue";
import AutocompleteSeparator from "./AutocompleteSeparator.vue";

export const Autocomplete = Object.assign(AutocompleteRoot, {
  Root: AutocompleteRoot,
  Content: AutocompleteContent,
  Empty: AutocompleteEmpty,
  Group: AutocompleteGroup,
  GroupLabel: AutocompleteGroupLabel,
  InputGroup: AutocompleteInputGroup,
  Item: AutocompleteItem,
  ItemIndicator: AutocompleteItemIndicator,
  ItemText: AutocompleteItemText,
  Label: AutocompleteLabel,
  List: AutocompleteList,
  Separator: AutocompleteSeparator,
});

export {
  AutocompleteRoot,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInputGroup,
  AutocompleteItem,
  AutocompleteItemIndicator,
  AutocompleteItemText,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteSeparator,
};

export {
  createListCollection as createAutocompleteCollection,
  useListCollection as useAutocompleteCollection,
} from "@ark-ui/vue/combobox";
export type {
  CollectionItem as AutocompleteCollectionItem,
  ComboboxHighlightChangeDetails as AutocompleteHighlightChangeDetails,
  ComboboxInputValueChangeDetails as AutocompleteInputValueChangeDetails,
  ComboboxOpenChangeDetails as AutocompleteOpenChangeDetails,
  ComboboxRootProps as AutocompleteRootProps,
  ComboboxSelectionDetails as AutocompleteSelectionDetails,
  ComboboxValueChangeDetails as AutocompleteValueChangeDetails,
  ListCollection as AutocompleteListCollection,
  UseListCollectionProps as UseAutocompleteCollectionProps,
} from "@ark-ui/vue/combobox";
export type { UseListCollectionReturn as UseAutocompleteCollectionReturn } from "@ark-ui/vue/collection";
