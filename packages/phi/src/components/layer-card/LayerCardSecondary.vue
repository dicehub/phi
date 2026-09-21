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
  <component :is="as" v-bind="$attrs" class="phi-layer-card__secondary">
    <slot />
  </component>
</template>
