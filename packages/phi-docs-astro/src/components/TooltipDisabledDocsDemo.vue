<script setup lang="ts">
import { ref } from "vue";
import { Tooltip } from "@dicehub/phi/components/tooltip";
import { Text } from "@dicehub/phi/components/text";

const disabled = ref(true);
</script>

<template>
  <div data-tooltip-disabled-demo>
    <label><input v-model="disabled" type="checkbox" /> Disable tooltip</label>
    <div class="tooltip-disabled-demo__row">
      <button type="button">Before</button>
      <Tooltip :disabled="disabled" content="Full variable name" :delay="0">
        <Text truncate>Variable name</Text>
      </Tooltip>
      <button type="button">After</button>
    </div>
    <div class="tooltip-disabled-demo__row" data-custom-trigger>
      <button type="button">Before custom</button>
      <Tooltip as-child :disabled="disabled" content="Save changes" :delay="0">
        <button type="button">Save</button>
      </Tooltip>
      <Tooltip as-child :disabled="disabled" content="Help excluded from tab order" :delay="0">
        <button type="button" tabindex="-1">Custom excluded</button>
      </Tooltip>
      <button type="button">After custom</button>
    </div>
  </div>
</template>

<style scoped>
[data-tooltip-disabled-demo] { display: grid; gap: 1rem; }
.tooltip-disabled-demo__row { display: flex; align-items: center; flex-wrap: wrap; gap: 1rem; }
</style>
