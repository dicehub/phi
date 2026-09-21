<script setup lang="ts">
import { computed, useAttrs, useSlots } from "vue";
import {
  INPUT_DEFAULT_SIZE,
  normalizeInputError,
  resolveInputSize,
  type InputError,
  type InputSize,
} from "../input";
import { provideInputGroupContext } from "./context";

defineOptions({ inheritAttrs: false });

type PhiInputGroupGlobal = typeof globalThis & {
  __phiInputGroupId?: number;
};

const nextInputGroupId = () => {
  const phiGlobal = globalThis as PhiInputGroupGlobal;

  phiGlobal.__phiInputGroupId = (phiGlobal.__phiInputGroupId ?? 0) + 1;
  return `phi-input-group-${phiGlobal.__phiInputGroupId}`;
};

const props = withDefaults(
  defineProps<{
    description?: string;
    disabled?: boolean;
    error?: InputError;
    inputId?: string;
    invalid?: boolean;
    label?: string;
    labelTooltip?: string;
    required?: boolean;
    size?: InputSize;
  }>(),
  {
    disabled: false,
    invalid: false,
    required: undefined,
    size: INPUT_DEFAULT_SIZE,
  },
);

const attrs = useAttrs();
const slots = useSlots();
const generatedId = nextInputGroupId();
const resolvedInputId = computed(() => props.inputId ?? `${generatedId}-input`);
const labelId = computed(() => (hasLabel.value ? `${resolvedInputId.value}-label` : undefined));
const descriptionId = computed(() => `${resolvedInputId.value}-description`);
const errorId = computed(() => `${resolvedInputId.value}-error`);
const hasLabel = computed(() => Boolean(props.label || slots.label));
const hasDescription = computed(() => Boolean(props.description || slots.description));
const errorMessage = computed(() => normalizeInputError(props.error));
const hasError = computed(() => Boolean(errorMessage.value || slots.error || props.invalid));
const shouldWrapField = computed(() => hasLabel.value || hasDescription.value || hasError.value);
const resolvedSize = computed(() => resolveInputSize(props.size));
const showOptional = computed(() => props.required === false);
const groupAriaLabel = computed(() => attrs["aria-label"] as string | undefined);
const groupAriaLabelledBy = computed(() => attrs["aria-labelledby"] as string | undefined);
const interactiveFocusSelector =
  'input, button, select, textarea, a[href], [contenteditable="true"], [tabindex]:not([tabindex="-1"])';
const describedBy = computed(() => {
  const ids = [
    attrs["aria-describedby"],
    hasError.value ? errorId.value : undefined,
    !hasError.value && hasDescription.value ? descriptionId.value : undefined,
  ];

  return ids.filter(Boolean).join(" ") || undefined;
});

const focusInputFromGroup = (event: MouseEvent) => {
  const target = event.target;
  const currentTarget = event.currentTarget;

  if (!(target instanceof Element) || !(currentTarget instanceof HTMLElement)) return;
  if (target.closest(interactiveFocusSelector)) return;

  const input = currentTarget.querySelector<HTMLInputElement>("input:not(:disabled)");
  if (!input) return;

  event.preventDefault();
  input.focus();
};

provideInputGroupContext({
  ariaLabel: groupAriaLabel,
  ariaLabelledBy: groupAriaLabelledBy,
  describedBy,
  disabled: computed(() => props.disabled),
  inputId: resolvedInputId,
  invalid: hasError,
  labelId,
  size: resolvedSize,
});
</script>

<template>
  <div
    v-if="shouldWrapField"
    class="phi-input-field"
    :data-disabled="disabled ? '' : undefined"
    :data-invalid="hasError ? '' : undefined"
  >
    <label v-if="hasLabel" :id="labelId" class="phi-input-label" :for="resolvedInputId">
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

    <div
      v-bind="attrs"
      role="group"
      data-slot="input-group"
      class="phi-input-group"
      :class="[`phi-input-group--${resolvedSize}`]"
      :aria-labelledby="labelId"
      :aria-describedby="describedBy"
      :data-disabled="disabled ? '' : undefined"
      :data-invalid="hasError ? '' : undefined"
      @mousedown="focusInputFromGroup"
    >
      <slot />
    </div>

    <p v-if="hasError" :id="errorId" class="phi-input-error">
      <slot name="error">{{ errorMessage }}</slot>
    </p>
    <p v-else-if="hasDescription" :id="descriptionId" class="phi-input-description">
      <slot name="description">{{ description }}</slot>
    </p>
  </div>

  <div
    v-else
    v-bind="attrs"
    role="group"
    data-slot="input-group"
    class="phi-input-group"
    :class="[`phi-input-group--${resolvedSize}`]"
    :aria-describedby="describedBy"
    :data-disabled="disabled ? '' : undefined"
    :data-invalid="hasError ? '' : undefined"
    @mousedown="focusInputFromGroup"
  >
    <slot />
  </div>
</template>

<style src="../input/input.css"></style>
<style src="./input-group.css"></style>
