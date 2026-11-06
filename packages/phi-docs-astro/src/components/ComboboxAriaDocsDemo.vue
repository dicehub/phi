<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/phi/components/button";
import { Combobox } from "@dicehub/phi/components/combobox";

const fruits = ["Apple", "Banana", "Cherry"];
const showError = ref(false);
const useExternalName = ref(false);
</script>

<template>
  <div class="combobox-aria-demo">
    <div class="combobox-aria-demo__example" data-aria-example="multiple">
      <p id="combobox-aria-fruits-label">Favorite fruits</p>
      <p id="combobox-aria-fruits-hint">Use the arrow keys to choose a fruit.</p>
      <Combobox
        id="combobox-aria-fruits"
        :items="fruits"
        multiple
        description="You can choose more than one fruit."
        :error="showError ? 'Choose a fruit before you continue.' : undefined"
      >
        <Combobox.TriggerMultipleWithInput
          class="combobox-aria-demo__multi"
          :aria-label="useExternalName ? undefined : 'Fruit selection'"
          :aria-labelledby="useExternalName ? 'combobox-aria-fruits-label' : undefined"
          aria-describedby="combobox-aria-fruits-hint"
          placeholder="Add a fruit"
          :clearable="false"
          :show-trigger="false"
        />
        <Combobox.Content>
          <Combobox.List>
            <template #default="{ item }"><Combobox.Item :item="item">{{ item }}</Combobox.Item></template>
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
      <div class="combobox-aria-demo__actions">
        <Button @click="useExternalName = !useExternalName">
          {{ useExternalName ? "Use direct name" : "Use visible name" }}
        </Button>
        <Button @click="showError = !showError">{{ showError ? "Hide validation error" : "Show validation error" }}</Button>
      </div>
    </div>

    <div class="combobox-aria-demo__example" data-aria-example="value">
      <p id="combobox-aria-value-hint">Choose a fruit for the delivery.</p>
      <Combobox id="combobox-aria-value" :items="fruits" description="A delivery contains one fruit.">
        <Combobox.TriggerValue aria-label="Delivery fruit" aria-describedby="combobox-aria-value-hint" placeholder="Choose a fruit" />
        <Combobox.Content>
          <Combobox.Input aria-label="Search delivery fruits" />
          <Combobox.List>
            <template #default="{ item }"><Combobox.Item :item="item">{{ item }}</Combobox.Item></template>
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
    </div>

    <div class="combobox-aria-demo__example" data-aria-example="custom">
      <p id="combobox-aria-custom-label">Gift fruit</p>
      <p id="combobox-aria-custom-hint">Choose a fruit for the gift.</p>
      <Combobox id="combobox-aria-custom" :items="fruits" :default-value="['Apple']" description="A gift contains one fruit.">
        <Combobox.TriggerValue as-child aria-labelledby="combobox-aria-custom-label" aria-describedby="combobox-aria-custom-hint">
          <template #default="{ label }"><Button>Gift: {{ label }}</Button></template>
        </Combobox.TriggerValue>
        <Combobox.Content>
          <Combobox.Input aria-label="Search gift fruits" />
          <Combobox.List>
            <template #default="{ item }"><Combobox.Item :item="item">{{ item }}</Combobox.Item></template>
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
    </div>
  </div>
</template>

<style scoped>
.combobox-aria-demo { display: grid; width: 100%; gap: 1.5rem; }
.combobox-aria-demo__example { display: grid; gap: 0.75rem; }
.combobox-aria-demo__example > p { margin: 0; color: var(--phi-subtle); font-size: 0.875rem; }
.combobox-aria-demo__actions { display: flex; flex-wrap: wrap; gap: 0.5rem; }
</style>
