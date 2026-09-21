<script setup lang="ts">
import { computed } from "vue";
import { BREADCRUMBS_DEFAULT_SIZE, isBreadcrumbsSize, type BreadcrumbsSize } from "./breadcrumbs";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    size?: BreadcrumbsSize;
  }>(),
  {
    size: BREADCRUMBS_DEFAULT_SIZE,
  },
);

const resolvedSize = computed(() => (isBreadcrumbsSize(props.size) ? props.size : BREADCRUMBS_DEFAULT_SIZE));
</script>

<template>
  <nav
    v-bind="$attrs"
    class="phi-breadcrumbs"
    :class="`phi-breadcrumbs--${resolvedSize}`"
    aria-label="breadcrumb"
  >
    <slot />
  </nav>
</template>

<style src="./breadcrumbs.css"></style>
