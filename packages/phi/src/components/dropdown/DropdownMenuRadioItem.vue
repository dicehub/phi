<script setup lang="ts">
import { computed, type Component } from "vue";
import { Menu } from "@ark-ui/vue/menu";
import DropdownMenuIcon from "./DropdownMenuIcon.vue";
import { useMenuIcons } from "./dropdown-icons";

defineOptions({ inheritAttrs: false });

const menuIcons = useMenuIcons();

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
    :data-auto-inset="menuIcons?.hasIcons.value || undefined"
    :close-on-select="closeOnSelect"
    :disabled="disabled"
    :value="value"
    :value-text="valueText"
    v-bind="$attrs"
  >
    <DropdownMenuIcon :icon="icon" :icon-props="iconProps"><slot name="icon" /></DropdownMenuIcon>
    <slot />
  </Menu.RadioItem>
</template>
