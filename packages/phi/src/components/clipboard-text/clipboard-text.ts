export const CLIPBOARD_TEXT_SIZES = ["sm", "base", "lg"] as const;
export const CLIPBOARD_TEXT_TOOLTIP_SIDES = ["top", "bottom", "left", "right"] as const;

export const CLIPBOARD_TEXT_DEFAULT_SIZE = "lg" satisfies ClipboardTextSize;
export const CLIPBOARD_TEXT_DEFAULT_TOOLTIP_SIDE = "top" satisfies ClipboardTextTooltipSide;

export type ClipboardTextSize = (typeof CLIPBOARD_TEXT_SIZES)[number];
export type ClipboardTextTooltipSide = (typeof CLIPBOARD_TEXT_TOOLTIP_SIDES)[number];

export type ClipboardTextTooltip = {
  text?: string;
  copiedText?: string;
  side?: ClipboardTextTooltipSide;
};

export type ClipboardTextLabels = {
  copyAction?: string;
};

export const isClipboardTextSize = (value: unknown): value is ClipboardTextSize =>
  typeof value === "string" && CLIPBOARD_TEXT_SIZES.includes(value as ClipboardTextSize);

export const isClipboardTextTooltipSide = (value: unknown): value is ClipboardTextTooltipSide =>
  typeof value === "string" && CLIPBOARD_TEXT_TOOLTIP_SIDES.includes(value as ClipboardTextTooltipSide);
