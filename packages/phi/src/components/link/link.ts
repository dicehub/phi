export const LINK_VARIANTS = {
  inline: "inline",
  current: "current",
  plain: "plain",
} as const;

export type LinkVariant = keyof typeof LINK_VARIANTS;

export const LINK_DEFAULT_VARIANT: LinkVariant = "inline";

export const isLinkVariant = (value: string): value is LinkVariant => value in LINK_VARIANTS;
