<script setup lang="ts">
import { Select as ArkSelect } from "@ark-ui/vue/select";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <ArkSelect.ItemGroupLabel v-bind="$attrs" class="phi-select-group-label">
    <slot />
  </ArkSelect.ItemGroupLabel>
</template>

<style src="./select.css"></style>
