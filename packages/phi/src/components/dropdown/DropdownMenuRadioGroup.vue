<script setup lang="ts">
import { Menu } from "@ark-ui/vue/menu";

defineOptions({ inheritAttrs: false });

defineProps<{
  modelValue?: string;
}>();

defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

<template>
  <Menu.RadioItemGroup
    class="phi-dropdown-radio-group"
    :model-value="modelValue"
    v-bind="$attrs"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <slot />
  </Menu.RadioItemGroup>
</template>
