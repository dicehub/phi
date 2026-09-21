<script setup lang="ts">
import { computed } from "vue";
import { TABLE_DEFAULT_VARIANTS, isTableLayout, type TableLayout } from "./table";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    className?: string;
    layout?: TableLayout;
  }>(),
  {
    className: undefined,
    layout: TABLE_DEFAULT_VARIANTS.layout,
  },
);

const resolvedLayout = computed(() =>
  isTableLayout(props.layout) ? props.layout : TABLE_DEFAULT_VARIANTS.layout,
);
</script>

<template>
  <table
    v-bind="$attrs"
    class="phi-table"
    :class="[className, `phi-table--${resolvedLayout}`]"
    :data-layout="resolvedLayout"
    data-phi-component="Table"
  >
    <slot />
  </table>
</template>

<style src="./table.css"></style>
