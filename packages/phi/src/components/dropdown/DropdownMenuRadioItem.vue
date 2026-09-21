<script setup lang="ts">
import { computed, type Component } from "vue";
import { Menu } from "@ark-ui/vue/menu";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    closeOnSelect?: boolean;
    disabled?: boolean;
    icon?: Component;
    iconProps?: Record<string, unknown>;
    inset?: boolean;
    value: string;
    valueText?: string;
  }>(),
  {
    closeOnSelect: false,
    disabled: false,
    iconProps: () => ({}),
  },
);

const itemClass = computed(() => ({
  "phi-dropdown-item--inset": props.inset,
}));
</script>

<template>
  <Menu.RadioItem
    class="phi-dropdown-item phi-dropdown-radio-item"
    :class="itemClass"
    :close-on-select="closeOnSelect"
    :disabled="disabled"
    :value="value"
    :value-text="valueText"
    v-bind="$attrs"
  >
    <component
      :is="icon"
      v-if="icon"
      class="phi-dropdown-item__icon"
      v-bind="iconProps"
      aria-hidden="true"
    />
    <slot />
  </Menu.RadioItem>
</template>
