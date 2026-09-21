<script setup lang="ts">
import type { Component } from "vue";

withDefaults(
  defineProps<{
    icon?: Component;
    iconProps?: Record<string, unknown>;
    loading?: boolean;
  }>(),
  {
    iconProps: () => ({}),
    loading: false,
  },
);
</script>

<template>
  <div class="phi-breadcrumbs__current phi-breadcrumbs__item" aria-current="page">
    <component
      :is="icon"
      v-if="icon"
      class="phi-breadcrumbs__icon"
      v-bind="iconProps"
      aria-hidden="true"
    />
    <span v-if="loading" class="phi-breadcrumbs__skeleton" aria-label="Loading breadcrumb" />
    <span v-else class="phi-breadcrumbs__text"><slot /></span>
  </div>
</template>
