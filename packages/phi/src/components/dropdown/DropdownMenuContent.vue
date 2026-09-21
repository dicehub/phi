<script setup lang="ts">
import { Menu } from "@ark-ui/vue/menu";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Menu.Positioner class="phi-dropdown-positioner">
    <Menu.Content class="phi-dropdown-content" v-bind="$attrs">
      <slot />
    </Menu.Content>
  </Menu.Positioner>
</template>

<style src="./dropdown.css"></style>
