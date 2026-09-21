<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Combobox.Empty class="phi-autocomplete-empty" v-bind="$attrs">
    <slot>No results found.</slot>
  </Combobox.Empty>
</template>
