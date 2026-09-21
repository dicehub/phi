export const RADIO_VARIANTS = ["default", "error"] as const;
export const RADIO_APPEARANCES = ["default", "card"] as const;
export const RADIO_ORIENTATIONS = ["vertical", "horizontal"] as const;
export const RADIO_CONTROL_POSITIONS = ["start", "end"] as const;

export type RadioVariant = (typeof RADIO_VARIANTS)[number];
export type PhiRadioVariant = RadioVariant;
export type RadioAppearance = (typeof RADIO_APPEARANCES)[number];
export type PhiRadioAppearance = RadioAppearance;
export type RadioOrientation = (typeof RADIO_ORIENTATIONS)[number];
export type RadioControlPosition = (typeof RADIO_CONTROL_POSITIONS)[number];
export type RadioValue = string | number | boolean;

export type RadioValueChangeDetails = {
  value: RadioValue;
  event: Event;
};

export type RadioGroupChangeEventDetails = RadioValueChangeDetails;

export type PhiRadioVariantsProps = {
  variant?: RadioVariant;
  appearance?: RadioAppearance;
};

export const RADIO_DEFAULT_VARIANTS = {
  variant: "default",
  appearance: "default",
} as const;

export const RADIO_VARIANT_DEFINITIONS = {
  variant: {
    default: {
      classes: "phi-radio--default",
      description: "Default radio appearance",
    },
    error: {
      classes: "phi-radio--error",
      description: "Error state for validation failures",
    },
  },
  appearance: {
    default: {
      classes: "phi-radio--appearance-default",
      description: "Standard inline radio item",
    },
    card: {
      classes: "phi-radio--appearance-card",
      description: "Choice card with border, padding, and highlighted selection state",
    },
  },
} as const;

export const PHI_RADIO_VARIANTS = RADIO_VARIANT_DEFINITIONS;
export const PHI_RADIO_DEFAULT_VARIANTS = RADIO_DEFAULT_VARIANTS;

let radioGroupNameId = 0;

export const createRadioGroupName = () => {
  radioGroupNameId += 1;
  return `phi-radio-${radioGroupNameId}`;
};

export const isRadioVariant = (value: unknown): value is RadioVariant =>
  typeof value === "string" && RADIO_VARIANTS.includes(value as RadioVariant);

export const isRadioAppearance = (value: unknown): value is RadioAppearance =>
  typeof value === "string" && RADIO_APPEARANCES.includes(value as RadioAppearance);

export const isRadioOrientation = (value: unknown): value is RadioOrientation =>
  typeof value === "string" && RADIO_ORIENTATIONS.includes(value as RadioOrientation);

export const isRadioControlPosition = (value: unknown): value is RadioControlPosition =>
  typeof value === "string" && RADIO_CONTROL_POSITIONS.includes(value as RadioControlPosition);

export function radioVariants({
  variant = RADIO_DEFAULT_VARIANTS.variant,
  appearance = RADIO_DEFAULT_VARIANTS.appearance,
}: PhiRadioVariantsProps = {}) {
  const resolvedVariant = isRadioVariant(variant) ? variant : RADIO_DEFAULT_VARIANTS.variant;
  const resolvedAppearance = isRadioAppearance(appearance) ? appearance : RADIO_DEFAULT_VARIANTS.appearance;

  return [
    RADIO_VARIANT_DEFINITIONS.variant[resolvedVariant].classes,
    RADIO_VARIANT_DEFINITIONS.appearance[resolvedAppearance].classes,
  ].join(" ");
}
