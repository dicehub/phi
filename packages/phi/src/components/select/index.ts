import SelectRoot from "./Select.vue";
import SelectGroup from "./SelectGroup.vue";
import SelectGroupLabel from "./SelectGroupLabel.vue";
import SelectOption from "./SelectOption.vue";
import SelectSeparator from "./SelectSeparator.vue";

export const Select = Object.assign(SelectRoot, {
  Root: SelectRoot,
  Option: SelectOption,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
  Separator: SelectSeparator,
});

export {
  SelectRoot,
  SelectOption,
  SelectGroup,
  SelectGroupLabel,
  SelectSeparator,
};

export {
  createListCollection as createSelectCollection,
  useListCollection as useSelectCollection,
} from "@ark-ui/vue/select";
export type {
  CollectionItem as SelectCollectionPrimitiveItem,
  ListCollection as SelectListCollection,
  SelectFocusOutsideEvent,
  SelectHighlightChangeDetails,
  SelectInteractOutsideEvent,
  SelectOpenChangeDetails,
  SelectPointerDownOutsideEvent,
} from "@ark-ui/vue/select";
export {
  PHI_SELECT_DEFAULT_VARIANTS,
  PHI_SELECT_VARIANTS,
  SELECT_DEFAULT_VARIANTS,
  SELECT_SIZES,
  createSelectId,
  selectVariants,
  type PhiSelectSize,
  type PhiSelectVariantsProps,
  type SelectCollectionItem,
  type SelectError,
  type SelectFieldError,
  type SelectFieldErrorMatch,
  type SelectInputItem,
  type SelectItemDescriptor,
  type SelectItemEqual,
  type SelectItemValue,
  type SelectItems,
  type SelectSize,
  type SelectValue,
  type SelectValueChangeDetails,
} from "./select";
