<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Combobox.ItemGroup class="phi-autocomplete-group" v-bind="$attrs">
    <slot />
  </Combobox.ItemGroup>
</template>
