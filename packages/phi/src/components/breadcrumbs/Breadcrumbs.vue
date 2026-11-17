<script setup lang="ts">
import { computed } from "vue";
import { BREADCRUMBS_DEFAULT_SIZE, isBreadcrumbsSize, type BreadcrumbsSize } from "./breadcrumbs";
import { useLocale } from "../../utils/locale-provider";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    ariaLabel?: string;
    size?: BreadcrumbsSize;
  }>(),
  {
    size: BREADCRUMBS_DEFAULT_SIZE,
  },
);

const resolvedSize = computed(() => (isBreadcrumbsSize(props.size) ? props.size : BREADCRUMBS_DEFAULT_SIZE));
const locale = useLocale();
</script>

<template>
  <nav
    v-bind="$attrs"
    class="phi-breadcrumbs"
    :class="`phi-breadcrumbs--${resolvedSize}`"
    :aria-label="ariaLabel ?? locale.breadcrumbs.label"
  >
    <slot />
  </nav>
</template>

<style src="./breadcrumbs.css"></style>
