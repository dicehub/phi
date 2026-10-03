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
  CHECKBOX_APPEARANCES,
  CHECKBOX_DEFAULT_VARIANT,
  CHECKBOX_VARIANTS,
  CHECKBOX_ORIENTATIONS,
  isCheckboxAppearance,
  isCheckboxOrientation,
  isCheckboxVariant,
  type CheckboxCheckedState,
  type CheckboxAppearance,
  type CheckboxOrientation,
  type CheckboxVariant,
} from "./checkbox";
