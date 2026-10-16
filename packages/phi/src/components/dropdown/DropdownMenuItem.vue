<script setup lang="ts">
import { computed, type Component } from "vue";
import { Menu } from "@ark-ui/vue/menu";
import DropdownMenuIcon from "./DropdownMenuIcon.vue";
import { useMenuIcons } from "./dropdown-icons";
import { resolveDropdownMenuItemVariant, type DropdownMenuItemVariant } from "./dropdown";

defineOptions({ inheritAttrs: false });

const menuIcons = useMenuIcons();

const props = withDefaults(
  defineProps<{
    closeOnSelect?: boolean;
    disabled?: boolean;
    icon?: Component;
    iconProps?: Record<string, unknown>;
    inset?: boolean;
    selected?: boolean;
    variant?: DropdownMenuItemVariant;
    value: string;
    valueText?: string;
  }>(),
  {
    closeOnSelect: true,
    disabled: false,
    iconProps: () => ({}),
  },
);

const itemProps = computed(() => ({
  value: props.value,
  closeOnSelect: props.closeOnSelect,
  ...(props.disabled !== undefined ? { disabled: props.disabled } : {}),
  ...(props.valueText !== undefined ? { valueText: props.valueText } : {}),
}));

const resolvedVariant = computed(() => resolveDropdownMenuItemVariant(props.variant));
const itemClass = computed(() => [
  `phi-dropdown-item--${resolvedVariant.value}`,
  {
    "phi-dropdown-item--inset": props.inset,
  },
]);
</script>

<template>
  <Menu.Item
    class="phi-dropdown-item"
    :class="itemClass"
    :data-auto-inset="menuIcons?.hasIcons.value || undefined"
    v-bind="{ ...itemProps, ...$attrs }"
  >
    <DropdownMenuIcon :icon="icon" :icon-props="iconProps"><slot name="icon" /></DropdownMenuIcon>
    <slot />
    <span v-if="selected" class="phi-dropdown-radio-indicator" aria-hidden="true">
      <svg viewBox="0 0 16 16" focusable="false">
        <path d="M13.5 4.5 6.25 11.75 2.5 8" />
      </svg>
    </span>
  </Menu.Item>
</template>
