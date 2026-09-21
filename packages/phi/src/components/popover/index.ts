import PopoverRoot from "./PopoverRoot.vue";
import PopoverTrigger from "./PopoverTrigger.vue";
import PopoverContent from "./PopoverContent.vue";
import PopoverTitle from "./PopoverTitle.vue";
import PopoverDescription from "./PopoverDescription.vue";
import PopoverClose from "./PopoverClose.vue";

export const Popover = Object.assign(PopoverRoot, {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
  CloseTrigger: PopoverClose,
});

export {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
  PopoverClose as PopoverCloseTrigger,
};

export {
  getPopoverPlacement,
  getPopoverPositioning,
  PHI_POPOVER_DEFAULT_VARIANTS,
  PHI_POPOVER_VARIANTS,
  POPOVER_ALIGNS,
  POPOVER_ARROW_SIZE,
  POPOVER_ARROW_SIZE_HALF,
  POPOVER_DEFAULT_ALIGN,
  POPOVER_DEFAULT_ALIGN_OFFSET,
  POPOVER_DEFAULT_POSITION_METHOD,
  POPOVER_DEFAULT_SIDE,
  POPOVER_DEFAULT_SIDE_OFFSET,
  POPOVER_DEFAULT_VARIANTS,
  POPOVER_POSITION_METHODS,
  POPOVER_SIDES,
  POPOVER_VARIANTS,
  resolvePopoverAnchor,
  type PhiPopoverSide,
  type PhiPopoverVariantsProps,
  type PopoverAlign,
  type PopoverAnchor,
  type PopoverAnchorElement,
  type PopoverCloseProps,
  type PopoverContentProps,
  type PopoverContentPositioning,
  type PopoverDescriptionProps,
  type PopoverPositioningOptions,
  type PopoverPositionMethod,
  type PopoverSide,
  type PopoverTitleProps,
  type PopoverTriggerProps,
} from "./popover";

export {
  popoverAnatomy,
  usePopover,
  usePopoverContext,
} from "@ark-ui/vue/popover";
export type {
  PopoverFocusOutsideEvent,
  PopoverInteractOutsideEvent,
  PopoverOpenChangeDetails,
  PopoverPointerDownOutsideEvent,
  PopoverRootProps,
  PopoverTriggerValueChangeDetails,
} from "@ark-ui/vue/popover";
