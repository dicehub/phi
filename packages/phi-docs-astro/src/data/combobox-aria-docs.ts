export const accessibleNamesCode = `<script setup>
import { Combobox } from "@dicehub/phi/components/combobox";
const fruits = ["Apple", "Banana", "Cherry"];
</script>

<template>
  <p id="fruits-label">Favorite fruits</p>
  <p id="fruits-hint">Use the arrow keys to choose a fruit.</p>
  <Combobox :items="fruits" multiple description="You can choose more than one fruit.">
    <Combobox.TriggerMultipleWithInput
      aria-labelledby="fruits-label"
      aria-describedby="fruits-hint"
      placeholder="Add a fruit"
    />
    <Combobox.Content>
      <Combobox.List>
        <template #default="{ item }">
          <Combobox.Item :item="item">{{ item }}</Combobox.Item>
        </template>
      </Combobox.List>
    </Combobox.Content>
  </Combobox>
</template>`;
