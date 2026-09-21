export const INPUT_SIZES = ["xs", "sm", "base", "lg"] as const;
export const INPUT_VARIANTS = ["default", "error"] as const;

export const INPUT_DEFAULT_SIZE = "base";
export const INPUT_DEFAULT_VARIANT = "default";

export type InputSize = (typeof INPUT_SIZES)[number];
export type InputVariant = (typeof INPUT_VARIANTS)[number];

export type InputErrorMatch =
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

export type InputError =
  | string
  | {
      message: string;
      match?: InputErrorMatch;
    };

export const isInputSize = (value: unknown): value is InputSize =>
  typeof value === "string" && INPUT_SIZES.includes(value as InputSize);

export const isInputVariant = (value: unknown): value is InputVariant =>
  typeof value === "string" && INPUT_VARIANTS.includes(value as InputVariant);

export const resolveInputSize = (value?: InputSize) =>
  isInputSize(value) ? value : INPUT_DEFAULT_SIZE;

export const resolveInputVariant = (variant?: InputVariant, error?: InputError) => {
  if (isInputVariant(variant)) return variant;
  return error ? "error" : INPUT_DEFAULT_VARIANT;
};

export const normalizeInputError = (error?: InputError) => {
  if (!error) return undefined;
  if (typeof error === "string") return error;
  return error.message;
};
