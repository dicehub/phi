import SwitchRoot from "./Switch.vue";
import SwitchGroup from "./SwitchGroup.vue";
import SwitchItem from "./SwitchItem.vue";
import SwitchLegend from "./SwitchLegend.vue";

export const Switch = Object.assign(SwitchRoot, {
  Group: SwitchGroup,
  Item: SwitchItem,
  Legend: SwitchLegend,
});

export { SwitchGroup, SwitchItem, SwitchLegend, SwitchRoot };
export {
  SWITCH_DEFAULT_VARIANTS,
  SWITCH_VARIANTS,
  isSwitchSize,
  isSwitchVariant,
  type SwitchCheckedChangeDetails,
  type SwitchSize,
  type SwitchVariant,
} from "./switch";

export type SwitchProps = InstanceType<typeof SwitchRoot>["$props"];
export type SwitchGroupProps = InstanceType<typeof SwitchGroup>["$props"];
export type SwitchItemProps = InstanceType<typeof SwitchItem>["$props"];
export type SwitchLegendProps = InstanceType<typeof SwitchLegend>["$props"];
