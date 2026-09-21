<script setup lang="ts">
import { useAttrs } from "vue";
import { Combobox } from "@ark-ui/vue/combobox";
import { useCommandPaletteContext } from "./command-palette-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    autoFocus?: boolean;
    placeholder?: string;
  }>(),
  {
    autoFocus: true,
  },
);

const attrs = useAttrs();
const context = useCommandPaletteContext("CommandPalette.Input");

const handleKeydown = (event: KeyboardEvent) => {
  if (event.defaultPrevented) return;

  if (event.key === "Enter" && !event.isComposing) {
    const newTab = event.metaKey || event.ctrlKey;
    event.preventDefault();
    context.selectHighlightedItem({ event, newTab });
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    context.close();
  }
};
</script>

<template>
  <div class="phi-command-palette-input-header">
    <slot name="leading">
      <span class="phi-command-palette-search-icon" aria-hidden="true"></span>
    </slot>
    <Combobox.Input
      autocomplete="off"
      autocapitalize="none"
      autocorrect="off"
      v-bind="attrs"
      :autofocus="props.autoFocus"
      class="phi-command-palette-input"
      :placeholder="props.placeholder"
      spellcheck="false"
      @keydown="handleKeydown"
    />
    <slot name="trailing" />
  </div>
</template>

<style src="./command-palette.css"></style>
