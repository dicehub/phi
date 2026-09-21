export const tagInputBarrelCode = `import { TagInput } from "@dicehub/phi";`;

export const tagInputGranularCode = `import { TagInput } from "@dicehub/phi/components/tag-input";`;

export const tagInputPreviewCode = `<script setup>
import { ref } from "vue";
import { TagInput } from "@dicehub/phi/components/tag-input";

const recipients = ref(["ava@example.com"]);
</script>

<template>
  <TagInput
    v-model="recipients"
    label="Recipients"
    description="Paste comma- or newline-separated email addresses."
    placeholder="name@example.com"
    :validate-value="(value) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)"
  />
</template>`;

export const tagInputUsageCode = `<script setup>
import { ref } from "vue";
import { TagInput } from "@dicehub/phi/components/tag-input";

const labels = ref(["frontend"]);
</script>

<template>
  <TagInput v-model="labels" label="Labels" placeholder="Add a label" />
</template>`;

export const tagInputDefaultValueCode = `<template>
  <TagInput
    label="Labels"
    description="Accepts any non-empty value."
    name="labels"
    placeholder="Add a label"
    required
    :default-value="['frontend', 'priority']"
  />
</template>`;

export const tagInputMaxValuesCode = `<template>
  <TagInput
    label="Access groups"
    placeholder="Type a group name"
    description="A maximum of three groups."
    :max-values="3"
    :default-value="['alpha']"
  />
</template>`;

export const tagInputValidationCode = `<script setup>
import { ref } from "vue";
import { TagInput } from "@dicehub/phi/components/tag-input";

const environments = ref(["staging"]);
</script>

<template>
  <TagInput
    v-model="environments"
    label="Environments"
    description="Lowercase names only."
    placeholder="Add an environment"
    :max-values="4"
    :validate-value="(value) => value === value.toLowerCase()"
  />
</template>`;

export const tagInputLocalizationCode = `<script setup>
import { TagInput } from "@dicehub/phi/components/tag-input";

const labels = {
  input: "Agregar etiqueta",
  removeValue: (value) => \`Eliminar \${value}\`,
  invalidValue: (value) => \`\${value} no es valido.\`,
  maxValuesReached: (maxValues) => \`Maximo de \${maxValues} etiquetas.\`,
};
</script>

<template>
  <TagInput label="Etiquetas" placeholder="Agregar una etiqueta" :labels="labels" :max-values="3" />
</template>`;

export const tagInputFallbackNamesCode = `<template>
  <TagInput placeholder="Add a tag" :default-value="['draft']" />
  <TagInput
    placeholder="Agregar una etiqueta"
    :labels="{ input: 'Agregar etiqueta' }"
  />
</template>`;

export const tagInputDisabledCode = `<template>
  <TagInput
    label="Regions"
    description="Locked while the deployment is running."
    disabled
    :default-value="['eu-central', 'us-east']"
  />
</template>`;

export const tagInputBareCode = `<template>
  <TagInput aria-label="Notes" placeholder="Add a note" :default-value="['checked']" />
</template>`;

export const tagInputSizesCode = `<template>
  <TagInput size="xs" label="Extra small" placeholder="xs" :default-value="['tag']" />
  <TagInput size="sm" label="Small" placeholder="sm" :default-value="['tag']" />
  <TagInput label="Base" placeholder="base (default)" :default-value="['tag']" />
  <TagInput size="lg" label="Large" placeholder="lg" :default-value="['tag']" />
</template>`;

export const tagInputExamples = [
  {
    id: "unrestricted-values",
    title: "Unrestricted Values",
    description: "Uncontrolled usage seeds the tags with defaultValue and accepts any non-empty value.",
    variant: "unrestricted",
    code: tagInputDefaultValueCode,
  },
  {
    id: "maximum-values",
    title: "Maximum Values",
    description:
      "maxValues stops further tags, keeps the rejected text in the input, and shows the localized limit message.",
    variant: "limited",
    code: tagInputMaxValuesCode,
  },
  {
    id: "validation",
    title: "Validation",
    description:
      "validateValue receives the candidate tag and the already accepted tags. Rejected text stays in the input with the invalid message.",
    variant: "validation",
    code: tagInputValidationCode,
  },
  {
    id: "localization",
    title: "Localization",
    description:
      "labels replaces every string TagInput generates: the fallback input name, remove actions, and validation feedback.",
    variant: "localization",
    code: tagInputLocalizationCode,
  },
  {
    id: "fallback-accessible-name",
    title: "Fallback Accessible Name",
    description:
      "Without a label or aria-label, the input keeps the labels.input name, so the control stays named. Override labels.input to localize it.",
    variant: "fallback-names",
    code: tagInputFallbackNamesCode,
  },
  {
    id: "disabled",
    title: "Disabled",
    description: "Disabled TagInput blocks typing and tag removal.",
    variant: "disabled",
    code: tagInputDisabledCode,
  },
  {
    id: "bare-taginput-custom-layouts",
    title: "Bare TagInput (Custom Layouts)",
    description: "Without label, description, or error, TagInput renders the control only. Provide aria-label or aria-labelledby.",
    variant: "bare",
    code: tagInputBareCode,
  },
  {
    id: "sizes",
    title: "Sizes",
    description:
      "TagInput uses the Input size scale for text, radius, and base height, and reserves extra room for tags at the smaller sizes.",
    variant: "sizes",
    code: tagInputSizesCode,
  },
] as const;

export const tagInputProps = [
  {
    name: "modelValue",
    type: "string[]",
    defaultValue: "undefined",
    description: "Controlled tags. Use with `v-model` or `update:modelValue`.",
  },
  {
    name: "defaultValue",
    type: "string[]",
    defaultValue: "[]",
    description: "Initial tags for uncontrolled usage.",
  },
  {
    name: "label",
    type: "string",
    defaultValue: "undefined",
    description: "Visible label. Enables the built-in field wrapper.",
  },
  {
    name: "labelTooltip",
    type: "string",
    defaultValue: "undefined",
    description: "Tooltip text shown from the label.",
  },
  {
    name: "description",
    type: "string",
    defaultValue: "undefined",
    description: "Helper text shown under the control when there is no error.",
  },
  {
    name: "error",
    type: "string | { message: string; match?: InputErrorMatch }",
    defaultValue: "undefined",
    description: "Error message that marks the control invalid.",
  },
  {
    name: "invalid",
    type: "boolean",
    defaultValue: "false",
    description: "Marks the control invalid. The field keeps the error slot in place of the description.",
  },
  {
    name: "required",
    type: "boolean",
    defaultValue: "undefined",
    description: "Sets the required state. `false` renders the optional hint.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Blocks typing and tag removal.",
  },
  {
    name: "size",
    type: '"xs" | "sm" | "base" | "lg"',
    defaultValue: '"base"',
    description: "Control height and text size.",
  },
  {
    name: "variant",
    type: '"default" | "error"',
    defaultValue: '"default"',
    description: "Visual variant. Errors and invalid state resolve to `error`.",
  },
  {
    name: "placeholder",
    type: "string",
    defaultValue: "undefined",
    description: "Placeholder for the tag input.",
  },
  {
    name: "name",
    type: "string",
    defaultValue: "undefined",
    description: "Form field name. Each accepted tag is submitted with this name.",
  },
  {
    name: "id",
    type: "string",
    defaultValue: "generated",
    description: "Id for the native input that the label points at.",
  },
  {
    name: "autoComplete",
    type: "string",
    defaultValue: '"off"',
    description: "Autocomplete hint for the native input.",
  },
  {
    name: "maxValues",
    type: "number",
    defaultValue: "undefined",
    description: "Maximum number of tags. Further values are rejected.",
  },
  {
    name: "validateValue",
    type: "(value: string, acceptedValues: string[]) => boolean",
    defaultValue: "undefined",
    description: "Rejects a candidate tag before it is added.",
  },
  {
    name: "labels",
    type: "TagInputLabels",
    defaultValue: "undefined",
    description: "Overrides the generated input, remove, invalid, and limit strings.",
  },
] as const;

export const tagInputSlots = [
  { name: "label", description: "Replaces the label content." },
  { name: "description", description: "Replaces the description content." },
  { name: "error", description: "Replaces the error content." },
] as const;

export const tagInputEvents = [
  {
    name: "update:modelValue",
    type: "(value: string[]) => void",
    description: "Emitted whenever tags are added or removed.",
  },
  {
    name: "valueChange",
    type: "(value: string[]) => void",
    description: "Same payload as `update:modelValue`, for non-`v-model` listeners.",
  },
] as const;

export const tagInputLabelKeys = [
  { name: "input", type: "string", description: "Accessible name when there is no visible label or aria-label." },
  { name: "removeValue", type: "(value: string) => string", description: "Accessible name of a tag remove button." },
  { name: "invalidValue", type: "(value: string) => string", description: "Feedback when validateValue rejects a value." },
  { name: "maxValuesReached", type: "(maxValues: number) => string", description: "Feedback when maxValues is reached." },
] as const;
