<script setup lang="ts">
import { type FlowParallelAlign } from "./flow";

defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    align?: FlowParallelAlign;
  }>(),
  {
    align: "start",
  },
);
</script>

<template>
  <li
    v-bind="$attrs"
    class="phi-flow-parallel"
    data-flow-item
    data-flow-type="parallel"
    :data-flow-align="align"
  >
    <ul
      class="phi-flow__parallel-list"
      :class="`phi-flow__parallel-list--${align}`"
      data-flow-parallel-list
    >
      <slot />
    </ul>
  </li>
</template>

<style src="./flow.css"></style>
