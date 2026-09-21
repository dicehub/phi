<script setup lang="ts">
import { CollapsibleContent } from "@ark-ui/vue/collapsible";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <CollapsibleContent v-bind="$attrs" class="phi-collapsible-default-panel">
    <div class="phi-collapsible-default-panel__content">
      <slot />
    </div>
  </CollapsibleContent>
</template>
