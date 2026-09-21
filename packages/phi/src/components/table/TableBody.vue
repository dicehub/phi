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
  <tbody v-bind="$attrs" class="phi-table-body" :class="className" data-phi-component="Table" data-phi-part="body">
    <slot />
  </tbody>
</template>

<style src="./table.css"></style>
