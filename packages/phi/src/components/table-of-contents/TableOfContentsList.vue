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
  <ul v-bind="$attrs" class="phi-table-of-contents-list" :class="className">
    <slot />
  </ul>
</template>

<style src="./table-of-contents.css"></style>
