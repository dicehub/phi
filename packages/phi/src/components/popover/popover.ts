import type { PopoverRootProps } from "@ark-ui/vue/popover";

export const POPOVER_SIDES = ["top", "bottom", "left", "right"] as const;
export const POPOVER_ALIGNS = ["start", "center", "end"] as const;
export const POPOVER_POSITION_METHODS = ["absolute", "fixed"] as const;

export type PopoverSide = (typeof POPOVER_SIDES)[number];
export type PopoverAlign = (typeof POPOVER_ALIGNS)[number];
export type PopoverPositionMethod = (typeof POPOVER_POSITION_METHODS)[number];
export type PopoverPositioningOptions = NonNullable<PopoverRootProps["positioning"]>;
export type PopoverAnchorElement = ReturnType<NonNullable<PopoverPositioningOptions["getAnchorElement"]>>;
export type PopoverAnchor = PopoverAnchorElement | (() => PopoverAnchorElement);
export type PhiPopoverSide = PopoverSide;

export type PopoverContentPositioning = {
  side?: PopoverSide;
  align?: PopoverAlign;
  sideOffset?: number;
  alignOffset?: number;
  positionMethod?: PopoverPositionMethod;
  anchor?: PopoverAnchor;
};

export type PhiPopoverVariantsProps = Pick<PopoverContentPositioning, "side">;

export type PopoverTriggerProps = {
  asChild?: boolean;
  className?: string;
  delay?: number;
  openOnHover?: boolean;
  value?: string;
};

export type PopoverContentProps = PopoverContentPositioning & {
  className?: string;
  container?: string | HTMLElement;
  teleportTo?: string | HTMLElement;
};

export type PopoverTitleProps = {
  className?: string;
};

export type PopoverDescriptionProps = {
  className?: string;
};

export type PopoverCloseProps = {
  asChild?: boolean;
  className?: string;
};

export const POPOVER_DEFAULT_SIDE: PopoverSide = "bottom";
export const POPOVER_DEFAULT_ALIGN: PopoverAlign = "center";
export const POPOVER_DEFAULT_SIDE_OFFSET = 8;
export const POPOVER_DEFAULT_ALIGN_OFFSET = 0;
export const POPOVER_DEFAULT_POSITION_METHOD: PopoverPositionMethod = "absolute";
export const POPOVER_ARROW_SIZE = 20;
export const POPOVER_ARROW_SIZE_HALF = POPOVER_ARROW_SIZE / 2;

export const POPOVER_VARIANTS = {
  side: {
    top: {
      classes: "",
      description: "Popover appears above the trigger",
    },
    bottom: {
      classes: "",
      description: "Popover appears below the trigger",
    },
    left: {
      classes: "",
      description: "Popover appears to the left of the trigger",
    },
    right: {
      classes: "",
      description: "Popover appears to the right of the trigger",
    },
  },
} as const;

export const POPOVER_DEFAULT_VARIANTS = {
  side: POPOVER_DEFAULT_SIDE,
} as const;

export const PHI_POPOVER_VARIANTS = POPOVER_VARIANTS;
export const PHI_POPOVER_DEFAULT_VARIANTS = POPOVER_DEFAULT_VARIANTS;

export function getPopoverPlacement(
  side: PopoverSide = POPOVER_DEFAULT_SIDE,
  align: PopoverAlign = POPOVER_DEFAULT_ALIGN,
): PopoverPositioningOptions["placement"] {
  return align === "center" ? side : `${side}-${align}`;
}

export function resolvePopoverAnchor(anchor?: PopoverAnchor): PopoverAnchorElement {
  return typeof anchor === "function" ? anchor() : (anchor ?? null);
}

export function getPopoverPositioning(options: PopoverContentPositioning): PopoverPositioningOptions {
  const side = options.side ?? POPOVER_DEFAULT_SIDE;
  const align = options.align ?? POPOVER_DEFAULT_ALIGN;
  const sideOffset = options.sideOffset ?? POPOVER_DEFAULT_SIDE_OFFSET;
  const alignOffset = options.alignOffset ?? POPOVER_DEFAULT_ALIGN_OFFSET;
  const positionMethod = options.positionMethod ?? POPOVER_DEFAULT_POSITION_METHOD;
  const anchor = options.anchor;

  return {
    placement: getPopoverPlacement(side, align),
    gutter: sideOffset - POPOVER_ARROW_SIZE_HALF,
    offset: { crossAxis: alignOffset },
    overflowPadding: 24,
    strategy: positionMethod,
    ...(anchor ? { getAnchorElement: () => resolvePopoverAnchor(anchor) } : {}),
    ...(anchor && side === "left" ? { flip: ["bottom" as const] } : {}),
  };
}
