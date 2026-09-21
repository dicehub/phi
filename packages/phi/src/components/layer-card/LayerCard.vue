<script setup lang="ts">
defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    as?: string;
  }>(),
  {
    as: "div",
  },
);
</script>

<template>
  <component :is="as" v-bind="$attrs" class="phi-layer-card">
    <slot />
  </component>
</template>

<style src="./layer-card.css"></style>
