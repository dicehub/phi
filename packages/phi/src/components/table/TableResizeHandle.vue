<script setup lang="ts">
defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    className?: string;
  }>(),
  {
    className: undefined,
  },
);
</script>

<template>
  <button
    v-bind="$attrs"
    type="button"
    aria-label="Resize column"
    class="phi-table-resize-handle"
    :class="className"
    data-phi-component="Table"
    data-phi-part="resize-handle"
  >
    <span class="phi-table-resize-handle__bar" aria-hidden="true" />
  </button>
</template>

<style src="./table.css"></style>
