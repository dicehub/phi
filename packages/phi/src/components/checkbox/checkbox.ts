export const CHECKBOX_VARIANTS = ["default", "error"] as const;

export type CheckboxVariant = (typeof CHECKBOX_VARIANTS)[number];
export type CheckboxCheckedState = boolean | "indeterminate";

export const CHECKBOX_DEFAULT_VARIANT: CheckboxVariant = "default";

export const isCheckboxVariant = (value: unknown): value is CheckboxVariant =>
  typeof value === "string" && CHECKBOX_VARIANTS.includes(value as CheckboxVariant);
