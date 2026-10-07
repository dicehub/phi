export const labelBarrelCode = `import { Label } from "@dicehub/phi";`;

export const labelGranularCode = `import { Label } from "@dicehub/phi/components/label";`;

export const labelPreviewCode = `<script setup>
import { Label } from "@dicehub/phi/components/label";
</script>

<template>
  <div class="flex flex-col gap-4">
    <Label>Default Label</Label>
    <Label show-optional>Optional Label</Label>
    <Label tooltip="More information about this field">
      Label with Tooltip
    </Label>
  </div>
</template>`;

export const labelFormUsageCode = `<script setup>
import { Input } from "@dicehub/phi/components/input";
</script>

<template>
  <!-- Optional field with "(optional)" text -->
  <Input label="Phone" :required="false" placeholder="+1 555-0000" />

  <!-- With tooltip -->
  <Input
    label="API Key"
    label-tooltip="Find this in your dashboard settings"
  />
</template>`;

export const labelStandaloneUsageCode = `<script setup>
import { Label } from "@dicehub/phi/components/label";
</script>

<template>
  <Label tooltip="This field is mandatory">Username</Label>
</template>`;

export const labelTranslationsCode = `<script setup>
import { Input, Label, LocaleProvider } from "@dicehub/phi";
const translations = {
  label: { optional: "(opcional)", tooltip: "Mais informações" },
};
</script>

<template>
  <LocaleProvider :translations="translations">
    <Input label="Nome" :required="false" label-tooltip="Ajuda" />
    <Label show-optional tooltip="Ajuda">Nome</Label>
    <Label show-optional optional-label="(custom)" tooltip="Ajuda" tooltip-aria-label="Custom help">
      Custom
    </Label>
    <Label show-optional>
      Rich content
      <template #optionalLabel><strong>(custom rich text)</strong></template>
    </Label>
  </LocaleProvider>
</template>`;

const optionalFieldCode = `<script setup>
import { Input } from "@dicehub/phi/components/input";
</script>

<template>
  <Input label="Phone Number" :required="false" placeholder="+1 555-0000" />
</template>`;

const tooltipCode = `<script setup>
import { Input } from "@dicehub/phi/components/input";
</script>

<template>
  <Input
    label="API Key"
    label-tooltip="Find this in your dashboard settings under API > Keys"
    placeholder="sk_live_..."
  />
</template>`;

const richLabelCode = `<script setup>
import { Checkbox } from "@dicehub/phi/components/checkbox";
</script>

<template>
  <Checkbox default-checked>
    <span>I agree to the <strong>Terms of Service</strong></span>
  </Checkbox>
</template>`;

const mixedFormCode = `<script setup>
import { Select, createListCollection as createSelectCollection } from "@ark-ui/vue/select";
import { Input } from "@dicehub/phi/components/input";
import { PhCaretUpDown } from "@phosphor-icons/vue";

const countryItems = [
  { label: "United States", value: "us" },
  { label: "United Kingdom", value: "uk" },
  { label: "Canada", value: "ca" },
];

const countryCollection = createSelectCollection({
  items: countryItems,
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});
</script>

<template>
  <div class="flex max-w-md flex-col gap-4">
    <Input label="Full Name" placeholder="John Doe" />
    <Input
      label="Email"
      label-tooltip="We'll send your receipt here"
      placeholder="john@example.com"
      type="email"
    />
    <Input label="Company" :required="false" placeholder="Acme Inc." />
    <Select.Root :collection="countryCollection">
      <Select.Label>Country</Select.Label>
      <Select.Control>
        <Select.Trigger aria-label="Country">
          <Select.ValueText placeholder="Select a country" />
          <Select.Indicator>
            <PhCaretUpDown :size="16" aria-hidden="true" />
          </Select.Indicator>
        </Select.Trigger>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          <Select.Item v-for="country in countryItems" :key="country.value" :item="country">
            <Select.ItemText>{{ country.label }}</Select.ItemText>
          </Select.Item>
        </Select.Content>
      </Select.Positioner>
      <Select.HiddenSelect />
    </Select.Root>
  </div>
</template>`;

const standaloneCode = `<script setup>
import { Label } from "@dicehub/phi/components/label";
</script>

<template>
  <div class="flex flex-col gap-3">
    <Label>Default</Label>
    <Label show-optional>Optional</Label>
    <Label tooltip="Important field">With Tooltip</Label>
  </div>
</template>`;

export const labelExamples = [
  {
    id: "optional-field",
    title: "Optional Field",
    variant: "optional",
    description: 'Shows gray "(optional)" text when required is false.',
    code: optionalFieldCode,
  },
  {
    id: "with-tooltip",
    title: "With Tooltip",
    variant: "tooltip",
    description: "Shows an info icon with a tooltip for additional context.",
    code: tooltipCode,
  },
  {
    id: "rich-label-content",
    title: "Rich Label Content",
    variant: "rich",
    description: "Labels support slot content for rich formatting.",
    code: richLabelCode,
  },
  {
    id: "form-with-mixed-fields",
    title: "Form with Mixed Fields",
    variant: "mixed",
    description: "Real-world example showing required and optional fields together.",
    code: mixedFormCode,
  },
  {
    id: "standalone-label",
    title: "Standalone Label",
    variant: "standalone",
    description: "Use Label directly for custom layouts or non-form contexts.",
    code: standaloneCode,
  },
] as const;

export const labelProps = [
  { name: "default", type: "slot", defaultValue: "-", description: "Label content." },
  { name: "htmlFor", type: "string", defaultValue: "-", description: "ID of the form control this label is associated with. In templates, use html-for." },
  { name: "showOptional", type: "boolean", defaultValue: "false", description: 'Shows gray "(optional)" text after the label.' },
  { name: "optionalLabel", type: "string", defaultValue: "LocaleProvider text", description: "Overrides the optional marker. Empty text hides the marker text." },
  { name: "optionalLabel", type: "slot", defaultValue: "-", description: "Rich optional-marker content. Takes precedence over the prop and provider." },
  { name: "tooltip", type: "string", defaultValue: "-", description: "Tooltip text shown from the info icon." },
  { name: "tooltipAriaLabel", type: "string", defaultValue: "LocaleProvider text", description: "Overrides the tooltip button's accessible name." },
  { name: "as", type: '"label" | "span"', defaultValue: '"label"', description: "Element rendered by the root." },
  { name: "asContent", type: "boolean", defaultValue: "false", description: "Renders inline content styling without standalone label typography." },
];

export const formLabelProps = [
  { name: "label", type: "string | slot", defaultValue: "-", description: "Label content for built-in field wrappers." },
  { name: "required", type: "boolean", defaultValue: "-", description: 'When false, shows "(optional)" text and keeps the control optional.' },
  { name: "labelTooltip", type: "string", defaultValue: "-", description: "Tooltip text shown from the label info icon. In templates, use label-tooltip." },
];
