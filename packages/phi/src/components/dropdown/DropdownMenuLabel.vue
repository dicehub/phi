<script setup lang="ts">
import { Menu } from "@ark-ui/vue/menu";

defineOptions({ inheritAttrs: false });

defineProps<{
  inset?: boolean;
}>();
</script>

<template>
  <Menu.ItemGroupLabel
    class="phi-dropdown-label"
    :class="{ 'phi-dropdown-label--inset': inset }"
    v-bind="$attrs"
  >
    <slot />
  </Menu.ItemGroupLabel>
</template>
