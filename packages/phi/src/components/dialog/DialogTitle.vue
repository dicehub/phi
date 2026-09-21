<script setup lang="ts">
import { Dialog } from "@ark-ui/vue/dialog";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Dialog.Title v-bind="$attrs" class="phi-dialog-title">
    <slot />
  </Dialog.Title>
</template>
