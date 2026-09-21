import type { ButtonSize } from "../button";
import type { InputError, InputSize } from "../input";

export const INPUT_GROUP_SIZES = ["xs", "sm", "base", "lg"] as const;
export const INPUT_GROUP_DEFAULT_SIZE = "base" satisfies InputGroupSize;

export type InputGroupSize = InputSize;
export type InputGroupError = InputError;

export const INPUT_GROUP_COMPACT_BUTTON_SIZE: Record<InputGroupSize, ButtonSize> = {
  xs: "xs",
  sm: "xs",
  base: "sm",
  lg: "base",
};
