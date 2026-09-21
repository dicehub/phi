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
  <legend v-bind="$attrs" class="phi-switch-group__legend" :class="className">
    <slot />
  </legend>
</template>

<style src="./switch.css"></style>
