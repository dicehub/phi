import ComboboxRoot from "./Combobox.vue";
import ComboboxChip from "./ComboboxChip.vue";
import ComboboxContent from "./ComboboxContent.vue";
import ComboboxEmpty from "./ComboboxEmpty.vue";
import ComboboxGroup from "./ComboboxGroup.vue";
import ComboboxGroupLabel from "./ComboboxGroupLabel.vue";
import ComboboxInput from "./ComboboxInput.vue";
import ComboboxItem from "./ComboboxItem.vue";
import ComboboxList from "./ComboboxList.vue";
import ComboboxTrigger from "./ComboboxTrigger.vue";
import ComboboxTriggerInput from "./ComboboxTriggerInput.vue";
import ComboboxTriggerMultipleWithInput from "./ComboboxTriggerMultipleWithInput.vue";
import ComboboxTriggerValue from "./ComboboxTriggerValue.vue";
import ComboboxValue from "./ComboboxValue.vue";

export const Combobox = Object.assign(ComboboxRoot, {
  Root: ComboboxRoot,
  Chip: ComboboxChip,
  Content: ComboboxContent,
  Empty: ComboboxEmpty,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
  Input: ComboboxInput,
  Item: ComboboxItem,
  List: ComboboxList,
  Trigger: ComboboxTrigger,
  TriggerInput: ComboboxTriggerInput,
  TriggerMultipleWithInput: ComboboxTriggerMultipleWithInput,
  TriggerValue: ComboboxTriggerValue,
  Value: ComboboxValue,
});

export {
  ComboboxRoot,
  ComboboxChip,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxTriggerInput,
  ComboboxTriggerMultipleWithInput,
  ComboboxTriggerValue,
  ComboboxValue,
};

export {
  createListCollection as createComboboxCollection,
  useListCollection as useComboboxCollection,
} from "@ark-ui/vue/combobox";
export type {
  CollectionItem as ComboboxCollectionItem,
  ComboboxHighlightChangeDetails,
  ComboboxInputValueChangeDetails,
  ComboboxOpenChangeDetails,
  ComboboxRootProps,
  ComboboxSelectionDetails,
  ComboboxValueChangeDetails,
  ListCollection as ComboboxListCollection,
  UseListCollectionProps as UseComboboxCollectionProps,
} from "@ark-ui/vue/combobox";
export type { UseListCollectionReturn as UseComboboxCollectionReturn } from "@ark-ui/vue/collection";
export type { ComboboxContentProps, ComboboxPositioningOptions } from "./combobox";
