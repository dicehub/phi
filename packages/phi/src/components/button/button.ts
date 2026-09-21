export const BUTTON_VARIANTS = [
  "primary",
  "secondary",
  "ghost",
  "destructive",
  "secondary-destructive",
  "outline",
] as const;

export const BUTTON_SIZES = ["xs", "sm", "base", "lg"] as const;
export const BUTTON_SHAPES = ["base", "default", "square", "circle"] as const;
export const BUTTON_TONES = ["accent", "neutral", "ghost"] as const;

export const BUTTON_DEFAULT_VARIANT = "secondary";
export const BUTTON_DEFAULT_SIZE = "base";
export const BUTTON_DEFAULT_SHAPE = "base";

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export type ButtonSize = (typeof BUTTON_SIZES)[number];
export type ButtonShape = (typeof BUTTON_SHAPES)[number];
export type ButtonTone = (typeof BUTTON_TONES)[number];
export type ResolvedButtonShape = Exclude<ButtonShape, "default">;

const toneVariantMap: Record<ButtonTone, ButtonVariant> = {
  accent: "primary",
  neutral: "secondary",
  ghost: "ghost",
};

export function isButtonVariant(value: unknown): value is ButtonVariant {
  return typeof value === "string" && BUTTON_VARIANTS.includes(value as ButtonVariant);
}

export function isButtonSize(value: unknown): value is ButtonSize {
  return typeof value === "string" && BUTTON_SIZES.includes(value as ButtonSize);
}

export function isButtonShape(value: unknown): value is ButtonShape {
  return typeof value === "string" && BUTTON_SHAPES.includes(value as ButtonShape);
}

export function isButtonTone(value: unknown): value is ButtonTone {
  return typeof value === "string" && BUTTON_TONES.includes(value as ButtonTone);
}

export function resolveButtonVariant(variant?: ButtonVariant, tone?: ButtonTone): ButtonVariant {
  if (isButtonVariant(variant)) return variant;
  if (isButtonTone(tone)) return toneVariantMap[tone];

  return BUTTON_DEFAULT_VARIANT;
}

export function resolveButtonSize(size?: ButtonSize): ButtonSize {
  return isButtonSize(size) ? size : BUTTON_DEFAULT_SIZE;
}

export function resolveButtonShape(shape?: ButtonShape): ResolvedButtonShape {
  if (shape === "default") return "base";

  return isButtonShape(shape) ? shape : BUTTON_DEFAULT_SHAPE;
}
