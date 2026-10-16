<script setup lang="ts">
import { Menu } from "@ark-ui/vue/menu";
import { useMenuIcons } from "./dropdown-icons";

defineOptions({ inheritAttrs: false });

const menuIcons = useMenuIcons();

defineProps<{
  inset?: boolean;
}>();
</script>

<template>
  <Menu.ItemGroupLabel
    class="phi-dropdown-label"
    :data-auto-inset="menuIcons?.hasIcons.value || undefined"
    :class="{ 'phi-dropdown-label--inset': inset }"
    v-bind="$attrs"
  >
    <slot />
  </Menu.ItemGroupLabel>
</template>
