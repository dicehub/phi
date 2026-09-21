<script setup lang="ts">
import { Menu } from "@ark-ui/vue/menu";

defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    positioning?: Record<string, unknown>;
  }>(),
  {
    positioning: () => ({ placement: "bottom-end", gutter: 8 }),
  },
);
</script>

<template>
  <Menu.Root :positioning="positioning" v-bind="$attrs">
    <slot />
  </Menu.Root>
</template>
