export const SWITCH_VARIANTS = {
  size: {
    sm: {
      description: "Small switch for compact UIs",
    },
    base: {
      description: "Default switch size",
    },
    lg: {
      description: "Large switch for prominent toggles",
    },
  },
  variant: {
    default: {
      description: "Default switch with brand blue checked state",
    },
    neutral: {
      description: "Monochrome switch for subtle toggles",
    },
  },
} as const;

export const SWITCH_DEFAULT_VARIANTS = {
  size: "base",
  variant: "default",
} as const;

export type SwitchSize = keyof typeof SWITCH_VARIANTS.size;
export type SwitchVariant = keyof typeof SWITCH_VARIANTS.variant;

export type SwitchCheckedChangeDetails = {
  checked: boolean;
  event: Event;
};

export const isSwitchSize = (value: string): value is SwitchSize => value in SWITCH_VARIANTS.size;

export const isSwitchVariant = (value: string): value is SwitchVariant => value in SWITCH_VARIANTS.variant;
