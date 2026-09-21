<script setup lang="ts">
import { computed, onBeforeUnmount, watchEffect } from "vue";
import { Popover as ArkPopover } from "@ark-ui/vue/popover";
import { usePopoverContext } from "./context";
import {
  POPOVER_DEFAULT_ALIGN,
  POPOVER_DEFAULT_ALIGN_OFFSET,
  POPOVER_DEFAULT_POSITION_METHOD,
  POPOVER_DEFAULT_SIDE,
  POPOVER_DEFAULT_SIDE_OFFSET,
  type PopoverContentProps,
} from "./popover";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<PopoverContentProps>(),
  {
    align: POPOVER_DEFAULT_ALIGN,
    alignOffset: POPOVER_DEFAULT_ALIGN_OFFSET,
    positionMethod: POPOVER_DEFAULT_POSITION_METHOD,
    side: POPOVER_DEFAULT_SIDE,
    sideOffset: POPOVER_DEFAULT_SIDE_OFFSET,
    teleportTo: "body",
  },
);

const popover = usePopoverContext("Popover.Content");
const resolvedContainer = computed(() => props.container ?? props.teleportTo);

watchEffect(() => {
  popover.setContentPositioning({
    align: props.align,
    alignOffset: props.alignOffset,
    anchor: props.anchor,
    positionMethod: props.positionMethod,
    side: props.side,
    sideOffset: props.sideOffset,
  });
});

onBeforeUnmount(() => {
  popover.clearContentPositioning();
});
</script>

<template>
  <Teleport :to="resolvedContainer">
    <ArkPopover.Positioner class="phi-popover-positioner">
      <ArkPopover.Content
        v-bind="$attrs"
        :class="['phi-popover-content', className]"
        @focusin="popover.cancelHoverClose"
        @focusout="() => popover.scheduleHoverClose(0)"
        @pointerenter="popover.cancelHoverClose"
        @pointerleave="() => popover.scheduleHoverClose()"
      >
        <ArkPopover.Arrow class="phi-popover-arrow" aria-hidden="true">
          <svg class="phi-popover-arrow__svg" width="20" height="10" viewBox="0 0 20 10" fill="none">
            <path
              class="phi-popover-arrow__fill"
              d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
            />
            <path
              class="phi-popover-arrow__edge"
              d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
            />
            <path
              class="phi-popover-arrow__stroke"
              d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
            />
          </svg>
        </ArkPopover.Arrow>
        <slot />
      </ArkPopover.Content>
    </ArkPopover.Positioner>
  </Teleport>
</template>

<style src="./popover.css"></style>
