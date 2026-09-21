<script setup lang="ts">
import { Popover as ArkPopover } from "@ark-ui/vue/popover";
import type { PopoverTitleProps } from "./popover";

defineOptions({ inheritAttrs: false });

defineProps<PopoverTitleProps>();
</script>

<template>
  <ArkPopover.Title v-bind="$attrs" :class="['phi-popover-title', className]">
    <slot />
  </ArkPopover.Title>
</template>
