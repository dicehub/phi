<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { Input } from "../input";
import { useToolbarContext } from "./context";
import { TOOLBAR_DEFAULT_SIZE } from "./toolbar";

defineOptions({ inheritAttrs: false });

type ToolbarInputModelValue = string | number;

const props = withDefaults(
  defineProps<{
    defaultValue?: ToolbarInputModelValue;
    disabled?: boolean;
    focusableWhenDisabled?: boolean;
    id?: string;
    modelValue?: ToolbarInputModelValue;
    name?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    type?: string;
  }>(),
  {
    disabled: false,
    focusableWhenDisabled: false,
    readOnly: false,
    required: undefined,
    type: "text",
  },
);

const emit = defineEmits<{
  valueChange: [value: string];
  "update:modelValue": [value: string];
}>();

const attrs = useAttrs();
const toolbar = useToolbarContext();
const resolvedSize = computed(() => toolbar?.size.value ?? TOOLBAR_DEFAULT_SIZE);
const nativeDisabled = computed(() => props.disabled && !props.focusableWhenDisabled);
const ariaDisabled = computed(() =>
  props.disabled && props.focusableWhenDisabled ? "true" : (attrs["aria-disabled"] as string | undefined),
);
const inputAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([key]) =>
        ![
          "aria-disabled",
          "description",
          "error",
          "invalid",
          "label",
          "labelTooltip",
          "size",
          "variant",
        ].includes(key),
    ),
  ),
);

const emitModelUpdate = (value: string) => {
  emit("update:modelValue", value);
};

const emitValueChange = (value: string) => {
  emit("valueChange", value);
};
</script>

<template>
  <Input
    v-bind="inputAttrs"
    class="phi-toolbar__item phi-toolbar__input"
    :id="id"
    :name="name"
    :type="type"
    :placeholder="placeholder"
    :disabled="nativeDisabled"
    :read-only="readOnly || (disabled && focusableWhenDisabled)"
    :required="required"
    :size="resolvedSize"
    :model-value="modelValue"
    :default-value="defaultValue"
    :aria-disabled="ariaDisabled"
    data-phi-component="Toolbar.Input"
    @update:model-value="emitModelUpdate"
    @value-change="emitValueChange"
  />
</template>
