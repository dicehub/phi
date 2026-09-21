<script setup lang="ts">
import { CollapsibleContent } from "@ark-ui/vue/collapsible";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <CollapsibleContent v-bind="$attrs" class="phi-collapsible-panel">
    <slot />
  </CollapsibleContent>
</template>
