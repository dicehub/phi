import CheckboxRoot from "./Checkbox.vue";
import CheckboxGroup from "./CheckboxGroup.vue";
import CheckboxItem from "./CheckboxItem.vue";
import CheckboxLegend from "./CheckboxLegend.vue";

export const Checkbox = Object.assign(CheckboxRoot, {
  Group: CheckboxGroup,
  Item: CheckboxItem,
  Legend: CheckboxLegend,
});

export { CheckboxGroup, CheckboxItem, CheckboxLegend, CheckboxRoot };
export {
  CHECKBOX_DEFAULT_VARIANT,
  CHECKBOX_VARIANTS,
  isCheckboxVariant,
  type CheckboxCheckedState,
  type CheckboxVariant,
} from "./checkbox";
