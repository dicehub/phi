<script setup lang="ts">
import { computed, useSlots } from "vue";
import { useRadioGroupContext } from "./radio-context";
import {
  RADIO_DEFAULT_VARIANTS,
  isRadioAppearance,
  isRadioVariant,
  type RadioAppearance,
  type RadioValue,
  type RadioValueChangeDetails,
  type RadioVariant,
} from "./radio";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    appearance?: RadioAppearance;
    description?: string;
    disabled?: boolean;
    label?: string;
    name?: string;
    value: RadioValue;
    variant?: RadioVariant;
  }>(),
  {
    appearance: undefined,
    disabled: undefined,
    variant: RADIO_DEFAULT_VARIANTS.variant,
  },
);

const emit = defineEmits<{
  valueChange: [value: RadioValue, details: RadioValueChangeDetails];
}>();

const slots = useSlots();
const groupContext = useRadioGroupContext();
const resolvedAppearance = computed(() => {
  if (isRadioAppearance(props.appearance)) return props.appearance;
  return groupContext?.appearance.value ?? RADIO_DEFAULT_VARIANTS.appearance;
});
const resolvedVariant = computed(() =>
  isRadioVariant(props.variant) ? props.variant : RADIO_DEFAULT_VARIANTS.variant,
);
const isCard = computed(() => resolvedAppearance.value === "card");
const isJoined = computed(() => isCard.value && groupContext?.appearance.value === "card");
const effectiveControlPosition = computed(() =>
  groupContext?.controlPosition.value ?? (isCard.value ? "end" : "start"),
);
const isDisabled = computed(() => props.disabled ?? groupContext?.disabled.value);
const isSelected = computed(() => groupContext?.isSelected(props.value) ?? false);
const resolvedName = computed(() => props.name ?? groupContext?.name.value);
const hasLabel = computed(() => Boolean(props.label || slots.default || slots.label));
const hasDescription = computed(() => Boolean(props.description || slots.description));
const stringValue = computed(() => String(props.value));

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.checked || isDisabled.value) return;

  const details = groupContext?.setValue(props.value, event) ?? { value: props.value, event };
  emit("valueChange", props.value, details);
};
</script>

<template>
  <label
    v-bind="$attrs"
    class="phi-radio phi-radio-item"
    :class="[
      `phi-radio--${resolvedVariant}`,
      `phi-radio--appearance-${resolvedAppearance}`,
      `phi-radio--control-${effectiveControlPosition}`,
      {
        'phi-radio--disabled': isDisabled,
        'phi-radio--checked': isSelected,
        'phi-radio--joined': isJoined,
      },
    ]"
    :data-appearance="resolvedAppearance"
    :data-state="isSelected ? 'checked' : 'unchecked'"
  >
    <input
      class="phi-radio__input"
      type="radio"
      :checked="isSelected"
      :disabled="isDisabled"
      :name="resolvedName"
      :value="stringValue"
      @change="handleChange"
    />
    <span class="phi-radio__control" :data-state="isSelected ? 'checked' : 'unchecked'" aria-hidden="true">
      <span class="phi-radio__dot" />
    </span>
    <span class="phi-radio__content">
      <span v-if="hasLabel" class="phi-radio__label">
        <slot name="label">
          <slot>{{ label }}</slot>
        </slot>
      </span>
      <span v-if="isCard && hasDescription" class="phi-radio__description">
        <slot name="description">{{ description }}</slot>
      </span>
    </span>
  </label>
</template>

<style src="./radio.css"></style>
