<script setup lang="ts">
import DropdownMenu from "./DropdownMenu.vue";

defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    positioning?: Record<string, unknown>;
  }>(),
  {
    positioning: () => ({ placement: "right-start", gutter: 8 }),
  },
);
</script>

<template>
  <DropdownMenu :positioning="positioning" v-bind="$attrs">
    <slot />
  </DropdownMenu>
</template>
