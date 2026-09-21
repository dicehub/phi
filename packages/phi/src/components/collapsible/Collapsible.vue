<script setup lang="ts">
import { CollapsibleRoot, type CollapsibleOpenChangeDetails } from "@ark-ui/vue/collapsible";

defineOptions({ inheritAttrs: false });

defineProps<{
  collapsedHeight?: number | string;
  collapsedWidth?: number | string;
  defaultOpen?: boolean;
  disabled?: boolean;
  id?: string;
  lazyMount?: boolean;
  open?: boolean;
  unmountOnExit?: boolean;
}>();

const emit = defineEmits<{
  exitComplete: [];
  openChange: [details: CollapsibleOpenChangeDetails];
  "update:open": [open: boolean];
}>();
</script>

<template>
  <CollapsibleRoot
    v-bind="$attrs"
    class="phi-collapsible"
    :collapsed-height="collapsedHeight"
    :collapsed-width="collapsedWidth"
    :default-open="defaultOpen"
    :disabled="disabled"
    :id="id"
    :lazy-mount="lazyMount"
    :open="open"
    :unmount-on-exit="unmountOnExit"
    @exit-complete="emit('exitComplete')"
    @open-change="(details) => emit('openChange', details)"
    @update:open="(nextOpen) => emit('update:open', nextOpen)"
  >
    <slot />
  </CollapsibleRoot>
</template>

<style src="./collapsible.css"></style>
