<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Combobox.ItemGroupLabel class="phi-autocomplete-group-label" v-bind="$attrs">
    <slot />
  </Combobox.ItemGroupLabel>
</template>
