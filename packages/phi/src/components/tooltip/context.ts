import { computed, inject, onBeforeUnmount, provide, ref, type ComputedRef } from "vue";
import {
  TOOLTIP_DEFAULT_CLOSE_DELAY,
  TOOLTIP_DEFAULT_DELAY,
  TOOLTIP_PROVIDER_DEFAULT_TIMEOUT,
} from "./tooltip";

const TOOLTIP_PROVIDER_SYMBOL = Symbol("PhiTooltipProvider");

export type TooltipProviderContext = {
  closeDelay: ComputedRef<number>;
  delay: ComputedRef<number>;
  timeout: ComputedRef<number>;
  getCloseDelay: (closeDelay?: number) => number;
  getOpenDelay: (delay?: number) => number;
  onTooltipClose: () => void;
  onTooltipOpen: () => void;
};

export type TooltipProviderOptions = {
  closeDelay?: number;
  delay?: number;
  timeout?: number;
};

export function provideTooltipProvider(options: TooltipProviderOptions) {
  const skipDelay = ref(false);
  const delay = computed(() => options.delay ?? TOOLTIP_DEFAULT_DELAY);
  const closeDelay = computed(() => options.closeDelay ?? TOOLTIP_DEFAULT_CLOSE_DELAY);
  const timeout = computed(() => options.timeout ?? TOOLTIP_PROVIDER_DEFAULT_TIMEOUT);
  let skipDelayTimer: ReturnType<typeof setTimeout> | undefined;

  function clearSkipDelayTimer() {
    if (!skipDelayTimer) return;
    clearTimeout(skipDelayTimer);
    skipDelayTimer = undefined;
  }

  function onTooltipOpen() {
    clearSkipDelayTimer();
    skipDelay.value = true;
  }

  function onTooltipClose() {
    clearSkipDelayTimer();

    if (timeout.value <= 0) {
      skipDelay.value = false;
      return;
    }

    skipDelayTimer = setTimeout(() => {
      skipDelay.value = false;
      skipDelayTimer = undefined;
    }, timeout.value);
  }

  const context: TooltipProviderContext = {
    closeDelay,
    delay,
    timeout,
    getCloseDelay: (value) => value ?? closeDelay.value,
    getOpenDelay: (value) => (skipDelay.value ? 0 : (value ?? delay.value)),
    onTooltipClose,
    onTooltipOpen,
  };

  provide(TOOLTIP_PROVIDER_SYMBOL, context);

  onBeforeUnmount(() => {
    clearSkipDelayTimer();
  });

  return context;
}

export function useTooltipProvider() {
  return inject<TooltipProviderContext | null>(TOOLTIP_PROVIDER_SYMBOL, null);
}
