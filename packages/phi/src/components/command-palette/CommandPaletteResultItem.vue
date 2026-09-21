<script setup lang="ts">
import CommandPaletteHighlightedText from "./CommandPaletteHighlightedText.vue";
import CommandPaletteItem from "./CommandPaletteItem.vue";
import type { CommandPaletteHighlightRange } from "./command-palette-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    breadcrumbHighlights?: CommandPaletteHighlightRange[][];
    breadcrumbs?: string[];
    description?: string;
    disabled?: boolean;
    external?: boolean;
    nonInteractive?: boolean;
    showArrow?: boolean;
    title: string;
    titleHighlights?: CommandPaletteHighlightRange[];
    value: unknown;
  }>(),
  {
    breadcrumbs: () => [],
    showArrow: true,
  },
);

const emit = defineEmits<{
  select: [value: unknown, event: MouseEvent];
}>();
</script>

<template>
  <CommandPaletteItem
    v-bind="$attrs"
    :disabled="disabled || nonInteractive"
    class="phi-command-palette-result-item"
    :class="{
      'phi-command-palette-result-item--external': external,
      'phi-command-palette-result-item--non-interactive': nonInteractive,
    }"
    :value="value"
    @select="(selectedValue, event) => emit('select', selectedValue, event)"
  >
    <span v-if="$slots.icon" class="phi-command-palette-result-item__icon">
      <slot name="icon" />
    </span>
    <span class="phi-command-palette-result-item__body">
      <span class="phi-command-palette-result-item__line">
        <template v-for="(breadcrumb, index) in breadcrumbs" :key="`${breadcrumb}-${index}`">
          <CommandPaletteHighlightedText
            class="phi-command-palette-result-item__breadcrumb"
            :highlights="breadcrumbHighlights?.[index]"
            :text="breadcrumb"
          />
          <span class="phi-command-palette-result-item__separator" aria-hidden="true">/</span>
        </template>
        <CommandPaletteHighlightedText
          class="phi-command-palette-result-item__title"
          :highlights="titleHighlights"
          :text="title"
        />
        <span v-if="external" class="phi-command-palette-result-item__external" aria-hidden="true"></span>
        <span v-if="description" class="phi-command-palette-result-item__description">{{ description }}</span>
      </span>
    </span>
    <span v-if="showArrow && !external && !nonInteractive" class="phi-command-palette-result-item__arrow" aria-hidden="true"></span>
  </CommandPaletteItem>
</template>

<style src="./command-palette.css"></style>
