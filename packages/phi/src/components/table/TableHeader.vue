<script setup lang="ts">
import { computed } from "vue";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    className?: string;
    sticky?: boolean;
    variant?: "default" | "compact";
  }>(),
  {
    className: undefined,
    sticky: false,
    variant: "default",
  },
);

const isCompact = computed(() => props.variant === "compact");
</script>

<template>
  <thead
    v-bind="$attrs"
    class="phi-table-header"
    :class="[
      className,
      {
        'phi-table-header--compact': isCompact,
        'phi-table-header--sticky': sticky,
      },
    ]"
    :data-compact="isCompact ? '' : undefined"
    data-phi-component="Table"
    data-phi-part="header"
  >
    <slot />
  </thead>
</template>

<style src="./table.css"></style>
