import {
  INPUT_DEFAULT_SIZE,
  INPUT_DEFAULT_VARIANT,
  INPUT_SIZES,
  INPUT_VARIANTS,
  normalizeInputError,
  resolveInputSize,
  resolveInputVariant,
  type InputError,
  type InputErrorMatch,
  type InputSize,
  type InputVariant,
} from "../input/input";

export const SENSITIVE_INPUT_SIZES = INPUT_SIZES;
export const SENSITIVE_INPUT_VARIANTS = INPUT_VARIANTS;

export const SENSITIVE_INPUT_DEFAULT_VARIANTS = {
  size: INPUT_DEFAULT_SIZE,
  variant: INPUT_DEFAULT_VARIANT,
} as const;

export const PHI_SENSITIVE_INPUT_VARIANTS = SENSITIVE_INPUT_VARIANTS;
export const PHI_SENSITIVE_INPUT_DEFAULT_VARIANTS = SENSITIVE_INPUT_DEFAULT_VARIANTS;

export type SensitiveInputSize = InputSize;
export type SensitiveInputVariant = InputVariant;
export type SensitiveInputErrorMatch = InputErrorMatch;
export type SensitiveInputError = InputError;
export type SensitiveInputMode = "masked" | "revealed" | "empty";

let sensitiveInputId = 0;

export const createSensitiveInputId = () => {
  sensitiveInputId += 1;
  return `phi-sensitive-input-${sensitiveInputId}`;
};

export {
  normalizeInputError as normalizeSensitiveInputError,
  resolveInputSize as resolveSensitiveInputSize,
  resolveInputVariant as resolveSensitiveInputVariant,
};
