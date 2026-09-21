<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from "vue";
import { Label } from "../label";
import {
  INPUT_DEFAULT_SIZE,
  normalizeInputError,
  resolveInputSize,
  resolveInputVariant,
  type InputError,
  type InputSize,
  type InputVariant,
} from "../input";
import {
  createTagInputId,
  resolveTagInputLabels,
  splitTagInputValues,
  type TagInputLabels,
} from "./tag-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    autoComplete?: string;
    defaultValue?: string[];
    description?: string;
    disabled?: boolean;
    error?: InputError;
    id?: string;
    invalid?: boolean;
    label?: string;
    labelTooltip?: string;
    labels?: TagInputLabels;
    maxValues?: number;
    modelValue?: string[];
    name?: string;
    placeholder?: string;
    required?: boolean;
    size?: InputSize;
    validateValue?: (value: string, acceptedValues: string[]) => boolean;
    variant?: InputVariant;
  }>(),
  {
    autoComplete: "off",
    defaultValue: () => [],
    disabled: false,
    required: undefined,
    size: INPUT_DEFAULT_SIZE,
  },
);

const emit = defineEmits<{
  valueChange: [value: string[]];
  "update:modelValue": [value: string[]];
}>();

const attrs = useAttrs();
const slots = useSlots();
const inputRef = ref<HTMLInputElement | null>(null);
const generatedId = createTagInputId();
const internalValue = ref<string[]>([...props.defaultValue]);
const inputValue = ref("");
const message = ref<string>();

const commitKeys = ["Enter", ",", "Tab"];
const labels = computed(() => resolveTagInputLabels(props.labels));
const values = computed(() => props.modelValue ?? internalValue.value);
const inputId = computed(() => props.id ?? generatedId);
const labelId = computed(() => `${inputId.value}-label`);
const descriptionId = computed(() => `${inputId.value}-description`);
const errorId = computed(() => `${inputId.value}-error`);
const hasLabel = computed(() => Boolean(props.label || slots.label));
const hasDescription = computed(() => Boolean(props.description || slots.description));
const errorMessage = computed(() => normalizeInputError(props.error) ?? message.value);
const hasError = computed(() => Boolean(errorMessage.value || slots.error || props.invalid));
const resolvedSize = computed(() => resolveInputSize(props.size));
const resolvedVariant = computed(() =>
  resolveInputVariant(props.variant, props.error ?? message.value ?? (props.invalid ? "invalid" : undefined)),
);
const showOptional = computed(() => props.required === false);
const describedBy = computed(() => {
  const ids = [
    attrs["aria-describedby"],
    hasError.value ? errorId.value : undefined,
    !hasError.value && hasDescription.value ? descriptionId.value : undefined,
  ];

  return ids.filter(Boolean).join(" ") || undefined;
});
const ariaLabelledBy = computed(() =>
  hasLabel.value ? labelId.value : (attrs["aria-labelledby"] as string | undefined),
);
const ariaLabel = computed(() => {
  if (typeof attrs["aria-label"] === "string") return attrs["aria-label"];
  if (hasLabel.value) return undefined;

  return labels.value.input;
});
const formId = computed(() => (typeof attrs.form === "string" ? attrs.form : undefined));
const passthroughAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    onBlur: _onBlur,
    onKeydown: _onKeydown,
    onPaste: _onPaste,
    ...rest
  } = attrs;

  return rest;
});

const setValues = (nextValue: string[]) => {
  const currentValue = values.value;
  const isUnchanged =
    nextValue.length === currentValue.length && nextValue.every((item, index) => item === currentValue[index]);
  if (isUnchanged) return;

  if (props.modelValue === undefined) internalValue.value = nextValue;
  emit("update:modelValue", nextValue);
  emit("valueChange", nextValue);
};

const commit = (rawValue: string) => {
  const entries = splitTagInputValues(rawValue);
  const nextValues = [...values.value];

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    if (nextValues.includes(entry)) continue;

    if (props.maxValues !== undefined && nextValues.length >= props.maxValues) {
      inputValue.value = entries.slice(index).join(", ");
      message.value = labels.value.maxValuesReached(props.maxValues);
      setValues(nextValues);
      return false;
    }

    if (props.validateValue && !props.validateValue(entry, nextValues)) {
      inputValue.value = entries.slice(index).join(", ");
      message.value = labels.value.invalidValue(entry);
      setValues(nextValues);
      return false;
    }

    nextValues.push(entry);
  }

  setValues(nextValues);
  inputValue.value = "";
  message.value = undefined;
  return true;
};

const removeValue = (value: string) => {
  setValues(values.value.filter((item) => item !== value));
};

const handleInput = (event: Event) => {
  inputValue.value = (event.target as HTMLInputElement).value;
  message.value = undefined;
};

const handleBlur = (event: FocusEvent) => {
  (attrs.onBlur as ((event: FocusEvent) => void) | undefined)?.(event);
  if (!event.defaultPrevented) commit(inputValue.value);
};

const handleKeydown = (event: KeyboardEvent) => {
  (attrs.onKeydown as ((event: KeyboardEvent) => void) | undefined)?.(event);
  if (event.defaultPrevented) return;

  if (event.key === "Backspace" && inputValue.value === "") {
    if (values.value.length > 0) setValues(values.value.slice(0, -1));
    return;
  }

  if (inputValue.value === "" || !commitKeys.includes(event.key)) return;
  const didCommit = commit(inputValue.value);
  if (event.key !== "Tab" || didCommit) event.preventDefault();
};

const handlePaste = (event: ClipboardEvent) => {
  (attrs.onPaste as ((event: ClipboardEvent) => void) | undefined)?.(event);
  if (event.defaultPrevented) return;

  const text = event.clipboardData?.getData("text") ?? "";
  if (!/[\n,]/.test(text)) return;

  event.preventDefault();
  commit(text);
};

defineExpose({ input: inputRef });
</script>

<template>
  <div
    class="phi-tag-input-field"
    :class="attrs.class"
    :style="attrs.style"
    :data-invalid="hasError ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
  >
    <label v-if="hasLabel" :id="labelId" class="phi-tag-input-label" :for="inputId">
      <Label as-content :show-optional="showOptional" :tooltip="labelTooltip">
        <slot name="label">{{ label }}</slot>
      </Label>
    </label>

    <div
      class="phi-tag-input"
      :class="[`phi-tag-input--${resolvedSize}`, `phi-tag-input--${resolvedVariant}`]"
      data-phi-component="TagInput"
    >
      <span v-for="item in values" :key="item" class="phi-tag-input-chip">
        <span class="phi-tag-input-chip__label">{{ item }}</span>
        <button
          type="button"
          class="phi-tag-input-chip__remove"
          :aria-label="labels.removeValue(item)"
          :disabled="disabled"
          @mousedown.prevent
          @click.stop="removeValue(item)"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="m4.25 4.25 7.5 7.5M11.75 4.25l-7.5 7.5"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </span>

      <input
        v-bind="passthroughAttrs"
        ref="inputRef"
        :id="inputId"
        class="phi-tag-input__input"
        :value="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :required="required && values.length === 0"
        :aria-label="ariaLabel"
        :aria-labelledby="ariaLabelledBy"
        :aria-describedby="describedBy"
        :aria-invalid="hasError ? 'true' : undefined"
        @blur="handleBlur"
        @input="handleInput"
        @keydown="handleKeydown"
        @paste="handlePaste"
      />
      <input
        v-for="item in values"
        :key="`form-${item}`"
        type="hidden"
        :name="name"
        :value="item"
        :form="formId"
        :disabled="disabled"
      />
    </div>

    <p v-if="hasError" :id="errorId" class="phi-tag-input-error">
      <slot name="error">{{ errorMessage }}</slot>
    </p>
    <p v-else-if="hasDescription" :id="descriptionId" class="phi-tag-input-description">
      <slot name="description">{{ description }}</slot>
    </p>
  </div>
</template>

<style src="./tag-input.css"></style>
