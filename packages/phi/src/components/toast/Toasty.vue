<script setup lang="ts">
import { computed } from "vue";
import ToastViewport from "./ToastViewport.vue";
import {
  PHI_TOAST_DEFAULT_VARIANTS,
  createPhiToastManager,
  providePhiToastManager,
  type PhiToastManager,
  type ToastVariant,
} from "./toast";

const props = withDefaults(
  defineProps<{
    container?: string | HTMLElement;
    toastManager?: PhiToastManager;
    variant?: ToastVariant;
  }>(),
  {
    variant: PHI_TOAST_DEFAULT_VARIANTS.variant,
  },
);

const localToastManager = createPhiToastManager();
const manager = computed(() => props.toastManager ?? localToastManager);
const teleportTarget = computed(() => props.container ?? "body");

providePhiToastManager(manager.value);
</script>

<template>
  <slot />
  <Teleport :to="teleportTarget">
    <ToastViewport :manager="manager" :variant="variant" />
  </Teleport>
</template>

<style src="./toast.css"></style>
