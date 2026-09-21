<script setup lang="ts">
import { computed } from "vue";
import { Combobox } from "@ark-ui/vue/combobox";
import { provideCommandPaletteGroupContext } from "./command-palette-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    items?: unknown[];
  }>(),
  {
    items: () => [],
  },
);

provideCommandPaletteGroupContext(computed(() => props.items));
</script>

<template>
  <Combobox.ItemGroup v-bind="$attrs" class="phi-command-palette-group">
    <slot />
  </Combobox.ItemGroup>
</template>

<style src="./command-palette.css"></style>
