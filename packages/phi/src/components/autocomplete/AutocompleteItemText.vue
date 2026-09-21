<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Combobox.ItemText class="phi-autocomplete-item-text" v-bind="$attrs">
    <slot />
  </Combobox.ItemText>
</template>
