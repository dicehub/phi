import RadioGroup from "./RadioGroup.vue";
import RadioItem from "./RadioItem.vue";
import RadioLegend from "./RadioLegend.vue";

export const Radio = Object.assign(RadioGroup, {
  Group: RadioGroup,
  Item: RadioItem,
  Legend: RadioLegend,
});

export { RadioGroup, RadioItem, RadioLegend };
export {
  PHI_RADIO_DEFAULT_VARIANTS,
  PHI_RADIO_VARIANTS,
  RADIO_APPEARANCES,
  RADIO_CONTROL_POSITIONS,
  RADIO_DEFAULT_VARIANTS,
  RADIO_ORIENTATIONS,
  RADIO_VARIANTS,
  RADIO_VARIANT_DEFINITIONS,
  createRadioGroupName,
  isRadioAppearance,
  isRadioItemAppearance,
  isRadioControlPosition,
  isRadioOrientation,
  isRadioVariant,
  radioVariants,
  type PhiRadioAppearance,
  type PhiRadioVariant,
  type PhiRadioVariantsProps,
  type RadioAppearance,
  type RadioControlPosition,
  type RadioGroupChangeEventDetails,
  type RadioItemAppearance,
  type RadioOrientation,
  type RadioValue,
  type RadioValueChangeDetails,
  type RadioVariant,
} from "./radio";
