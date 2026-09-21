<script setup lang="ts">
import { computed } from "vue";
import { Combobox } from "@ark-ui/vue/combobox";
import { usePhiComboboxContext, type ComboboxSize } from "./combobox-context";

defineOptions({ inheritAttrs: false });

defineSlots<{
  clear?: () => unknown;
  default?: () => unknown;
  trigger?: () => unknown;
}>();

const props = withDefaults(
  defineProps<{
    asChild?: boolean;
    clearable?: boolean;
    placeholder?: string;
    showTrigger?: boolean;
    size?: ComboboxSize;
  }>(),
  {
    asChild: false,
    clearable: true,
    showTrigger: true,
  },
);

const context = usePhiComboboxContext();
const resolvedSize = computed(() => props.size ?? context.size.value);
</script>

<template>
  <Combobox.Input
    v-if="asChild"
    v-bind="$attrs"
    as-child
    :aria-describedby="context.describedBy.value"
    :placeholder="placeholder"
  >
    <slot />
  </Combobox.Input>

  <Combobox.Control
    v-else
    class="phi-combobox-control"
    :class="`phi-combobox-control--${resolvedSize}`"
    :data-invalid="context.invalid.value ? '' : undefined"
  >
    <Combobox.Input
      v-bind="$attrs"
      class="phi-combobox-input"
      :aria-describedby="context.describedBy.value"
      :placeholder="placeholder"
    />
    <Combobox.ClearTrigger v-if="clearable" class="phi-combobox-icon-button" aria-label="Clear selection">
      <slot name="clear">
        <span class="phi-combobox-clear-icon" aria-hidden="true"></span>
      </slot>
    </Combobox.ClearTrigger>
    <Combobox.Trigger v-if="showTrigger" class="phi-combobox-icon-button" aria-label="Toggle options">
      <slot name="trigger">
        <span class="phi-combobox-caret-icon" aria-hidden="true"></span>
      </slot>
    </Combobox.Trigger>
  </Combobox.Control>
</template>
