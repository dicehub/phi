<script setup lang="ts">
import { computed } from "vue";
import { type MenuRootProps } from "@ark-ui/vue/menu";
import DropdownMenu from "./DropdownMenu.vue";

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  positioning?: MenuRootProps["positioning"];
}>();

// Explicit offsets take precedence over Ark's submenu gutter override.
const positioning = computed(() => ({
  ...props.positioning,
  shift: props.positioning?.shift ?? (props.positioning?.offset?.crossAxis === undefined ? -6 : undefined),
  offset: {
    mainAxis: props.positioning?.gutter ?? 2,
    ...props.positioning?.offset,
  },
}));
</script>

<template>
  <DropdownMenu :positioning="positioning" v-bind="$attrs">
    <slot />
  </DropdownMenu>
</template>
