<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Combobox.Label class="phi-autocomplete-label" v-bind="$attrs">
    <slot />
  </Combobox.Label>
</template>
