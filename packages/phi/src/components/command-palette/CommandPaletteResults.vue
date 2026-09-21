<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";
import { useCommandPaletteContext } from "./command-palette-context";

defineOptions({ inheritAttrs: false });

const context = useCommandPaletteContext("CommandPalette.Results");
</script>

<template>
  <Combobox.List v-bind="$attrs" class="phi-command-palette-results">
    <slot v-for="(item, index) in context.items.value" :key="index" :index="index" :item="item" />
  </Combobox.List>
</template>

<style src="./command-palette.css"></style>
