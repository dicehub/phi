<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });

defineProps<{
  id?: string;
}>();
</script>

<template>
  <Combobox.ItemGroup v-bind="$attrs" class="phi-combobox-group" :id="id">
    <slot />
  </Combobox.ItemGroup>
</template>
