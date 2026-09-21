<script setup lang="ts">
import { computed, ref, useSlots, watchEffect } from "vue";
import {
  CHECKBOX_DEFAULT_VARIANT,
  isCheckboxVariant,
  type CheckboxCheckedState,
  type CheckboxVariant,
} from "./checkbox";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    ariaLabel?: string;
    checked?: CheckboxCheckedState;
    controlFirst?: boolean;
    defaultChecked?: CheckboxCheckedState;
    defaultIndeterminate?: boolean;
    disabled?: boolean;
    form?: string;
    id?: string;
    indeterminate?: boolean;
    invalid?: boolean;
    label?: string;
    name?: string;
    readOnly?: boolean;
    required?: boolean;
    value?: string;
    variant?: CheckboxVariant;
  }>(),
  {
    ariaLabel: undefined,
    checked: undefined,
    controlFirst: true,
    disabled: undefined,
    invalid: undefined,
    readOnly: undefined,
    required: undefined,
    variant: CHECKBOX_DEFAULT_VARIANT,
  },
);

const emit = defineEmits<{
  checkedChange: [details: { checked: CheckboxCheckedState }];
  "update:checked": [checked: CheckboxCheckedState];
  "update:indeterminate": [indeterminate: boolean];
}>();

const slots = useSlots();
const inputElement = ref<HTMLInputElement | null>(null);
const internalChecked = ref<CheckboxCheckedState>(
  props.defaultIndeterminate ? "indeterminate" : props.defaultChecked ?? false,
);
const resolvedVariant = computed(() =>
  isCheckboxVariant(props.variant) ? props.variant : CHECKBOX_DEFAULT_VARIANT,
);
const currentChecked = computed<CheckboxCheckedState>(() =>
  props.indeterminate ? "indeterminate" : props.checked ?? internalChecked.value,
);
const isInvalid = computed(() => props.invalid || resolvedVariant.value === "error");
const hasLabel = computed(() => Boolean(props.label || slots.default || slots.label));
const dataState = computed(() =>
  currentChecked.value === "indeterminate" ? "indeterminate" : currentChecked.value ? "checked" : "unchecked",
);

const handleUpdateChecked = (checked: CheckboxCheckedState) => {
  if (checked !== "indeterminate" && props.indeterminate) {
    emit("update:indeterminate", false);
  }

  emit("update:checked", checked);
};

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const isIndeterminate = currentChecked.value === "indeterminate";
  const nextChecked: CheckboxCheckedState = isIndeterminate ? "indeterminate" : target.checked;

  if (isIndeterminate) {
    target.checked = false;
    target.indeterminate = true;
  }

  internalChecked.value = nextChecked;
  handleUpdateChecked(nextChecked);
  emit("checkedChange", { checked: nextChecked });
};

watchEffect(() => {
  if (inputElement.value) {
    inputElement.value.indeterminate = currentChecked.value === "indeterminate";
  }
});
</script>

<template>
  <label
    v-bind="$attrs"
    :id="id"
    class="phi-checkbox"
    :class="[
      `phi-checkbox--${resolvedVariant}`,
      {
        'phi-checkbox--label-first': !controlFirst,
        'phi-checkbox--disabled': disabled,
      },
    ]"
  >
    <input
      ref="inputElement"
      class="phi-checkbox__input"
      type="checkbox"
      :aria-checked="currentChecked === 'indeterminate' ? 'mixed' : undefined"
      :aria-label="ariaLabel"
      :checked="currentChecked === true"
      :disabled="disabled"
      :form="form"
      :name="name"
      :readonly="readOnly"
      :required="required"
      :value="value"
      @change="handleChange"
    />
    <span class="phi-checkbox__control" :data-state="dataState" aria-hidden="true" />
    <span v-if="hasLabel" class="phi-checkbox__label">
      <slot name="label">
        <slot>{{ label }}</slot>
      </slot>
    </span>
  </label>
</template>

<style src="./checkbox.css"></style>
