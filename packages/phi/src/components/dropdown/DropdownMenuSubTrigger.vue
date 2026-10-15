<script setup lang="ts">
import { computed, type Component } from "vue";
import { Menu } from "@ark-ui/vue/menu";
import DropdownMenuIcon from "./DropdownMenuIcon.vue";
import { useMenuIcons } from "./dropdown-icons";

defineOptions({ inheritAttrs: false });

const menuIcons = useMenuIcons();

const props = withDefaults(
  defineProps<{
    icon?: Component;
    iconProps?: Record<string, unknown>;
    inset?: boolean;
  }>(),
  {
    iconProps: () => ({}),
  },
);

const triggerClass = computed(() => ({
  "phi-dropdown-item--inset": props.inset,
}));
</script>

<template>
  <Menu.TriggerItem
    class="phi-dropdown-item phi-dropdown-sub-trigger"
    :class="triggerClass"
    :data-auto-inset="menuIcons?.hasIcons.value || undefined"
    v-bind="$attrs"
  >
    <DropdownMenuIcon :icon="icon" :icon-props="iconProps"><slot name="icon" /></DropdownMenuIcon>
    <slot />
    <svg class="phi-dropdown-sub-trigger__caret" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="m6 3.75 4.25 4.25L6 12.25" />
    </svg>
  </Menu.TriggerItem>
</template>
