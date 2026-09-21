<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";
import { useCommandPaletteContext } from "./command-palette-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    value: unknown;
  }>(),
  {
    disabled: false,
  },
);

const emit = defineEmits<{
  select: [value: unknown, event: MouseEvent];
}>();

const context = useCommandPaletteContext("CommandPalette.Item");

const handleClickCapture = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault();
    event.stopPropagation();
  }
};

const handleClick = (event: MouseEvent) => {
  if (props.disabled) return;

  emit("select", props.value, event);

  if (event.metaKey || event.ctrlKey) {
    event.preventDefault();
    event.stopPropagation();
    context.selectItem(props.value, { event, newTab: true });
  }
};
</script>

<template>
  <Combobox.Item
    v-bind="$attrs"
    :aria-disabled="disabled ? 'true' : undefined"
    class="phi-command-palette-item"
    :data-disabled="disabled ? '' : undefined"
    :item="value"
    @click.capture="handleClickCapture"
    @click="handleClick"
  >
    <Combobox.ItemText class="phi-command-palette-item__text">
      <slot />
    </Combobox.ItemText>
  </Combobox.Item>
</template>

<style src="./command-palette.css"></style>
