<script setup lang="ts">
import { computed, ref, useSlots } from "vue";
import {
  SWITCH_DEFAULT_VARIANTS,
  isSwitchSize,
  isSwitchVariant,
  type SwitchCheckedChangeDetails,
  type SwitchSize,
  type SwitchVariant,
} from "./switch";
import { useSwitchGroupContext } from "./switch-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    checked?: boolean;
    className?: string;
    disabled?: boolean;
    label: string;
    size?: SwitchSize;
    transitioning?: boolean;
    variant?: SwitchVariant;
  }>(),
  {
    checked: undefined,
    className: undefined,
    disabled: undefined,
    size: SWITCH_DEFAULT_VARIANTS.size,
    transitioning: undefined,
    variant: SWITCH_DEFAULT_VARIANTS.variant,
  },
);

const emit = defineEmits<{
  checkedChange: [details: SwitchCheckedChangeDetails];
  "update:checked": [checked: boolean];
}>();

const slots = useSlots();
const groupContext = useSwitchGroupContext();
const internalChecked = ref(false);

const resolvedSize = computed(() => (isSwitchSize(props.size) ? props.size : SWITCH_DEFAULT_VARIANTS.size));
const resolvedVariant = computed(() =>
  isSwitchVariant(props.variant) ? props.variant : SWITCH_DEFAULT_VARIANTS.variant,
);
const currentChecked = computed(() => props.checked ?? internalChecked.value);
const isDisabled = computed(() => props.disabled ?? groupContext?.disabled.value);
const effectiveControlFirst = computed(() => groupContext?.controlFirst.value ?? true);
const dataState = computed(() => (currentChecked.value ? "checked" : "unchecked"));

const setChecked = (checked: boolean, event: Event) => {
  if (isDisabled.value) return;

  if (props.checked === undefined) {
    internalChecked.value = checked;
  }

  emit("update:checked", checked);
  emit("checkedChange", { checked, event });
};

const toggle = (event: Event) => {
  setChecked(!currentChecked.value, event);
};
</script>

<template>
  <span
    v-bind="$attrs"
    class="phi-switch-item"
    :class="[
      className,
      {
        'phi-switch-item--label-first': !effectiveControlFirst,
        'phi-switch-item--disabled': isDisabled,
      },
    ]"
    data-phi-component="Switch"
    data-phi-part="item-label"
  >
    <button
      type="button"
      role="switch"
      class="phi-switch"
      :class="[`phi-switch--${resolvedVariant}`, `phi-switch--${resolvedSize}`]"
      :aria-busy="transitioning || undefined"
      :aria-checked="currentChecked"
      :aria-label="label"
      :data-size="resolvedSize"
      :data-state="dataState"
      :data-variant="resolvedVariant"
      :disabled="isDisabled"
      data-phi-component="Switch"
      data-phi-part="item"
      @click="toggle"
    >
      <span class="phi-switch__thumb" data-phi-part="thumb" />
    </button>
    <span class="phi-switch-item__label" @click="toggle">
      <slot name="label">
        <slot>{{ label }}</slot>
      </slot>
    </span>
  </span>
</template>

<style src="./switch.css"></style>
