<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Combobox.Positioner class="phi-autocomplete-positioner">
    <Combobox.Content class="phi-autocomplete-content" v-bind="$attrs">
      <slot />
    </Combobox.Content>
  </Combobox.Positioner>
</template>
