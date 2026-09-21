<script setup lang="ts">
import { Popover as ArkPopover } from "@ark-ui/vue/popover";
import type { PopoverCloseProps } from "./popover";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<PopoverCloseProps>(),
  {
    asChild: false,
  },
);
</script>

<template>
  <ArkPopover.CloseTrigger
    v-bind="$attrs"
    :as-child="props.asChild"
    :class="['phi-popover-close', className]"
  >
    <slot>Close</slot>
  </ArkPopover.CloseTrigger>
</template>
