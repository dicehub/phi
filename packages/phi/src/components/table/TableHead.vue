<script setup lang="ts">
import { computed } from "vue";
import { isTableStickyColumn, type TableStickyColumn } from "./table";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    className?: string;
    sticky?: TableStickyColumn;
  }>(),
  {
    className: undefined,
    sticky: undefined,
  },
);

const resolvedSticky = computed(() => (isTableStickyColumn(props.sticky) ? props.sticky : undefined));
</script>

<template>
  <th
    v-bind="$attrs"
    class="phi-table-head"
    :class="[className, resolvedSticky ? `phi-table-head--sticky-${resolvedSticky}` : undefined]"
    :data-sticky="resolvedSticky"
    data-phi-component="Table"
    data-phi-part="head"
  >
    <slot />
  </th>
</template>

<style src="./table.css"></style>
