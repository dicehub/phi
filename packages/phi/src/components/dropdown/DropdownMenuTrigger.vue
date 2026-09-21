<script setup lang="ts">
import { Menu } from "@ark-ui/vue/menu";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Menu.Trigger as-child v-bind="$attrs">
    <slot />
  </Menu.Trigger>
</template>
