import TooltipRoot from "./Tooltip.vue";
import TooltipProvider from "./TooltipProvider.vue";

export const Tooltip = Object.assign(TooltipRoot, {
  Root: TooltipRoot,
  Provider: TooltipProvider,
});

export { TooltipProvider, TooltipRoot };

export {
  getTooltipPlacement,
  getTooltipPositioning,
  PHI_TOOLTIP_DEFAULT_VARIANTS,
  PHI_TOOLTIP_VARIANTS,
  TOOLTIP_ALIGNS,
  TOOLTIP_ARROW_SIZE,
  TOOLTIP_ARROW_SIZE_HALF,
  TOOLTIP_DEFAULT_ALIGN,
  TOOLTIP_DEFAULT_ALIGN_OFFSET,
  TOOLTIP_DEFAULT_CLOSE_DELAY,
  TOOLTIP_DEFAULT_DELAY,
  TOOLTIP_DEFAULT_POSITION_METHOD,
  TOOLTIP_DEFAULT_SIDE,
  TOOLTIP_DEFAULT_SIDE_OFFSET,
  TOOLTIP_DEFAULT_VARIANTS,
  TOOLTIP_POSITION_METHODS,
  TOOLTIP_PROVIDER_DEFAULT_TIMEOUT,
  TOOLTIP_SIDES,
  TOOLTIP_VARIANTS,
  tooltipVariants,
  type PhiTooltipSide,
  type PhiTooltipVariantsProps,
  type TooltipAlign,
  type TooltipContentPositioning,
  type TooltipContentValue,
  type TooltipPositioningOptions,
  type TooltipPositionMethod,
  type TooltipSide,
} from "./tooltip";

export { tooltipAnatomy, useTooltip, useTooltipContext } from "@ark-ui/vue/tooltip";
export type {
  TooltipOpenChangeDetails,
  TooltipRootProps,
  TooltipTriggerValueChangeDetails,
} from "@ark-ui/vue/tooltip";
