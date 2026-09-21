<script setup lang="ts">
import { Dialog } from "@ark-ui/vue/dialog";
</script>

<template>
  <Dialog.Trigger as-child>
    <slot />
  </Dialog.Trigger>
</template>
