<script setup lang="ts">
import CommandPaletteDialog from "./CommandPaletteDialog.vue";
import CommandPalettePanel from "./CommandPalettePanel.vue";
import type { CommandPaletteHighlightDetails, CommandPaletteSelectOptions } from "./command-palette-context";

const props = withDefaults(
  defineProps<{
    defaultValue?: string;
    filter?: false | ((item: unknown, query: string) => boolean);
    getSelectableItems?: (items: unknown[]) => unknown[];
    itemToStringValue?: (item: unknown) => string;
    items?: unknown[];
    open?: boolean;
    value?: string;
  }>(),
  {
    items: () => [],
    open: false,
  },
);

const emit = defineEmits<{
  close: [];
  itemHighlighted: [item: unknown | undefined, details: CommandPaletteHighlightDetails];
  openChange: [open: boolean];
  select: [item: unknown, options: CommandPaletteSelectOptions];
  "update:open": [open: boolean];
  "update:value": [value: string];
  valueChange: [value: string];
}>();

const setOpen = (open: boolean) => {
  emit("update:open", open);
  emit("openChange", open);
  if (!open) emit("close");
};
</script>

<template>
  <CommandPaletteDialog :open="open" @update:open="setOpen">
    <CommandPalettePanel
      :default-value="defaultValue"
      :filter="filter"
      :get-selectable-items="getSelectableItems"
      :item-to-string-value="itemToStringValue"
      :items="items"
      :open="open"
      :value="value"
      @close="setOpen(false)"
      @item-highlighted="(item, details) => emit('itemHighlighted', item, details)"
      @select="(item, options) => emit('select', item, options)"
      @update:value="(nextValue) => emit('update:value', nextValue)"
      @value-change="(nextValue) => emit('valueChange', nextValue)"
    >
      <slot />
    </CommandPalettePanel>
  </CommandPaletteDialog>
</template>

<style src="./command-palette.css"></style>
