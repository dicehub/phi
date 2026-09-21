<script setup lang="ts">
import { provideTooltipProvider } from "./context";
import {
  TOOLTIP_DEFAULT_CLOSE_DELAY,
  TOOLTIP_DEFAULT_DELAY,
  TOOLTIP_PROVIDER_DEFAULT_TIMEOUT,
} from "./tooltip";

const props = withDefaults(
  defineProps<{
    closeDelay?: number;
    delay?: number;
    timeout?: number;
  }>(),
  {
    closeDelay: TOOLTIP_DEFAULT_CLOSE_DELAY,
    delay: TOOLTIP_DEFAULT_DELAY,
    timeout: TOOLTIP_PROVIDER_DEFAULT_TIMEOUT,
  },
);

provideTooltipProvider(props);
</script>

<template>
  <slot />
</template>
