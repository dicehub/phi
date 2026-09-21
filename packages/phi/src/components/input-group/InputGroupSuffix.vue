<script setup lang="ts">
import { computed } from "vue";
import { INPUT_DEFAULT_SIZE, resolveInputSize } from "../input";
import { useInputGroupContext } from "./context";

const context = useInputGroupContext();
const resolvedSize = computed(() => context?.size.value ?? resolveInputSize(INPUT_DEFAULT_SIZE));
</script>

<template>
  <div data-slot="input-group-suffix" class="phi-input-group-suffix" :class="[`phi-input-group-suffix--${resolvedSize}`]">
    <span class="phi-input-group-suffix__text"><slot /></span>
  </div>
</template>
