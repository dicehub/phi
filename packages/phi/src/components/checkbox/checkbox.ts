export const CHECKBOX_VARIANTS = ["default", "error"] as const;
export const CHECKBOX_APPEARANCES = ["default", "card"] as const;
export const CHECKBOX_ORIENTATIONS = ["vertical", "horizontal"] as const;

export type CheckboxVariant = (typeof CHECKBOX_VARIANTS)[number];
export type CheckboxAppearance = (typeof CHECKBOX_APPEARANCES)[number];
export type CheckboxOrientation = (typeof CHECKBOX_ORIENTATIONS)[number];
export type CheckboxCheckedState = boolean | "indeterminate";

export const CHECKBOX_DEFAULT_VARIANT: CheckboxVariant = "default";

export const isCheckboxVariant = (value: unknown): value is CheckboxVariant =>
  typeof value === "string" && CHECKBOX_VARIANTS.includes(value as CheckboxVariant);

export const isCheckboxAppearance = (value: unknown): value is CheckboxAppearance =>
  typeof value === "string" && CHECKBOX_APPEARANCES.includes(value as CheckboxAppearance);

export const isCheckboxOrientation = (value: unknown): value is CheckboxOrientation =>
  typeof value === "string" && CHECKBOX_ORIENTATIONS.includes(value as CheckboxOrientation);
