<script setup lang="ts">
import { Dialog } from "@ark-ui/vue/dialog";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Dialog.Description v-bind="$attrs" class="phi-dialog-description">
    <slot />
  </Dialog.Description>
</template>
