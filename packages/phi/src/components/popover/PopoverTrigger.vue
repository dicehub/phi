<script setup lang="ts">
import { Popover as ArkPopover } from "@ark-ui/vue/popover";
import { usePopoverContext } from "./context";
import type { PopoverTriggerProps } from "./popover";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<PopoverTriggerProps>(),
  {
    asChild: false,
    delay: 0,
    openOnHover: false,
  },
);

const popover = usePopoverContext("Popover.Trigger");

function handlePointerEnter(event: PointerEvent) {
  if (!props.openOnHover || event.pointerType === "touch") return;
  popover.openFromHover(props.delay);
}

function handlePointerLeave() {
  if (!props.openOnHover) return;
  popover.scheduleHoverClose();
}

function handleFocus() {
  if (!props.openOnHover) return;
  popover.openFromHover(props.delay);
}

function handleBlur() {
  if (!props.openOnHover) return;
  popover.scheduleHoverClose(0);
}
</script>

<template>
  <ArkPopover.Trigger
    v-bind="$attrs"
    :as-child="asChild"
    :class="['phi-popover-trigger', className]"
    :value="value"
    data-phi-component="Popover"
    data-phi-part="trigger"
    @blur="handleBlur"
    @focus="handleFocus"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
  >
    <slot />
  </ArkPopover.Trigger>
</template>
