export const SELECT_SIZES = ["xs", "sm", "base", "lg"] as const;

export type SelectSize = (typeof SELECT_SIZES)[number];
export type PhiSelectSize = SelectSize;
export type SelectValue = unknown;

export type SelectItemDescriptor = {
  label: unknown;
  disabled?: boolean;
};

export type SelectItemValue = string | number | boolean | null | SelectItemDescriptor;

export type SelectFieldErrorMatch =
  | boolean
  | "badInput"
  | "customError"
  | "patternMismatch"
  | "rangeOverflow"
  | "rangeUnderflow"
  | "stepMismatch"
  | "tooLong"
  | "tooShort"
  | "typeMismatch"
  | "valid"
  | "valueMissing";

export type SelectFieldError = {
  message: unknown;
  match: SelectFieldErrorMatch;
};

export type SelectError = string | SelectFieldError;

export type SelectInputItem = {
  label: unknown;
  value: unknown;
  disabled?: boolean;
};

export type SelectItems =
  | Record<string, SelectItemValue>
  | ReadonlyArray<SelectInputItem>;

export type SelectCollectionItem = {
  disabled?: boolean;
  label: string;
  rawLabel: unknown;
  value: unknown;
  valueKey: string;
};

export type SelectValueChangeDetails = {
  event?: Event;
  items: SelectCollectionItem[];
  value: unknown;
  valueKeys: string[];
};

export type SelectItemEqual = (itemValue: unknown, value: unknown) => boolean;

export type PhiSelectVariantsProps = {
  size?: SelectSize;
};

export const SELECT_DEFAULT_VARIANTS = {
  size: "base",
} as const;

export const PHI_SELECT_DEFAULT_VARIANTS = SELECT_DEFAULT_VARIANTS;

export const PHI_SELECT_VARIANTS = {
  size: {
    xs: { classes: "phi-select-trigger--xs", description: "Extra small select trigger" },
    sm: { classes: "phi-select-trigger--sm", description: "Small select trigger" },
    base: { classes: "phi-select-trigger--base", description: "Default select trigger" },
    lg: { classes: "phi-select-trigger--lg", description: "Large select trigger" },
  },
} as const;

let selectId = 0;

export const createSelectId = (prefix = "phi-select") => {
  selectId += 1;
  return `${prefix}-${selectId}`;
};

export const isSelectSize = (value: unknown): value is SelectSize =>
  typeof value === "string" && SELECT_SIZES.includes(value as SelectSize);

export const resolveSelectSize = (value: unknown): SelectSize =>
  isSelectSize(value) ? value : SELECT_DEFAULT_VARIANTS.size;

export const isSelectItemDescriptor = (value: unknown): value is SelectItemDescriptor => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return "label" in value && (value as SelectItemDescriptor).label !== undefined;
};

export const stringifySelectLabel = (value: unknown) => {
  if (value === null || value === undefined) return "";
  return String(value);
};

export const createSelectValueKey = (value: unknown, fallback: string) => {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return fallback;
};

export const areSelectValuesEqual: SelectItemEqual = (itemValue, value) => Object.is(itemValue, value);

export function selectVariants({ size = SELECT_DEFAULT_VARIANTS.size }: PhiSelectVariantsProps = {}) {
  const resolvedSize = resolveSelectSize(size);
  return `phi-select-trigger phi-select-trigger--${resolvedSize}`;
}
