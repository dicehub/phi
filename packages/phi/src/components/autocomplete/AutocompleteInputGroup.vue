<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    clearable?: boolean;
    placeholder?: string;
    showTrigger?: boolean;
    size?: "xs" | "sm" | "base" | "lg";
  }>(),
  {
    clearable: false,
    showTrigger: false,
    size: "base",
  },
);
</script>

<template>
  <Combobox.Control class="phi-autocomplete-control" :class="`phi-autocomplete-control--${size}`">
    <Combobox.Input v-bind="$attrs" class="phi-autocomplete-input" :placeholder="placeholder" />
    <Combobox.ClearTrigger v-if="clearable" class="phi-autocomplete-clear-trigger" aria-label="Clear input">
      <slot name="clear">
        <span class="phi-autocomplete-clear-icon" aria-hidden="true"></span>
      </slot>
    </Combobox.ClearTrigger>
    <Combobox.Trigger v-if="showTrigger" class="phi-autocomplete-trigger" aria-label="Toggle suggestions">
      <slot name="trigger">
        <span class="phi-autocomplete-trigger-icon" aria-hidden="true"></span>
      </slot>
    </Combobox.Trigger>
  </Combobox.Control>
</template>
