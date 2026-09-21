import type { TooltipRootProps } from "@ark-ui/vue/tooltip";

export const TOOLTIP_SIDES = ["top", "bottom", "left", "right"] as const;
export const TOOLTIP_ALIGNS = ["start", "center", "end"] as const;
export const TOOLTIP_POSITION_METHODS = ["absolute", "fixed"] as const;

export type TooltipSide = (typeof TOOLTIP_SIDES)[number];
export type TooltipAlign = (typeof TOOLTIP_ALIGNS)[number];
export type TooltipPositionMethod = (typeof TOOLTIP_POSITION_METHODS)[number];
export type TooltipPositioningOptions = NonNullable<TooltipRootProps["positioning"]>;
export type TooltipContentValue = string | number | null;
export type PhiTooltipSide = TooltipSide;

export type TooltipContentPositioning = {
  align?: TooltipAlign;
  alignOffset?: number;
  positionMethod?: TooltipPositionMethod;
  side?: TooltipSide;
  sideOffset?: number;
};

export type PhiTooltipVariantsProps = Pick<TooltipContentPositioning, "side">;

export const TOOLTIP_DEFAULT_SIDE: TooltipSide = "top";
export const TOOLTIP_DEFAULT_ALIGN: TooltipAlign = "center";
export const TOOLTIP_DEFAULT_SIDE_OFFSET = 10;
export const TOOLTIP_DEFAULT_ALIGN_OFFSET = 0;
export const TOOLTIP_DEFAULT_POSITION_METHOD: TooltipPositionMethod = "absolute";
export const TOOLTIP_DEFAULT_DELAY = 600;
export const TOOLTIP_DEFAULT_CLOSE_DELAY = 0;
export const TOOLTIP_PROVIDER_DEFAULT_TIMEOUT = 400;
export const TOOLTIP_ARROW_SIZE = 20;
export const TOOLTIP_ARROW_SIZE_HALF = TOOLTIP_ARROW_SIZE / 2;

export const TOOLTIP_VARIANTS = {
  side: {
    top: {
      classes: "",
      description: "Tooltip appears above the trigger",
    },
    bottom: {
      classes: "",
      description: "Tooltip appears below the trigger",
    },
    left: {
      classes: "",
      description: "Tooltip appears to the left of the trigger",
    },
    right: {
      classes: "",
      description: "Tooltip appears to the right of the trigger",
    },
  },
} as const;

export const TOOLTIP_DEFAULT_VARIANTS = {
  side: TOOLTIP_DEFAULT_SIDE,
} as const;

export const PHI_TOOLTIP_VARIANTS = TOOLTIP_VARIANTS;
export const PHI_TOOLTIP_DEFAULT_VARIANTS = TOOLTIP_DEFAULT_VARIANTS;

let tooltipId = 0;

export function createTooltipId() {
  tooltipId += 1;
  return `phi-tooltip-${tooltipId}`;
}

export function getTooltipPlacement(
  side: TooltipSide = TOOLTIP_DEFAULT_SIDE,
  align: TooltipAlign = TOOLTIP_DEFAULT_ALIGN,
): TooltipPositioningOptions["placement"] {
  return align === "center" ? side : `${side}-${align}`;
}

export function getTooltipPositioning(options: TooltipContentPositioning): TooltipPositioningOptions {
  const side = options.side ?? TOOLTIP_DEFAULT_SIDE;
  const align = options.align ?? TOOLTIP_DEFAULT_ALIGN;
  const sideOffset = options.sideOffset ?? TOOLTIP_DEFAULT_SIDE_OFFSET;
  const alignOffset = options.alignOffset ?? TOOLTIP_DEFAULT_ALIGN_OFFSET;
  const positionMethod = options.positionMethod ?? TOOLTIP_DEFAULT_POSITION_METHOD;

  return {
    placement: getTooltipPlacement(side, align),
    gutter: Math.max(0, sideOffset - TOOLTIP_ARROW_SIZE_HALF),
    offset: { crossAxis: alignOffset },
    overflowPadding: 24,
    strategy: positionMethod,
  };
}

export function tooltipVariants({
  side = TOOLTIP_DEFAULT_VARIANTS.side,
}: PhiTooltipVariantsProps = {}) {
  return ["phi-tooltip-content", `phi-tooltip-content--${side}`].join(" ");
}
