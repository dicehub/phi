<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from "vue";
import { Label } from "../label";
import {
  SWITCH_DEFAULT_VARIANTS,
  isSwitchSize,
  isSwitchVariant,
  type SwitchCheckedChangeDetails,
  type SwitchSize,
  type SwitchVariant,
} from "./switch";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    ariaLabel?: string;
    checked?: boolean;
    className?: string;
    controlFirst?: boolean;
    disabled?: boolean;
    id?: string;
    label?: string;
    labelTooltip?: string;
    required?: boolean;
    size?: SwitchSize;
    transitioning?: boolean;
    variant?: SwitchVariant;
  }>(),
  {
    ariaLabel: undefined,
    checked: undefined,
    className: undefined,
    controlFirst: true,
    disabled: undefined,
    id: undefined,
    label: undefined,
    labelTooltip: undefined,
    required: undefined,
    size: SWITCH_DEFAULT_VARIANTS.size,
    transitioning: undefined,
    variant: SWITCH_DEFAULT_VARIANTS.variant,
  },
);

const emit = defineEmits<{
  checkedChange: [details: SwitchCheckedChangeDetails];
  "update:checked": [checked: boolean];
}>();

const attrs = useAttrs();
const slots = useSlots();
const internalChecked = ref(false);

const resolvedSize = computed(() => (isSwitchSize(props.size) ? props.size : SWITCH_DEFAULT_VARIANTS.size));
const resolvedVariant = computed(() =>
  isSwitchVariant(props.variant) ? props.variant : SWITCH_DEFAULT_VARIANTS.variant,
);
const currentChecked = computed(() => props.checked ?? internalChecked.value);
const hasLabel = computed(() => Boolean(props.label || slots.default || slots.label));
const dataState = computed(() => (currentChecked.value ? "checked" : "unchecked"));
const rootClass = computed(() => attrs.class);
const buttonAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});
const accessibleLabel = computed(() => {
  const attrLabel = attrs["aria-label"];
  if (typeof attrLabel === "string") return attrLabel;
  if (props.ariaLabel) return props.ariaLabel;
  return props.label ?? "Switch";
});

const setChecked = (checked: boolean, event: Event) => {
  if (props.disabled) return;

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
    v-if="hasLabel"
    class="phi-switch-field"
    :class="[
      rootClass,
      {
        'phi-switch-field--label-first': !controlFirst,
        'phi-switch-field--disabled': disabled,
      },
    ]"
    data-phi-component="Switch"
    data-phi-part="field"
  >
    <button
      v-bind="buttonAttrs"
      :id="id"
      type="button"
      role="switch"
      class="phi-switch"
      :class="[className, `phi-switch--${resolvedVariant}`, `phi-switch--${resolvedSize}`]"
      :aria-busy="transitioning || undefined"
      :aria-checked="currentChecked"
      :aria-label="accessibleLabel"
      :data-size="resolvedSize"
      :data-state="dataState"
      :data-variant="resolvedVariant"
      :disabled="disabled"
      data-phi-component="Switch"
      data-phi-part="control"
      @click="toggle"
    >
      <span class="phi-switch__thumb" data-phi-part="thumb" />
    </button>
    <span class="phi-switch-field__label" @click="toggle">
      <Label as-content :show-optional="required === false" :tooltip="labelTooltip">
        <slot name="label">
          <slot>{{ label }}</slot>
        </slot>
      </Label>
    </span>
  </span>

  <button
    v-else
    v-bind="buttonAttrs"
    :id="id"
    type="button"
    role="switch"
    class="phi-switch"
    :class="[rootClass, className, `phi-switch--${resolvedVariant}`, `phi-switch--${resolvedSize}`]"
    :aria-busy="transitioning || undefined"
    :aria-checked="currentChecked"
    :aria-label="accessibleLabel"
    :data-size="resolvedSize"
    :data-state="dataState"
    :data-variant="resolvedVariant"
    :disabled="disabled"
    data-phi-component="Switch"
    data-phi-part="control"
    @click="toggle"
  >
    <span class="phi-switch__thumb" data-phi-part="thumb" />
  </button>
</template>

<style src="./switch.css"></style>
