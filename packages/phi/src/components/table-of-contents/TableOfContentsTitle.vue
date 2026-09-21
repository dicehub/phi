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
  <p v-bind="$attrs" class="phi-table-of-contents-title" :class="className">
    <slot />
  </p>
</template>

<style src="./table-of-contents.css"></style>
