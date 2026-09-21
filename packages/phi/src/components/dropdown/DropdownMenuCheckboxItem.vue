<script setup lang="ts">
import { computed, ref } from "vue";
import { Menu } from "@ark-ui/vue/menu";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    checked?: boolean;
    closeOnSelect?: boolean;
    disabled?: boolean;
    value: string;
    valueText?: string;
  }>(),
  {
    closeOnSelect: false,
    disabled: false,
  },
);

const emit = defineEmits<{
  checkedChange: [value: boolean];
  "update:checked": [value: boolean];
}>();

const internalChecked = ref(false);
const resolvedChecked = computed(() => props.checked ?? internalChecked.value);

const handleCheckedUpdate = (value: boolean) => {
  if (props.checked === undefined) {
    internalChecked.value = value;
  }

  emit("update:checked", value);
  emit("checkedChange", value);
};
</script>

<template>
  <Menu.CheckboxItem
    class="phi-dropdown-item phi-dropdown-option-item phi-dropdown-option-item--check"
    :checked="resolvedChecked"
    :close-on-select="closeOnSelect"
    :disabled="disabled"
    :value="value"
    :value-text="valueText"
    v-bind="$attrs"
    @update:checked="handleCheckedUpdate"
  >
    <Menu.ItemIndicator class="phi-dropdown-item-indicator" aria-hidden="true">
      <svg viewBox="0 0 16 16" focusable="false">
        <path d="M13.5 4.5 6.25 11.75 2.5 8" />
      </svg>
    </Menu.ItemIndicator>
    <slot />
  </Menu.CheckboxItem>
</template>
