<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/phi/components/button";
import { Select } from "@dicehub/phi/components/select";

const nameMode = ref("label");
const labelMode = ref("rich");
const items = { east: "East", west: "West" };
</script>

<template>
  <div class="select-naming-demo">
    <div class="docs-demo-row">
      <div>
        <label for="select-name-source">Name source</label>
        <select id="select-name-source" v-model="nameMode">
          <option value="label">Component label</option>
          <option value="direct">aria-label</option>
          <option value="external">aria-labelledby</option>
          <option value="both">Both ARIA names</option>
        </select>
      </div>
      <div>
        <label for="select-label-content">Label content</label>
        <select id="select-label-content" v-model="labelMode">
          <option value="rich">Rich label</option>
          <option value="text">Text label</option>
          <option value="hidden">Hidden label</option>
          <option value="none">No component label</option>
        </select>
      </div>
    </div>
    <div v-for="kind in ['standard', 'custom']" :key="kind" :data-select-naming="kind">
      <p :id="`select-naming-${kind}-external`">Deployment region</p>
      <Select
        :id="`select-naming-${kind}`"
        :items="items"
        :label="labelMode === 'text' ? 'Region' : undefined"
        :hide-label="labelMode === 'hidden'"
        :aria-label="nameMode === 'direct' || nameMode === 'both' ? 'Target region' : undefined"
        :aria-labelledby="nameMode === 'external' || nameMode === 'both' ? `select-naming-${kind}-external` : undefined"
        placeholder="Choose a region"
      >
        <template v-if="labelMode === 'rich' || labelMode === 'hidden'" #label>
          <strong>Region</strong><span aria-hidden="true"> *</span>
        </template>
        <template v-if="kind === 'custom'" #trigger="{ label }">
          <Button>{{ label }}</Button>
        </template>
      </Select>
    </div>
  </div>
</template>

<style scoped>
.select-naming-demo { display: grid; width: 100%; gap: 1rem; }
.select-naming-demo .docs-demo-row > div { display: grid; gap: 0.25rem; }
.select-naming-demo p { margin: 0 0 0.5rem; }
</style>
