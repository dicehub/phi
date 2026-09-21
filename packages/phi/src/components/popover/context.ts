import { inject, provide, type InjectionKey } from "vue";
import type { PopoverContentPositioning } from "./popover";

export type PopoverContext = {
  cancelHoverClose: () => void;
  cancelHoverOpen: () => void;
  clearContentPositioning: () => void;
  openFromHover: (delay?: number) => void;
  scheduleHoverClose: (delay?: number) => void;
  setContentPositioning: (positioning: PopoverContentPositioning) => void;
  setOpen: (open: boolean) => void;
};

const POPOVER_CONTEXT_KEY: InjectionKey<PopoverContext> = Symbol("PhiPopoverContext");

export function providePopoverContext(context: PopoverContext) {
  provide(POPOVER_CONTEXT_KEY, context);
}

export function usePopoverContext(component = "Popover") {
  const context = inject(POPOVER_CONTEXT_KEY);

  if (!context) {
    throw new Error(`${component} must be used inside Popover.Root.`);
  }

  return context;
}
