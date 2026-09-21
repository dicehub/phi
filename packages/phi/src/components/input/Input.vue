<script setup lang="ts">
import { computed, useAttrs, useSlots } from "vue";
import {
  INPUT_DEFAULT_SIZE,
  normalizeInputError,
  resolveInputSize,
  resolveInputVariant,
  type InputError,
  type InputSize,
  type InputVariant,
} from "./input";

defineOptions({ inheritAttrs: false });

type InputModelValue = string | number;
type PhiInputGlobal = typeof globalThis & {
  __phiInputId?: number;
};

const nextInputId = () => {
  const phiGlobal = globalThis as PhiInputGlobal;

  phiGlobal.__phiInputId = (phiGlobal.__phiInputId ?? 0) + 1;
  return `phi-input-${phiGlobal.__phiInputId}`;
};

const props = withDefaults(
  defineProps<{
    defaultValue?: InputModelValue;
    description?: string;
    disabled?: boolean;
    error?: InputError;
    id?: string;
    invalid?: boolean;
    label?: string;
    labelTooltip?: string;
    modelValue?: InputModelValue;
    name?: string;
    passwordManagerIgnore?: boolean;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    size?: InputSize;
    type?: string;
    variant?: InputVariant;
  }>(),
  {
    disabled: false,
    readOnly: false,
    required: undefined,
    size: INPUT_DEFAULT_SIZE,
    type: "text",
  },
);

const emit = defineEmits<{
  valueChange: [value: string];
  "update:modelValue": [value: string];
}>();

const attrs = useAttrs();
const slots = useSlots();
const generatedId = nextInputId();
const inputId = computed(() => props.id ?? generatedId);
const labelId = computed(() => `${inputId.value}-label`);
const descriptionId = computed(() => `${inputId.value}-description`);
const errorId = computed(() => `${inputId.value}-error`);
const hasLabel = computed(() => Boolean(props.label || slots.label));
const hasDescription = computed(() => Boolean(props.description || slots.description));
const errorMessage = computed(() => normalizeInputError(props.error));
const hasError = computed(() => Boolean(errorMessage.value || slots.error || props.invalid));
const shouldWrapField = computed(() => hasLabel.value || hasDescription.value || hasError.value);
const resolvedSize = computed(() => resolveInputSize(props.size));
const variantError = computed(() => props.error ?? (props.invalid ? "invalid" : undefined));
const resolvedVariant = computed(() => resolveInputVariant(props.variant, variantError.value));
const showOptional = computed(() => props.required === false);
const describedBy = computed(() => {
  const ids = [
    attrs["aria-describedby"],
    hasError.value ? errorId.value : undefined,
    !hasError.value && hasDescription.value ? descriptionId.value : undefined,
  ];

  return ids.filter(Boolean).join(" ") || undefined;
});

const inputValueAttrs = computed(() => {
  if (props.modelValue !== undefined) return { value: props.modelValue };
  if (props.defaultValue !== undefined) return { value: props.defaultValue };
  return {};
});

const passwordManagerAttrs = computed(() =>
  props.passwordManagerIgnore
    ? {
        "data-1p-ignore": "true",
        "data-bwignore": "true",
        "data-form-type": "other",
        "data-lpignore": "true",
      }
    : {},
);
const inputPassthroughAttrs = computed(() => ({
  ...attrs,
  ...inputValueAttrs.value,
  ...passwordManagerAttrs.value,
}));
const ariaLabelledBy = computed(() =>
  hasLabel.value ? labelId.value : (attrs["aria-labelledby"] as string | undefined),
);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;

  emit("update:modelValue", target.value);
  emit("valueChange", target.value);
};
</script>

<template>
  <div
    v-if="shouldWrapField"
    class="phi-input-field"
    :data-invalid="hasError ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
  >
    <label v-if="hasLabel" :id="labelId" class="phi-input-label" :for="inputId">
      <span class="phi-input-label__content">
        <slot name="label">{{ label }}</slot>
        <span v-if="showOptional" class="phi-input-label__optional">(optional)</span>
        <span
          v-if="labelTooltip"
          class="phi-input-label__tooltip"
          aria-label="More information"
          :data-tooltip="labelTooltip"
          tabindex="0"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="6.25" />
            <path d="M8 7.25v4" />
            <path d="M8 4.65h.01" />
          </svg>
        </span>
      </span>
    </label>

    <input
      v-bind="inputPassthroughAttrs"
      :id="inputId"
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readOnly"
      :required="required"
      :aria-labelledby="ariaLabelledBy"
      :aria-describedby="describedBy"
      :aria-invalid="hasError ? 'true' : undefined"
      class="phi-input"
      :class="[
        `phi-input--${resolvedSize}`,
        `phi-input--${resolvedVariant}`,
        { 'keeper-ignore': passwordManagerIgnore },
      ]"
      @input="handleInput"
    />

    <p v-if="hasError" :id="errorId" class="phi-input-error">
      <slot name="error">{{ errorMessage }}</slot>
    </p>
    <p v-else-if="hasDescription" :id="descriptionId" class="phi-input-description">
      <slot name="description">{{ description }}</slot>
    </p>
  </div>

  <input
    v-else
    v-bind="inputPassthroughAttrs"
    :id="inputId"
    :name="name"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readOnly"
    :required="required"
    :aria-describedby="describedBy"
    :aria-invalid="hasError ? 'true' : undefined"
    class="phi-input"
    :class="[
      `phi-input--${resolvedSize}`,
      `phi-input--${resolvedVariant}`,
      { 'keeper-ignore': passwordManagerIgnore },
    ]"
    @input="handleInput"
  />
</template>

<style src="./input.css"></style>
