<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { INPUT_DEFAULT_SIZE, resolveInputSize, type InputSize } from "../input";
import { useInputGroupContext } from "./context";

defineOptions({ inheritAttrs: false });

type InputGroupInputModelValue = string | number;

const props = withDefaults(
  defineProps<{
    defaultValue?: InputGroupInputModelValue;
    disabled?: boolean;
    id?: string;
    modelValue?: InputGroupInputModelValue;
    name?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    size?: InputSize;
    type?: string;
  }>(),
  {
    disabled: false,
    readOnly: false,
    required: undefined,
    size: undefined,
    type: "text",
  },
);

const emit = defineEmits<{
  valueChange: [value: string];
  "update:modelValue": [value: string];
}>();

const attrs = useAttrs();
const context = useInputGroupContext();
const resolvedSize = computed(() => context?.size.value ?? resolveInputSize(props.size ?? INPUT_DEFAULT_SIZE));
const isDisabled = computed(() => Boolean(context?.disabled.value || props.disabled));
const inputId = computed(() => props.id ?? context?.inputId.value);
const inputValueAttrs = computed(() => {
  if (props.modelValue !== undefined) return { value: props.modelValue };
  if (props.defaultValue !== undefined) return { value: props.defaultValue };
  return {};
});
const passthroughAttrs = computed(() => ({
  ...attrs,
  ...inputValueAttrs.value,
}));
const ariaInvalid = computed(() => {
  if (context?.invalid.value) return true;

  const value = attrs["aria-invalid"];
  if (value === true || value === false) return value;
  if (value === "true" || value === "false" || value === "grammar" || value === "spelling") return value;

  return undefined;
});
const ariaDescribedBy = computed(() => {
  const ids = [attrs["aria-describedby"], context?.describedBy.value];

  return ids.filter(Boolean).join(" ") || undefined;
});
const ariaLabel = computed(() => {
  if (attrs["aria-label"]) return attrs["aria-label"] as string;
  if (context?.labelId.value) return undefined;

  return context?.ariaLabel.value;
});
const ariaLabelledBy = computed(() => {
  if (attrs["aria-label"]) return undefined;
  return context?.labelId.value ?? (attrs["aria-labelledby"] as string | undefined) ?? context?.ariaLabelledBy.value;
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;

  emit("update:modelValue", target.value);
  emit("valueChange", target.value);
};
</script>

<template>
  <input
    v-bind="passthroughAttrs"
    :id="inputId"
    :name="name"
    :type="type"
    :placeholder="placeholder"
    :disabled="isDisabled"
    :readonly="readOnly"
    :required="required"
    :aria-describedby="ariaDescribedBy"
    :aria-invalid="ariaInvalid"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledBy"
    data-slot="input-group-input"
    class="phi-input-group-input"
    :class="[`phi-input-group-input--${resolvedSize}`]"
    @input="handleInput"
  />
</template>
