<script setup lang="ts">
import { computed, ref } from "vue";
import { provideRadioGroupContext } from "./radio-context";
import { ChoiceGroupContent } from "../../utils/choice-group";
import RadioLegend from "./RadioLegend.vue";
import {
  RADIO_DEFAULT_VARIANTS,
  createRadioGroupName,
  isRadioAppearance,
  isRadioOrientation,
  type RadioAppearance,
  type RadioControlPosition,
  type RadioOrientation,
  type RadioValue,
  type RadioValueChangeDetails,
} from "./radio";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    appearance?: RadioAppearance;
    controlPosition?: RadioControlPosition;
    defaultValue?: RadioValue;
    description?: string;
    disabled?: boolean;
    error?: string;
    invalid?: boolean;
    legend?: string;
    modelValue?: RadioValue;
    name?: string;
    orientation?: RadioOrientation;
    value?: RadioValue;
  }>(),
  {
    appearance: RADIO_DEFAULT_VARIANTS.appearance,
    defaultValue: undefined,
    disabled: undefined,
    invalid: undefined,
    modelValue: undefined,
    orientation: "vertical",
    value: undefined,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: RadioValue];
  valueChange: [value: RadioValue, details: RadioValueChangeDetails];
}>();

const generatedName = createRadioGroupName();
const internalValue = ref<RadioValue | undefined>(props.defaultValue);
const selectedValue = computed(() => props.modelValue ?? props.value ?? internalValue.value);
const resolvedName = computed(() => props.name ?? generatedName);
const resolvedAppearance = computed(() =>
  isRadioAppearance(props.appearance) ? props.appearance : RADIO_DEFAULT_VARIANTS.appearance,
);
const resolvedOrientation = computed(() =>
  resolvedAppearance.value === "segmented" ? "horizontal" : isRadioOrientation(props.orientation) ? props.orientation : "vertical",
);
const isInvalid = computed(() => props.invalid || Boolean(props.error));

const setValue = (value: RadioValue, event: Event) => {
  if (props.disabled) return undefined;

  if (props.modelValue === undefined && props.value === undefined) {
    internalValue.value = value;
  }

  const details = { value, event };
  emit("update:modelValue", value);
  emit("valueChange", value, details);
  return details;
};

provideRadioGroupContext({
  appearance: resolvedAppearance,
  controlPosition: computed(() => props.controlPosition),
  disabled: computed(() => props.disabled),
  isSelected: (value: RadioValue) => Object.is(selectedValue.value, value),
  name: resolvedName,
  orientation: resolvedOrientation,
  setValue,
});
</script>

<template>
  <fieldset
    v-bind="$attrs"
    class="phi-radio-group"
    :class="[
      `phi-radio-group--${resolvedOrientation}`,
      `phi-radio-group--${resolvedAppearance}`,
      {
        'phi-radio-group--disabled': disabled,
        'phi-radio-group--invalid': isInvalid,
      },
    ]"
    :data-orientation="resolvedOrientation"
    :data-appearance="resolvedAppearance"
    :disabled="disabled"
    :aria-invalid="isInvalid ? 'true' : undefined"
  >
    <ChoiceGroupContent :legend="legend" :legend-component="RadioLegend" class-prefix="phi-radio-group">
      <slot />
    </ChoiceGroupContent>
    <p v-if="error" class="phi-radio-group__error">{{ error }}</p>
    <p v-if="description" class="phi-radio-group__description">{{ description }}</p>
  </fieldset>
</template>

<style src="./radio.css"></style>
