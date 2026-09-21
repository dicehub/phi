<script setup lang="ts">
import { computed } from "vue";
import { useCommandPaletteGroupContext } from "./command-palette-context";

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  items?: unknown[];
}>();

const groupItems = useCommandPaletteGroupContext();
const resolvedItems = computed(() => props.items ?? groupItems?.value ?? []);
</script>

<template>
  <div v-bind="$attrs" class="phi-command-palette-items">
    <slot v-for="(item, index) in resolvedItems" :key="index" :index="index" :item="item" />
  </div>
</template>

<style src="./command-palette.css"></style>
