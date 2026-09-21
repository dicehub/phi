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
  <td
    v-bind="$attrs"
    class="phi-table-cell"
    :class="[className, resolvedSticky ? `phi-table-cell--sticky-${resolvedSticky}` : undefined]"
    :data-sticky="resolvedSticky"
    data-phi-component="Table"
    data-phi-part="cell"
  >
    <slot />
  </td>
</template>

<style src="./table.css"></style>
