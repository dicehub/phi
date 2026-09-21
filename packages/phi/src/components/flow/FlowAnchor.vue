<script setup lang="ts">
import { computed } from "vue";
import { type FlowAnchorType } from "./flow";

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  type?: FlowAnchorType;
}>();

const anchorType = computed(() => props.type ?? "start end");
</script>

<template>
  <div v-bind="$attrs" class="phi-flow-anchor" :data-flow-anchor="anchorType">
    <slot />
  </div>
</template>

<style src="./flow.css"></style>
