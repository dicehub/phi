<script setup lang="ts">
import { Meter } from "@dicehub/phi/components/meter";

type DemoVariant = "preview" | "usage" | "basic" | "custom-value" | "hidden-value" | "full" | "low";

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
  <div class="meter-demo">
    <Meter
      v-if="variant === 'custom-value'"
      label="API requests"
      :value="75"
      custom-value="750 / 1,000"
    />
    <Meter
      v-else-if="variant === 'hidden-value'"
      label="Progress"
      :value="40"
      :show-value="false"
    />
    <Meter
      v-else-if="variant === 'full'"
      label="Quota reached"
      :value="100"
    />
    <Meter
      v-else-if="variant === 'low'"
      label="Memory usage"
      :value="15"
    />
    <Meter
      v-else
      label="Storage used"
      :value="65"
    />
  </div>
</template>

<style scoped>
.meter-demo {
  display: flex;
  width: 100%;
  min-height: 7rem;
  align-items: center;
  justify-content: center;
  color: var(--docs-default);
}

.meter-demo .phi-meter {
  width: min(100%, 22rem);
}
</style>
