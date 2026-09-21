<script setup lang="ts">
import { Menu } from "@ark-ui/vue/menu";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Menu.Positioner class="phi-dropdown-positioner phi-dropdown-positioner--sub">
    <Menu.Content class="phi-dropdown-content phi-dropdown-content--sub" v-bind="$attrs">
      <slot />
    </Menu.Content>
  </Menu.Positioner>
</template>
