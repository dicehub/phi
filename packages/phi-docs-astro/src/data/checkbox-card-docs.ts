export const checkboxCardExamples = [
  {
    id: "checkbox-card",
    title: "Checkbox Card",
    variant: "card",
    description: 'Use appearance="card" to join items inside one outline with dividers. Items can include a description prop or slot. The checkbox follows the label by default.',
    code: `<script setup>
import { ref } from "vue";
import { Checkbox } from "@dicehub/phi/components/checkbox";

const products = ref(["web"]);
</script>

<template>
  <Checkbox.Group v-model="products" legend="Products" name="products" appearance="card">
    <Checkbox.Item value="web" label="Web traffic" description="Inspect HTTP requests." />
    <Checkbox.Item value="ai" label="AI prompts" description="Inspect prompts and responses." />
    <Checkbox.Item value="email" label="Outbound email" description="Inspect outgoing messages." />
  </Checkbox.Group>
</template>`,
  },
  {
    id: "checkbox-card-horizontal",
    title: "Checkbox Card (Horizontal)",
    variant: "horizontal",
    description: 'Horizontal card groups use two columns with row and column dividers. Below 641px, the items form one column.',
    code: `<script setup>
import { ref } from "vue";
import { Checkbox } from "@dicehub/phi/components/checkbox";

const products = ref(["web"]);
</script>

<template>
  <Checkbox.Group v-model="products" legend="Products" name="products" appearance="card" orientation="horizontal">
    <Checkbox.Item value="web" label="Web traffic" description="Inspect HTTP requests." />
    <Checkbox.Item value="ai" label="AI prompts" description="Inspect prompts and responses." />
    <Checkbox.Item value="email" label="Outbound email" description="Inspect outgoing messages." />
  </Checkbox.Group>
</template>`,
  },
  {
    id: "checkbox-card-control-first",
    title: "Checkbox Card (Control First)",
    variant: "control-first",
    description: 'Set control-first on the group to place the checkbox before the label. Items can override the group order and appearance.',
    code: `<Checkbox.Group appearance="card" legend="Notification channels" control-first :default-value="['email']">
  <Checkbox.Item value="email" label="Email" description="Receive email updates." />
  <Checkbox.Item value="sms" label="SMS" description="Not available on this plan." disabled />
</Checkbox.Group>`,
  },
  {
    id: "standalone-checkbox-card",
    title: "Standalone Checkbox Card",
    variant: "standalone",
    description: 'A card item outside a card group keeps its own border. Use default-checked for its initial state or v-model:checked to control it.',
    code: `<Checkbox.Item
  appearance="card"
  label="Usage alerts"
  description="Receive a message before you reach your limit."
  :default-checked="true"
/>`,
  },
] as const;
