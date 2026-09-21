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
  <div
    v-bind="$attrs"
    class="phi-pagination__separator"
    :class="className"
    data-slot="pagination-separator"
  />
</template>
