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
  <tfoot v-bind="$attrs" class="phi-table-footer" :class="className" data-phi-component="Table" data-phi-part="footer">
    <slot />
  </tfoot>
</template>

<style src="./table.css"></style>
