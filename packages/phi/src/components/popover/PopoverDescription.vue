<script setup lang="ts">
import { Popover as ArkPopover } from "@ark-ui/vue/popover";
import type { PopoverDescriptionProps } from "./popover";

defineOptions({ inheritAttrs: false });

defineProps<PopoverDescriptionProps>();
</script>

<template>
  <ArkPopover.Description v-bind="$attrs" :class="['phi-popover-description', className]">
    <slot />
  </ArkPopover.Description>
</template>
