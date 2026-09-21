<script setup lang="ts">
import { computed, useSlots } from "vue";
import { Field as ArkField } from "@ark-ui/vue/field";
import { Label } from "../label";
import {
  fieldVariants,
  normalizeFieldError,
  type FieldError,
} from "./field";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    className?: string;
    controlFirst?: boolean;
    description?: string;
    disabled?: boolean;
    error?: FieldError;
    errorClassName?: string;
    hideLabel?: boolean;
    id?: string;
    invalid?: boolean;
    label?: string;
    labelClassName?: string;
    labelTooltip?: string;
    readOnly?: boolean;
    required?: boolean;
    textClassName?: string;
  }>(),
  {
    className: undefined,
    controlFirst: false,
    description: undefined,
    disabled: false,
    error: undefined,
    errorClassName: undefined,
    hideLabel: false,
    id: undefined,
    invalid: false,
    label: undefined,
    labelClassName: undefined,
    labelTooltip: undefined,
    readOnly: false,
    required: undefined,
    textClassName: undefined,
  },
);

const slots = useSlots();
const normalizedError = computed(() => normalizeFieldError(props.error));
const hasLabel = computed(() => Boolean(props.label || slots.label));
const hasError = computed(() => Boolean(normalizedError.value || slots.error));
const hasDescription = computed(() => Boolean(props.description || slots.description));
const isInvalid = computed(() => Boolean(props.invalid || hasError.value));
const showOptional = computed(() => props.required === false);
const rootClass = computed(() => [
  fieldVariants({ controlFirst: props.controlFirst }),
  props.className,
]);
</script>

<template>
  <ArkField.Root
    v-bind="$attrs"
    :id="id"
    :disabled="disabled"
    :invalid="isInvalid"
    :read-only="readOnly"
    :required="required === true"
    :class="rootClass"
  >
    <ArkField.Label
      v-if="!hideLabel && hasLabel"
      class="phi-field__label"
      :class="labelClassName"
    >
      <Label as-content :show-optional="showOptional" :tooltip="labelTooltip">
        <slot name="label">{{ label }}</slot>
      </Label>
    </ArkField.Label>

    <slot />

    <ArkField.ErrorText
      v-if="hasError"
      class="phi-field__error"
      :class="[textClassName, errorClassName]"
    >
      <slot name="error">{{ normalizedError?.message }}</slot>
    </ArkField.ErrorText>

    <ArkField.HelperText
      v-else-if="hasDescription"
      class="phi-field__description"
      :class="textClassName"
    >
      <slot name="description">{{ description }}</slot>
    </ArkField.HelperText>
  </ArkField.Root>
</template>

<style src="./field.css"></style>
