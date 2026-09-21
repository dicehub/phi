<script setup lang="ts">
import { computed, inject } from "vue";
import { GRID_CONTEXT } from "./grid";

defineOptions({ inheritAttrs: false });

const grid = inject(GRID_CONTEXT, undefined);

const classes = computed(() => [
  "phi-grid-item",
  grid?.mobileDivider.value && grid.variant.value === "4up" ? "phi-grid-item--mobile-divider" : undefined,
]);
</script>

<template>
  <div v-bind="$attrs" :class="classes">
    <slot />
  </div>
</template>

<style src="./grid.css"></style>
