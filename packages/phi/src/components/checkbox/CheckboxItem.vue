<script setup lang="ts">
import { computed, ref, useSlots, watchEffect } from "vue";
import { useCheckboxGroupContext } from "./checkbox-context";
import {
  CHECKBOX_DEFAULT_VARIANT,
  isCheckboxAppearance,
  isCheckboxVariant,
  type CheckboxAppearance,
  type CheckboxCheckedState,
  type CheckboxVariant,
} from "./checkbox";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    appearance?: CheckboxAppearance;
    checked?: CheckboxCheckedState;
    controlFirst?: boolean;
    defaultChecked?: CheckboxCheckedState;
    defaultIndeterminate?: boolean;
    description?: string;
    disabled?: boolean;
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
    checked: undefined,
    controlFirst: undefined,
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
const groupContext = useCheckboxGroupContext();
const resolvedAppearance = computed(() =>
  isCheckboxAppearance(props.appearance) ? props.appearance : groupContext?.appearance.value ?? "default",
);
const isCard = computed(() => resolvedAppearance.value === "card");
const isJoined = computed(() => isCard.value && groupContext?.appearance.value === "card");
const resolvedControlFirst = computed(() => props.controlFirst ?? groupContext?.controlFirst.value ?? !isCard.value);
const resolvedVariant = computed(() =>
  isCheckboxVariant(props.variant) ? props.variant : CHECKBOX_DEFAULT_VARIANT,
);
const groupChecked = computed(() =>
  groupContext && props.value ? groupContext.isChecked(props.value) : undefined,
);
const currentChecked = computed<CheckboxCheckedState>(() =>
  props.indeterminate ? "indeterminate" : props.checked ?? groupChecked.value ?? internalChecked.value,
);
const isDisabled = computed(() => props.disabled ?? groupContext?.disabled.value);
const isInvalid = computed(() => (props.invalid ?? groupContext?.invalid.value) || resolvedVariant.value === "error");
const resolvedName = computed(() => props.name ?? groupContext?.name.value);
const hasLabel = computed(() => Boolean(props.label || slots.default || slots.label));
const hasDescription = computed(() => Boolean(props.description || slots.description));
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

  if (groupContext && props.value) {
    groupContext.toggleValue(props.value, nextChecked === true);
  } else {
    internalChecked.value = nextChecked;
  }

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
    class="phi-checkbox phi-checkbox-item"
    :class="[
      `phi-checkbox--${resolvedVariant}`,
      `phi-checkbox--appearance-${resolvedAppearance}`,
      {
        'phi-checkbox--label-first': !resolvedControlFirst,
        'phi-checkbox--disabled': isDisabled,
        'phi-checkbox--joined': isJoined,
      },
    ]"
    :data-appearance="resolvedAppearance"
    :data-state="dataState"
  >
    <input
      ref="inputElement"
      class="phi-checkbox__input"
      type="checkbox"
      :aria-checked="currentChecked === 'indeterminate' ? 'mixed' : undefined"
      :checked="currentChecked === true"
      :disabled="isDisabled"
      :name="resolvedName"
      :readonly="readOnly"
      :required="required"
      :value="value"
      @change="handleChange"
    />
    <span class="phi-checkbox__control" :data-state="dataState" aria-hidden="true" />
    <span v-if="isCard" class="phi-checkbox__content">
      <span v-if="hasLabel" class="phi-checkbox__label">
        <slot name="label">
          <slot>{{ label }}</slot>
        </slot>
      </span>
      <span v-if="hasDescription" class="phi-checkbox__description">
        <slot name="description">{{ description }}</slot>
      </span>
    </span>
    <span v-else-if="hasLabel" class="phi-checkbox__label">
      <slot name="label">
        <slot>{{ label }}</slot>
      </slot>
    </span>
  </label>
</template>

<style src="./checkbox.css"></style>
