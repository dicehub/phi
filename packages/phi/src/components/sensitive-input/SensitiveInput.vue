<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, useSlots, watch } from "vue";
import { writeClipboardText } from "../../utils/clipboard";
import { Label } from "../label";
import {
  SENSITIVE_INPUT_DEFAULT_VARIANTS,
  createSensitiveInputId,
  normalizeSensitiveInputError,
  resolveSensitiveInputSize,
  resolveSensitiveInputVariant,
  type SensitiveInputError,
  type SensitiveInputMode,
  type SensitiveInputSize,
  type SensitiveInputVariant,
} from "./sensitive-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    autoComplete?: string;
    defaultValue?: string;
    description?: string;
    disabled?: boolean;
    error?: SensitiveInputError;
    id?: string;
    invalid?: boolean;
    label?: string;
    labelTooltip?: string;
    modelValue?: string;
    name?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    size?: SensitiveInputSize;
    value?: string;
    variant?: SensitiveInputVariant;
  }>(),
  {
    autoComplete: "off",
    defaultValue: "",
    disabled: false,
    readOnly: false,
    required: undefined,
    size: SENSITIVE_INPUT_DEFAULT_VARIANTS.size,
  },
);

const emit = defineEmits<{
  copy: [];
  valueChange: [value: string];
  "update:modelValue": [value: string];
}>();

const attrs = useAttrs();
const slots = useSlots();
const generatedId = createSensitiveInputId();
const inputRef = ref<HTMLInputElement | null>(null);
const controlRef = ref<HTMLDivElement | null>(null);
const internalValue = ref(props.defaultValue);
const copied = ref(false);
const mode = ref<SensitiveInputMode>((props.modelValue ?? props.value ?? props.defaultValue).length > 0 ? "masked" : "empty");
let copiedTimer: number | undefined;

const inputId = computed(() => props.id ?? generatedId);
const labelId = computed(() => `${inputId.value}-label`);
const descriptionId = computed(() => `${inputId.value}-description`);
const errorId = computed(() => `${inputId.value}-error`);
const maskedInstructionId = computed(() => `${inputId.value}-masked-instruction`);
const liveRegionId = computed(() => `${inputId.value}-live`);
const hasLabel = computed(() => Boolean(props.label || slots.label));
const hasDescription = computed(() => Boolean(props.description || slots.description));
const errorMessage = computed(() => normalizeSensitiveInputError(props.error));
const hasError = computed(() => Boolean(errorMessage.value || slots.error || props.invalid));
const shouldWrapField = computed(() => hasLabel.value || hasDescription.value || hasError.value);
const resolvedSize = computed(() => resolveSensitiveInputSize(props.size));
const resolvedVariant = computed(() => resolveSensitiveInputVariant(props.variant, props.error ?? (props.invalid ? "invalid" : undefined)));
const showOptional = computed(() => props.required === false);
const isControlled = computed(() => props.modelValue !== undefined || props.value !== undefined);
const currentValue = computed(() => props.modelValue ?? props.value ?? internalValue.value);
const hasValue = computed(() => currentValue.value.length > 0);
const isMaskedWithValue = computed(() => mode.value === "masked" && hasValue.value);
const showToggle = computed(() => !props.disabled && (mode.value === "revealed" || (mode.value === "empty" && hasValue.value)));
const inputType = computed(() => (mode.value === "revealed" ? "text" : "password"));
const ariaLabelFallback = computed(() => {
  if (typeof attrs["aria-label"] === "string") return attrs["aria-label"];
  if (props.label) return props.label;
  return "Sensitive value";
});
const describedBy = computed(() => {
  const ids = [
    attrs["aria-describedby"],
    isMaskedWithValue.value ? maskedInstructionId.value : undefined,
    liveRegionId.value,
    hasError.value ? errorId.value : undefined,
    !hasError.value && hasDescription.value ? descriptionId.value : undefined,
  ];

  return ids.filter(Boolean).join(" ") || undefined;
});
const ariaLabelledBy = computed(() =>
  hasLabel.value ? labelId.value : (attrs["aria-labelledby"] as string | undefined),
);
const passthroughAttrs = computed(() => {
  const { class: _class, style: _style, type: _type, value: _value, ...rest } = attrs;
  return rest;
});
const controlAttrs = computed(() =>
  isMaskedWithValue.value
    ? {
        role: "button",
        tabindex: props.disabled ? -1 : 0,
        "aria-label": `${ariaLabelFallback.value}, masked.`,
        "aria-describedby": `${maskedInstructionId.value} ${liveRegionId.value}`,
        "aria-disabled": props.disabled ? true : undefined,
      }
    : {},
);
const inputTabIndex = computed(() => (isMaskedWithValue.value ? -1 : undefined));
const toggleLabel = computed(() => (mode.value === "revealed" ? "Hide value" : "Reveal value"));

watch(
  () => props.defaultValue,
  (value) => {
    if (!isControlled.value && value !== undefined) {
      internalValue.value = value;
    }
  },
);

watch(hasValue, (value) => {
  if (!value) {
    mode.value = "empty";
  } else if (mode.value === "empty") {
    mode.value = "masked";
  }
});

watch(copied, (value) => {
  if (copiedTimer) window.clearTimeout(copiedTimer);
  if (value) {
    copiedTimer = window.setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
});

onBeforeUnmount(() => {
  if (copiedTimer) window.clearTimeout(copiedTimer);
});

const setValue = (value: string) => {
  if (!isControlled.value) {
    internalValue.value = value;
  }

  emit("update:modelValue", value);
  emit("valueChange", value);
};

const focusInput = async () => {
  await nextTick();
  inputRef.value?.focus();
};

const reveal = () => {
  if (props.disabled || !hasValue.value) return;
  mode.value = "revealed";
  if (!props.readOnly) {
    void focusInput();
  }
};

const mask = async () => {
  if (!hasValue.value) return;
  mode.value = "masked";
  await nextTick();
  controlRef.value?.focus();
};

const handleControlClick = (event: MouseEvent) => {
  if (!isMaskedWithValue.value || props.disabled) return;
  if (event.target instanceof HTMLElement && event.target.closest("button")) return;
  reveal();
};

const handleControlKeydown = (event: KeyboardEvent) => {
  if (props.disabled || !isMaskedWithValue.value) return;
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    reveal();
  }
};

const handleInput = (event: Event) => {
  const nextValue = (event.target as HTMLInputElement).value;
  if (mode.value === "empty" && nextValue.length > 0) {
    mode.value = "revealed";
  }
  setValue(nextValue);
};

const handleBlur = (event: FocusEvent) => {
  const nextTarget = event.relatedTarget;
  if (nextTarget instanceof Node && controlRef.value?.contains(nextTarget)) return;
  if (hasValue.value) {
    mode.value = "masked";
  }
};

const handleInputKeydown = (event: KeyboardEvent) => {
  if (mode.value === "revealed" && event.key === "Escape") {
    event.preventDefault();
    void mask();
  }
};

const toggleVisibility = (event: MouseEvent) => {
  event.stopPropagation();
  if (props.disabled) return;
  if (mode.value === "revealed") {
    void mask();
  } else if (hasValue.value) {
    reveal();
  }
};

const copyValue = async (event: MouseEvent) => {
  event.stopPropagation();
  if (!hasValue.value || props.disabled) return;

  if (!(await writeClipboardText(currentValue.value))) return;
  copied.value = true;
  emit("copy");
};
</script>

<template>
  <div
    v-if="shouldWrapField"
    class="phi-sensitive-input-field"
    :data-invalid="hasError ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
  >
    <label v-if="hasLabel" :id="labelId" class="phi-sensitive-input-label" :for="inputId">
      <Label as-content :show-optional="showOptional" :tooltip="labelTooltip">
        <slot name="label">{{ label }}</slot>
      </Label>
    </label>

    <div
      v-bind="controlAttrs"
      ref="controlRef"
      class="phi-sensitive-input-control"
      :class="[
        `phi-sensitive-input-control--${resolvedSize}`,
        `phi-sensitive-input-control--${resolvedVariant}`,
        {
          'phi-sensitive-input-control--masked': isMaskedWithValue,
          'phi-sensitive-input-control--revealed': mode === 'revealed',
          'phi-sensitive-input-control--disabled': disabled,
        },
        attrs.class,
      ]"
      :style="attrs.style"
      data-phi-component="SensitiveInput"
      :data-phi-part="isMaskedWithValue ? 'masked-container' : 'control'"
      @click="handleControlClick"
      @keydown="handleControlKeydown"
    >
      <input
        v-bind="passthroughAttrs"
        :id="inputId"
        ref="inputRef"
        class="phi-sensitive-input"
        :name="name"
        :type="inputType"
        :value="currentValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readOnly || isMaskedWithValue"
        :required="required"
        :autocomplete="autoComplete"
        :tabindex="inputTabIndex"
        :aria-hidden="isMaskedWithValue ? 'true' : undefined"
        :aria-labelledby="ariaLabelledBy"
        :aria-describedby="describedBy"
        :aria-invalid="hasError ? 'true' : undefined"
        @blur="handleBlur"
        @input="handleInput"
        @keydown="handleInputKeydown"
      />

      <span class="phi-sensitive-input-mask" aria-hidden="true">
        <span class="phi-sensitive-input-mask__stack">
          <span class="phi-sensitive-input-mask__bullets">••••••••</span>
          <span class="phi-sensitive-input-mask__reveal">Click to reveal</span>
        </span>
      </span>

      <button
        v-if="hasValue && !disabled"
        type="button"
        class="phi-sensitive-input-copy"
        data-phi-part="copy"
        :aria-label="copied ? 'Copied' : 'Copy to clipboard'"
        @click="copyValue"
        @keydown.stop
      >
        {{ copied ? "Copied" : "Copy" }}
      </button>

      <button
        type="button"
        class="phi-sensitive-input-toggle"
        :class="{ 'phi-sensitive-input-toggle--visible': showToggle }"
        data-phi-part="toggle-visibility"
        :aria-label="toggleLabel"
        :tabindex="showToggle ? 0 : -1"
        @click="toggleVisibility"
        @keydown.stop
      >
        <svg v-if="mode === 'revealed'" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M3 3l14 14" />
          <path d="M8.1 8.25a2.75 2.75 0 0 0 3.65 3.65" />
          <path d="M6.35 5.5C3.95 6.65 2.25 9 2.25 10s3.1 5.25 7.75 5.25a8.3 8.3 0 0 0 3.65-.82" />
          <path d="M9.1 4.8a8.7 8.7 0 0 1 .9-.05c4.65 0 7.75 4.25 7.75 5.25 0 .48-.72 1.66-1.9 2.78" />
        </svg>
        <svg v-else viewBox="0 0 20 20" aria-hidden="true">
          <path d="M2.25 10S5.35 4.75 10 4.75 17.75 10 17.75 10 14.65 15.25 10 15.25 2.25 10 2.25 10Z" />
          <circle cx="10" cy="10" r="2.75" />
        </svg>
      </button>
    </div>

    <p v-if="hasError" :id="errorId" class="phi-sensitive-input-error">
      <slot name="error">{{ errorMessage }}</slot>
    </p>
    <p v-else-if="hasDescription" :id="descriptionId" class="phi-sensitive-input-description">
      <slot name="description">{{ description }}</slot>
    </p>
  </div>

  <div
    v-else
    v-bind="controlAttrs"
    ref="controlRef"
    class="phi-sensitive-input-control"
    :class="[
      `phi-sensitive-input-control--${resolvedSize}`,
      `phi-sensitive-input-control--${resolvedVariant}`,
      {
        'phi-sensitive-input-control--masked': isMaskedWithValue,
        'phi-sensitive-input-control--revealed': mode === 'revealed',
        'phi-sensitive-input-control--disabled': disabled,
      },
      attrs.class,
    ]"
    :style="attrs.style"
    data-phi-component="SensitiveInput"
    :data-phi-part="isMaskedWithValue ? 'masked-container' : 'control'"
    @click="handleControlClick"
    @keydown="handleControlKeydown"
  >
    <input
      v-bind="passthroughAttrs"
      :id="inputId"
      ref="inputRef"
      class="phi-sensitive-input"
      :name="name"
      :type="inputType"
      :value="currentValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readOnly || isMaskedWithValue"
      :required="required"
      :autocomplete="autoComplete"
      :tabindex="inputTabIndex"
      :aria-hidden="isMaskedWithValue ? 'true' : undefined"
      :aria-describedby="describedBy"
      :aria-invalid="hasError ? 'true' : undefined"
      @blur="handleBlur"
      @input="handleInput"
      @keydown="handleInputKeydown"
    />

    <span class="phi-sensitive-input-mask" aria-hidden="true">
      <span class="phi-sensitive-input-mask__stack">
        <span class="phi-sensitive-input-mask__bullets">••••••••</span>
        <span class="phi-sensitive-input-mask__reveal">Click to reveal</span>
      </span>
    </span>

    <button
      v-if="hasValue && !disabled"
      type="button"
      class="phi-sensitive-input-copy"
      data-phi-part="copy"
      :aria-label="copied ? 'Copied' : 'Copy to clipboard'"
      @click="copyValue"
      @keydown.stop
    >
      {{ copied ? "Copied" : "Copy" }}
    </button>

    <button
      type="button"
      class="phi-sensitive-input-toggle"
      :class="{ 'phi-sensitive-input-toggle--visible': showToggle }"
      data-phi-part="toggle-visibility"
      :aria-label="toggleLabel"
      :tabindex="showToggle ? 0 : -1"
      @click="toggleVisibility"
      @keydown.stop
    >
      <svg v-if="mode === 'revealed'" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M3 3l14 14" />
        <path d="M8.1 8.25a2.75 2.75 0 0 0 3.65 3.65" />
        <path d="M6.35 5.5C3.95 6.65 2.25 9 2.25 10s3.1 5.25 7.75 5.25a8.3 8.3 0 0 0 3.65-.82" />
        <path d="M9.1 4.8a8.7 8.7 0 0 1 .9-.05c4.65 0 7.75 4.25 7.75 5.25 0 .48-.72 1.66-1.9 2.78" />
      </svg>
      <svg v-else viewBox="0 0 20 20" aria-hidden="true">
        <path d="M2.25 10S5.35 4.75 10 4.75 17.75 10 17.75 10 14.65 15.25 10 15.25 2.25 10 2.25 10Z" />
        <circle cx="10" cy="10" r="2.75" />
      </svg>
    </button>
  </div>

  <span v-if="isMaskedWithValue" :id="maskedInstructionId" class="phi-sr-only">
    Click or press Enter to reveal.
  </span>
  <span :id="liveRegionId" class="phi-sr-only" aria-live="polite">
    <template v-if="isMaskedWithValue">Value hidden</template>
    <template v-if="copied">Copied to clipboard</template>
  </span>
</template>

<style src="./sensitive-input.css"></style>
