import SensitiveInputRoot from "./SensitiveInput.vue";

export const SensitiveInput = SensitiveInputRoot;

export { SensitiveInputRoot };
export {
  PHI_SENSITIVE_INPUT_DEFAULT_VARIANTS,
  PHI_SENSITIVE_INPUT_VARIANTS,
  SENSITIVE_INPUT_DEFAULT_VARIANTS,
  SENSITIVE_INPUT_SIZES,
  SENSITIVE_INPUT_VARIANTS,
  createSensitiveInputId,
  normalizeSensitiveInputError,
  resolveSensitiveInputSize,
  resolveSensitiveInputVariant,
  type SensitiveInputError,
  type SensitiveInputErrorMatch,
  type SensitiveInputMode,
  type SensitiveInputSize,
  type SensitiveInputVariant,
} from "./sensitive-input";
