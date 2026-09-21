<script setup lang="ts">
import { CollapsibleTrigger } from "@ark-ui/vue/collapsible";

defineOptions({ inheritAttrs: false });

defineProps<{
  asChild?: boolean;
  disabled?: boolean;
}>();
</script>

<template>
  <CollapsibleTrigger
    v-bind="$attrs"
    class="phi-collapsible-trigger"
    :as-child="asChild"
    :disabled="disabled"
  >
    <slot />
  </CollapsibleTrigger>
</template>
