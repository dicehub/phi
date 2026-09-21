<script setup lang="ts">
import { computed, ref, toRef } from "vue";
import { provideCheckboxGroupContext } from "./checkbox-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    controlFirst?: boolean;
    defaultValue?: string[];
    description?: string;
    disabled?: boolean;
    error?: string;
    invalid?: boolean;
    maxSelectedValues?: number;
    modelValue?: string[];
    name?: string;
    readOnly?: boolean;
    legend?: string;
  }>(),
  {
    controlFirst: true,
    disabled: undefined,
    invalid: undefined,
    readOnly: undefined,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string[]];
  valueChange: [value: string[]];
}>();

const isInvalid = computed(() => props.invalid || Boolean(props.error));
const internalValue = ref(props.defaultValue ?? []);
const selectedValues = computed(() => props.modelValue ?? internalValue.value);

const handleUpdateModelValue = (value: string[]) => {
  emit("update:modelValue", value);
};

const handleValueChange = (value: string[]) => {
  emit("valueChange", value);
};

const setValue = (value: string[]) => {
  if (props.modelValue === undefined) {
    internalValue.value = value;
  }

  handleUpdateModelValue(value);
  handleValueChange(value);
};

const toggleValue = (value: string, checked: boolean) => {
  if (props.readOnly) return;

  const current = selectedValues.value;
  if (
    checked &&
    props.maxSelectedValues !== undefined &&
    current.length >= props.maxSelectedValues &&
    !current.includes(value)
  ) {
    return;
  }

  const next = checked
    ? Array.from(new Set([...current, value]))
    : current.filter((item) => item !== value);

  setValue(next);
};

provideCheckboxGroupContext({
  controlFirst: toRef(props, "controlFirst"),
  disabled: computed(() => props.disabled),
  invalid: computed(() => isInvalid.value),
  isChecked: (value: string) => selectedValues.value.includes(value),
  name: computed(() => props.name),
  toggleValue,
});
</script>

<template>
  <fieldset
    v-bind="$attrs"
    class="phi-checkbox-group"
    :class="{
      'phi-checkbox-group--disabled': disabled,
      'phi-checkbox-group--invalid': isInvalid,
    }"
    :disabled="disabled"
    :aria-invalid="isInvalid ? 'true' : undefined"
  >
    <legend v-if="legend" class="phi-checkbox-group__legend">{{ legend }}</legend>
    <div class="phi-checkbox-group__items">
      <slot />
    </div>
    <p v-if="error" class="phi-checkbox-group__error">{{ error }}</p>
    <p v-else-if="description" class="phi-checkbox-group__description">{{ description }}</p>
  </fieldset>
</template>

<style src="./checkbox.css"></style>
