<script setup lang="ts">
import { computed } from "vue";
import { createCommandPaletteSegments, type CommandPaletteHighlightRange } from "./command-palette-context";

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  highlights?: CommandPaletteHighlightRange[];
  text: string;
}>();

const segments = computed(() => createCommandPaletteSegments(props.text, props.highlights));
</script>

<template>
  <span v-bind="$attrs" class="phi-command-palette-highlighted-text">
    <template v-for="(segment, index) in segments" :key="`${segment.text}-${index}`">
      <mark v-if="segment.highlighted" class="phi-command-palette-mark">{{ segment.text }}</mark>
      <span v-else>{{ segment.text }}</span>
    </template>
  </span>
</template>

<style src="./command-palette.css"></style>
