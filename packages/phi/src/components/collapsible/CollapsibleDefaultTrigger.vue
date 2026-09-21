<script setup lang="ts">
import { CollapsibleTrigger } from "@ark-ui/vue/collapsible";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <CollapsibleTrigger v-bind="$attrs" class="phi-collapsible-default-trigger">
    <span class="phi-collapsible-default-trigger__label">
      <slot />
    </span>
    <span class="phi-collapsible-default-trigger__icon-frame">
      <svg
        class="phi-collapsible-default-trigger__icon"
        viewBox="0 0 16 16"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M4.22 5.72a.75.75 0 0 1 1.06 0L8 8.44l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 6.78a.75.75 0 0 1 0-1.06Z" />
      </svg>
    </span>
  </CollapsibleTrigger>
</template>
