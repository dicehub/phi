<script setup lang="ts">
import type { Component } from "vue";

defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    href: string;
    icon?: Component;
    iconProps?: Record<string, unknown>;
  }>(),
  {
    iconProps: () => ({}),
  },
);
</script>

<template>
  <a v-bind="$attrs" class="phi-breadcrumbs__link phi-breadcrumbs__item" :href="href">
    <component
      :is="icon"
      v-if="icon"
      class="phi-breadcrumbs__icon"
      v-bind="iconProps"
      aria-hidden="true"
    />
    <span class="phi-breadcrumbs__text"><slot /></span>
  </a>
</template>
