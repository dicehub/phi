import type { ButtonSize } from "../button/button";

export const BANNER_VARIANTS = {
  default: "default",
  alert: "alert",
  error: "error",
  secondary: "secondary",
} as const;

export const BANNER_SIZES = {
  base: "base",
  sm: "sm",
} as const;

export const BANNER_ACTION_VARIANTS = ["primary", "secondary", "ghost"] as const;

export const BANNER_DEFAULT_VARIANT = "default" satisfies BannerVariant;
export const BANNER_DEFAULT_SIZE = "base" satisfies BannerSize;
export const BANNER_ACTION_DEFAULT_VARIANT = "primary" satisfies BannerActionVariant;
export const BANNER_ACTION_DEFAULT_SIZE = "sm" satisfies BannerActionSize;

export type BannerVariant = keyof typeof BANNER_VARIANTS;
export type BannerSize = keyof typeof BANNER_SIZES;
export type BannerActionVariant = (typeof BANNER_ACTION_VARIANTS)[number];
export type BannerActionSize = Extract<ButtonSize, "xs" | "sm">;

export const BANNER_ACTION_SIZE_BY_BANNER = {
  base: "sm",
  sm: "xs",
} as const satisfies Record<BannerSize, BannerActionSize>;

export const isBannerVariant = (value: unknown): value is BannerVariant =>
  typeof value === "string" && value in BANNER_VARIANTS;

export const isBannerSize = (value: unknown): value is BannerSize =>
  typeof value === "string" && value in BANNER_SIZES;

export const isBannerActionVariant = (value: unknown): value is BannerActionVariant =>
  typeof value === "string" && BANNER_ACTION_VARIANTS.includes(value as BannerActionVariant);

export const resolveBannerVariant = (value: unknown): BannerVariant =>
  isBannerVariant(value) ? value : BANNER_DEFAULT_VARIANT;

export const resolveBannerSize = (value: unknown): BannerSize =>
  isBannerSize(value) ? value : BANNER_DEFAULT_SIZE;

export const resolveBannerActionVariant = (value: unknown): BannerActionVariant =>
  isBannerActionVariant(value) ? value : BANNER_ACTION_DEFAULT_VARIANT;
