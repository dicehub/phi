<script setup lang="ts">
import { computed, useAttrs, useSlots, type Component } from "vue";
import { Button, type ButtonShape, type ButtonSize, type ButtonVariant } from "../button";
import { INPUT_GROUP_COMPACT_BUTTON_SIZE } from "./input-group";
import { useInputGroupAddonContext, useInputGroupContext } from "./context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    icon?: Component;
    iconProps?: Record<string, unknown>;
    shape?: ButtonShape;
    size?: ButtonSize;
    tooltip?: string;
    tooltipSide?: "top" | "bottom" | "left" | "right";
    type?: "button" | "submit" | "reset";
    variant?: ButtonVariant;
  }>(),
  {
    disabled: false,
    iconProps: () => ({}),
    shape: "base",
    size: undefined,
    tooltipSide: "bottom",
    type: "button",
    variant: undefined,
  },
);

const attrs = useAttrs();
const slots = useSlots();
const context = useInputGroupContext();
const insideAddon = useInputGroupAddonContext();
const hasDefaultSlot = computed(() => Boolean(slots.default));
const effectiveSize = computed(() => {
  if (props.size) return props.size;
  const groupSize = context?.size.value ?? "base";

  return insideAddon.value ? INPUT_GROUP_COMPACT_BUTTON_SIZE[groupSize] : groupSize;
});
const effectiveVariant = computed(() => props.variant ?? "ghost");
const isDisabled = computed(() => Boolean(context?.disabled.value || props.disabled));
const ariaLabel = computed(() => attrs["aria-label"] ?? props.tooltip);
</script>

<template>
  <Button
    v-if="hasDefaultSlot"
    v-bind="attrs"
    :aria-label="ariaLabel"
    :data-tooltip="tooltip"
    :data-tooltip-side="tooltipSide"
    data-slot="input-group-button"
    class="phi-input-group-button"
    :disabled="isDisabled"
    :icon="icon"
    :icon-props="iconProps"
    :shape="shape"
    :size="effectiveSize"
    :type="type"
    :variant="effectiveVariant"
  >
    <slot />
  </Button>
  <Button
    v-else
    v-bind="attrs"
    :aria-label="ariaLabel"
    :data-tooltip="tooltip"
    :data-tooltip-side="tooltipSide"
    data-slot="input-group-button"
    class="phi-input-group-button"
    :disabled="isDisabled"
    :icon="icon"
    :icon-props="iconProps"
    :shape="shape"
    :size="effectiveSize"
    :type="type"
    :variant="effectiveVariant"
  />
</template>
