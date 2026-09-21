<script setup lang="ts">
import { computed, provide, toRef } from "vue";
import {
  GRID_CONTEXT,
  GRID_DEFAULT_GAP,
  type GridGap,
  type GridVariant,
} from "./grid";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    gap?: GridGap;
    mobileDivider?: boolean;
    variant?: GridVariant;
  }>(),
  {
    gap: GRID_DEFAULT_GAP,
  },
);

provide(GRID_CONTEXT, {
  gap: toRef(props, "gap"),
  mobileDivider: toRef(props, "mobileDivider"),
  variant: toRef(props, "variant"),
});

const classes = computed(() => [
  "phi-grid",
  props.variant ? `phi-grid--${props.variant}` : undefined,
  `phi-grid--gap-${props.gap}`,
]);
</script>

<template>
  <div v-bind="$attrs" :class="classes">
    <slot />
  </div>
</template>

<style src="./grid.css"></style>
