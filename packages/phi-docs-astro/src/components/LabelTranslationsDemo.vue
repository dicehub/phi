<script setup lang="ts">
import { computed, ref } from "vue";
import { Checkbox, Field, Input, InputArea, InputGroup, Label, LocaleProvider, Select } from "@dicehub/phi";

const language = ref("pt");
const translations = computed(() => language.value === "pt"
  ? { label: { optional: "(opcional)", tooltip: "Mais informações" } } : {});
</script>

<template>
  <div class="label-translations-demo">
    <div class="label-translations-demo__language">
      <button type="button" @click="language = 'en'">Use English</button>
      <button type="button" @click="language = 'pt'">Use Portuguese</button>
    </div>
    <LocaleProvider :translations="translations">
      <Label show-optional tooltip="Ajuda" data-example="translated-label">Name</Label>
      <Label show-optional optional-label="(custom)" tooltip="Ajuda" tooltip-aria-label="Custom help" data-example="overrides">Custom</Label>
      <Label show-optional data-example="rich-optional">
        Rich content
        <template #optionalLabel><strong>(custom rich text)</strong></template>
      </Label>
      <Input label="Phone" :required="false" label-tooltip="Ajuda" />
      <InputArea label="Notes" :required="false" label-tooltip="Ajuda" />
      <InputGroup label="Search" :required="false" label-tooltip="Ajuda"><InputGroup.Input /></InputGroup>
      <Field label="Email" :required="false" label-tooltip="Ajuda"><Input type="email" /></Field>
      <Select label="Country" :required="false" label-tooltip="Ajuda" :items="[{ label: 'Portugal', value: 'pt' }]" />
      <Checkbox label="Updates" :required="false" label-tooltip="Ajuda" />
      <LocaleProvider :translations="{ label: { tooltip: 'Nested help' } }">
        <Label show-optional tooltip="Ajuda" data-example="nested">Nested</Label>
      </LocaleProvider>
    </LocaleProvider>
  </div>
</template>

<style scoped>
.label-translations-demo { display: grid; width: min(100%, 20rem); gap: 1rem; }
.label-translations-demo__language { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.label-translations-demo__language button {
  border: 1px solid var(--phi-line);
  border-radius: 0.375rem;
  padding: 0.375rem 0.625rem;
  background: var(--phi-base);
  color: var(--phi-default);
  font: inherit;
  cursor: pointer;
}
</style>
