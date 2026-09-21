<script setup lang="ts">
import { computed } from "vue";
import { INPUT_DEFAULT_SIZE, resolveInputSize } from "../input";
import { provideInputGroupAddonContext, useInputGroupContext } from "./context";

const props = withDefaults(
  defineProps<{
    align?: "start" | "end";
  }>(),
  {
    align: "start",
  },
);

const context = useInputGroupContext();
const resolvedSize = computed(() => context?.size.value ?? resolveInputSize(INPUT_DEFAULT_SIZE));

provideInputGroupAddonContext();
</script>

<template>
  <div
    :data-slot="align === 'start' ? 'input-group-addon-start' : 'input-group-addon-end'"
    class="phi-input-group-addon"
    :class="[`phi-input-group-addon--${align}`, `phi-input-group-addon--${resolvedSize}`]"
  >
    <slot />
  </div>
</template>
