<script setup lang="ts">
import { Loader } from "@dicehub/phi/components/loader";

type DemoVariant = "preview" | "usage" | "default" | "custom";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);
</script>

<template>
  <div class="loader-demo">
    <Loader v-if="variant === 'custom'" :size="24" />
    <Loader v-else />
  </div>
</template>

<style scoped>
.loader-demo {
  display: flex;
  width: 100%;
  min-height: 7rem;
  align-items: center;
  justify-content: center;
  color: var(--docs-default);
}
</style>
