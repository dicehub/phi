<script setup lang="ts">
import { computed, useAttrs, useSlots, type Component } from "vue";
import { Button, type ButtonShape } from "../button";
import { useToolbarContext } from "./context";
import { TOOLBAR_DEFAULT_SIZE } from "./toolbar";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    focusableWhenDisabled?: boolean;
    icon?: Component;
    iconProps?: Record<string, unknown>;
    loading?: boolean;
    shape?: ButtonShape;
    type?: "button" | "submit" | "reset";
  }>(),
  {
    disabled: false,
    focusableWhenDisabled: false,
    iconProps: () => ({}),
    loading: false,
    type: "button",
  },
);

const attrs = useAttrs();
const slots = useSlots();
const toolbar = useToolbarContext();
const resolvedSize = computed(() => toolbar?.size.value ?? TOOLBAR_DEFAULT_SIZE);
const resolvedShape = computed(() => props.shape ?? (!slots.default && props.icon ? "square" : "base"));
const nativeDisabled = computed(() => props.loading || (props.disabled && !props.focusableWhenDisabled));
const ariaDisabled = computed(() =>
  props.disabled && props.focusableWhenDisabled ? "true" : (attrs["aria-disabled"] as string | undefined),
);
const buttonAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([key]) => !["size", "variant", "tone", "aria-disabled"].includes(key)),
  ),
);

const blockDisabledInteraction = (event: MouseEvent) => {
  if (!props.disabled || !props.focusableWhenDisabled) return;

  event.preventDefault();
  event.stopImmediatePropagation();
};
</script>

<template>
  <Button
    v-bind="buttonAttrs"
    class="phi-toolbar__item phi-toolbar__button"
    variant="ghost"
    :size="resolvedSize"
    :shape="resolvedShape"
    :type="type"
    :disabled="nativeDisabled"
    :icon="icon"
    :icon-props="iconProps"
    :loading="loading"
    :aria-disabled="ariaDisabled"
    data-phi-component="Toolbar.Button"
    @click.capture="blockDisabledInteraction"
  >
    <slot />
  </Button>
</template>
