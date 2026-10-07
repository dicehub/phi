<script setup lang="ts">
import { useLocale } from "../../utils/locale-provider";
import { computed, onBeforeUnmount, ref, useAttrs, useSlots, watch } from "vue";
import {
  INPUT_DEFAULT_SIZE,
  normalizeInputError,
  resolveInputSize,
  resolveInputVariant,
  type InputError,
  type InputSize,
  type InputVariant,
} from "./input";
import {
  calculateInputAreaAutoResizeLayout,
  parseInputAreaCssNumber,
  resolveInputAreaLineHeight,
  resolveInputAreaMaxRows,
  resolveInputAreaRowCount,
} from "./input-area";

defineOptions({ inheritAttrs: false });

type PhiInputAreaGlobal = typeof globalThis & {
  __phiInputAreaId?: number;
};

const nextInputAreaId = () => {
  const phiGlobal = globalThis as PhiInputAreaGlobal;

  phiGlobal.__phiInputAreaId = (phiGlobal.__phiInputAreaId ?? 0) + 1;
  return `phi-input-area-${phiGlobal.__phiInputAreaId}`;
};

const props = withDefaults(
  defineProps<{
    autoResize?: boolean;
    defaultValue?: string;
    description?: string;
    disabled?: boolean;
    error?: InputError;
    id?: string;
    invalid?: boolean;
    label?: string;
    labelTooltip?: string;
    maxRows?: number;
    minRows?: number;
    modelValue?: string;
    name?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    size?: InputSize;
    variant?: InputVariant;
  }>(),
  {
    autoResize: false,
    disabled: false,
    minRows: 1,
    readOnly: false,
    required: undefined,
    size: INPUT_DEFAULT_SIZE,
  },
);

const emit = defineEmits<{
  valueChange: [value: string];
  "update:modelValue": [value: string];
}>();

const attrs = useAttrs();
const locale = useLocale();
const slots = useSlots();
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const generatedId = nextInputAreaId();
const inputAreaId = computed(() => props.id ?? generatedId);
const labelId = computed(() => `${inputAreaId.value}-label`);
const descriptionId = computed(() => `${inputAreaId.value}-description`);
const errorId = computed(() => `${inputAreaId.value}-error`);
const hasLabel = computed(() => Boolean(props.label || slots.label));
const hasDescription = computed(() => Boolean(props.description || slots.description));
const errorMessage = computed(() => normalizeInputError(props.error));
const hasError = computed(() => Boolean(errorMessage.value || slots.error || props.invalid));
const shouldWrapField = computed(() => hasLabel.value || hasDescription.value || hasError.value);
const resolvedSize = computed(() => resolveInputSize(props.size));
const resolvedMinRows = computed(() => resolveInputAreaRowCount(props.minRows));
const resolvedMaxRows = computed(() => resolveInputAreaMaxRows(props.maxRows, resolvedMinRows.value));
const textareaRows = computed(() =>
  props.autoResize ? resolvedMinRows.value : (attrs.rows as string | number | undefined),
);
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

const textareaValueAttrs = computed(() => {
  if (props.modelValue !== undefined) return { value: props.modelValue };
  if (props.defaultValue !== undefined) return { value: props.defaultValue };
  return {};
});

const textareaPassthroughAttrs = computed(() => ({
  ...Object.fromEntries(Object.entries(attrs).filter(([name]) => name !== "rows")),
  ...textareaValueAttrs.value,
}));
const ariaLabelledBy = computed(() =>
  hasLabel.value ? labelId.value : (attrs["aria-labelledby"] as string | undefined),
);

let resizeObserver: ResizeObserver | undefined;
let observedTextarea: HTMLTextAreaElement | undefined;
let originalInlineStyles: { height: string; overflowY: string } | undefined;
let lastObservedWidth = 0;

const restoreAutoResizeStyles = () => {
  if (observedTextarea && originalInlineStyles) {
    observedTextarea.style.height = originalInlineStyles.height;
    observedTextarea.style.overflowY = originalInlineStyles.overflowY;
  }

  resizeObserver?.disconnect();
  resizeObserver = undefined;
  observedTextarea = undefined;
  originalInlineStyles = undefined;
  lastObservedWidth = 0;
};

const resizeInputArea = (textarea = textareaRef.value) => {
  if (!props.autoResize || !textarea || typeof window === "undefined") return;

  const style = window.getComputedStyle(textarea);
  const borders = parseInputAreaCssNumber(style.borderTopWidth) + parseInputAreaCssNumber(style.borderBottomWidth);
  const padding = parseInputAreaCssNumber(style.paddingTop) + parseInputAreaCssNumber(style.paddingBottom);

  textarea.style.height = "auto";

  const layout = calculateInputAreaAutoResizeLayout({
    borders,
    isBorderBox: style.boxSizing === "border-box",
    lineHeight: resolveInputAreaLineHeight(style.lineHeight, style.fontSize),
    maxRows: resolvedMaxRows.value,
    minRows: resolvedMinRows.value,
    padding,
    scrollHeight: textarea.scrollHeight,
  });

  textarea.style.overflowY = layout.overflowY;
  textarea.style.height = `${layout.height}px`;
};

const startAutoResize = (textarea: HTMLTextAreaElement) => {
  restoreAutoResizeStyles();
  observedTextarea = textarea;
  originalInlineStyles = {
    height: textarea.style.height,
    overflowY: textarea.style.overflowY,
  };
  lastObservedWidth = textarea.clientWidth;

  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => {
      if (textarea.clientWidth === lastObservedWidth) return;
      lastObservedWidth = textarea.clientWidth;
      resizeInputArea(textarea);
    });
    resizeObserver.observe(textarea);
  }

  resizeInputArea(textarea);
};

watch(
  [() => props.autoResize, textareaRef],
  ([autoResize, textarea]) => {
    restoreAutoResizeStyles();
    if (autoResize && textarea) startAutoResize(textarea);
  },
  { flush: "post", immediate: true },
);

watch(
  () => [
    props.modelValue,
    props.defaultValue,
    props.minRows,
    props.maxRows,
    props.size,
    props.variant,
    props.error,
    props.invalid,
    attrs.class,
    attrs.style,
  ],
  () => resizeInputArea(),
  { deep: true, flush: "post" },
);

onBeforeUnmount(restoreAutoResizeStyles);

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;

  emit("update:modelValue", target.value);
  emit("valueChange", target.value);
  resizeInputArea(target);
};
</script>

<template>
  <div
    v-if="shouldWrapField"
    class="phi-input-field"
    :data-invalid="hasError ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
  >
    <label v-if="hasLabel" :id="labelId" class="phi-input-label" :for="inputAreaId">
      <span class="phi-input-label__content">
        <slot name="label">{{ label }}</slot>
        <span v-if="showOptional" class="phi-input-label__optional">{{ locale.label.optional }}</span>
        <span
          v-if="labelTooltip"
          class="phi-input-label__tooltip"
          :aria-label="locale.label.tooltip"
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

    <textarea
      ref="textareaRef"
      v-bind="textareaPassthroughAttrs"
      :id="inputAreaId"
      :name="name"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readOnly"
      :required="required"
      :rows="textareaRows"
      :aria-labelledby="ariaLabelledBy"
      :aria-describedby="describedBy"
      :aria-invalid="hasError ? 'true' : undefined"
      class="phi-input-area"
      :class="[
        `phi-input-area--${resolvedSize}`,
        `phi-input-area--${resolvedVariant}`,
        { 'phi-input-area--auto-resize': autoResize },
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

  <textarea
    ref="textareaRef"
    v-else
    v-bind="textareaPassthroughAttrs"
    :id="inputAreaId"
    :name="name"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readOnly"
    :required="required"
    :rows="textareaRows"
    :aria-describedby="describedBy"
    :aria-invalid="hasError ? 'true' : undefined"
    class="phi-input-area"
    :class="[
      `phi-input-area--${resolvedSize}`,
      `phi-input-area--${resolvedVariant}`,
      { 'phi-input-area--auto-resize': autoResize },
    ]"
    @input="handleInput"
  />
</template>

<style src="./input.css"></style>
<style src="./input-area.css"></style>
