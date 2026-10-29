<script setup lang="ts">
import { ref } from "vue";
import { Field } from "@dicehub/phi/components/field";
import { Input, InputArea } from "@dicehub/phi/components/input";
import { TagInput } from "@dicehub/phi/components/tag-input";

const showLabel = ref(false);
const optional = ref(false);
const tooltip = ref(false);
const hidden = ref(false);
</script>

<template>
  <div data-field-label-content>
    <div class="field-label-controls">
      <label><input v-model="showLabel" type="checkbox" /> Show label text</label>
      <label><input v-model="optional" type="checkbox" /> Show optional indicator</label>
      <label><input v-model="tooltip" type="checkbox" /> Show label tooltip</label>
      <label><input v-model="hidden" type="checkbox" /> Hide Field label</label>
    </div>
    <div v-for="(component, name) in { Input, InputArea }" :key="name" :data-uncontrolled-case="name">
      <component :is="component" :aria-label="`${name} draft`">
        <template #label><span v-if="showLabel">{{ name }} draft label</span></template>
      </component>
    </div>
    <div data-empty-text-labels>
      <Field label="Unused fallback"><template #label>{{ '' }}</template><Input aria-label="Empty Field slot" /></Field>
      <component v-for="(component, name) in { Input, InputArea, TagInput }" :is="component" :key="name"
        label="Unused fallback" :aria-label="`Empty ${name} slot`">
        <template #label>{{ ' ' }}</template>
      </component>
    </div>
    <div data-label-case="Field">
      <Field id="field-label-content-control" :required="optional ? false : undefined" :label-tooltip="tooltip ? 'Help' : undefined" :hide-label="hidden" description="Field help">
        <template #label><span v-if="showLabel">Field label</span></template>
        <Input id="field-label-content-control" aria-label="Field control" />
      </Field>
    </div>
    <div v-for="(component, name) in { Input, InputArea, TagInput }" :key="name" :data-label-case="name">
      <component :is="component" :aria-label="`${name} control`" :required="optional ? false : undefined"
        :label-tooltip="tooltip ? 'Help' : undefined" :description="`${name} help`">
        <template #label><template v-if="showLabel">{{ name }} label</template></template>
      </component>
    </div>
  </div>
</template>

<style scoped>
[data-field-label-content] { display: grid; gap: 1rem; max-width: 28rem; }
.field-label-controls { display: grid; gap: 0.5rem; }
</style>
