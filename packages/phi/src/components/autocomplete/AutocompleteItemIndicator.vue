<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Combobox.ItemIndicator class="phi-autocomplete-item-indicator" v-bind="$attrs">
    <slot>
      <span class="phi-autocomplete-check" aria-hidden="true"></span>
    </slot>
  </Combobox.ItemIndicator>
</template>
