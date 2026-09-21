export const FIELD_VARIANTS = {} as const;
export const FIELD_DEFAULT_VARIANTS = {} as const;

export const PHI_FIELD_VARIANTS = FIELD_VARIANTS;
export const PHI_FIELD_DEFAULT_VARIANTS = FIELD_DEFAULT_VARIANTS;

export type FieldErrorMatch =
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

export type FieldError =
  | string
  | {
      message: string;
      match?: FieldErrorMatch;
    };

export interface FieldVariantsProps {
  controlFirst?: boolean;
}

export interface PhiFieldVariantsProps extends FieldVariantsProps {}

export function normalizeFieldError(error?: FieldError) {
  if (!error) return undefined;
  if (typeof error === "string") return { message: error, match: true satisfies FieldErrorMatch };
  return { match: true satisfies FieldErrorMatch, ...error };
}

export function fieldVariants({ controlFirst = false }: FieldVariantsProps = {}) {
  return ["phi-field", controlFirst ? "phi-field--control-first" : undefined].filter(Boolean).join(" ");
}
