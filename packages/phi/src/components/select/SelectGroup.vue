<script setup lang="ts">
import { Select as ArkSelect } from "@ark-ui/vue/select";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <ArkSelect.ItemGroup v-bind="$attrs" class="phi-select-group">
    <slot />
  </ArkSelect.ItemGroup>
</template>

<style src="./select.css"></style>
