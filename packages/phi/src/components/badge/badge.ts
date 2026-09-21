export const BADGE_VARIANTS = {
  primary: "primary",
  secondary: "secondary",
  error: "error",
  warning: "warning",
  success: "success",
  destructive: "destructive",
  info: "info",
  beta: "beta",
  outline: "outline",
  red: "red",
  orange: "orange",
  green: "green",
  teal: "teal",
  "teal-subtle": "teal-subtle",
  blue: "blue",
  purple: "purple",
  neutral: "neutral",
} as const;

export const BADGE_DEFAULT_VARIANT = "primary" satisfies BadgeVariant;

export type BadgeVariant = keyof typeof BADGE_VARIANTS;

export const isBadgeVariant = (value: string): value is BadgeVariant => value in BADGE_VARIANTS;
