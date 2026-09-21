export const inputBarrelCode = `import { Input } from "@dicehub/phi";`;

export const inputGranularCode = `import { Input } from "@dicehub/phi/components/input";`;

export const inputPreviewCode = `<script setup>
import { Input } from "@dicehub/phi/components/input";
</script>

<template>
  <Input
    label="Email"
    placeholder="you@example.com"
    description="We'll never share your email"
  />
</template>`;

export const inputUsageFieldCode = `<script setup>
import { Input } from "@dicehub/phi/components/input";
</script>

<template>
  <Input
    label="Email"
    placeholder="you@example.com"
    description="We'll never share your email"
  />
</template>`;

export const inputBareCode = `<script setup>
import { Input } from "@dicehub/phi/components/input";
</script>

<template>
  <Input placeholder="Search..." aria-label="Search products" />
</template>`;

const labelDescriptionCode = `<script setup>
import { Input } from "@dicehub/phi/components/input";
</script>

<template>
  <Input
    label="Username"
    placeholder="Choose a username"
    description="3-20 characters, alphanumeric only"
  />
</template>`;

const errorStringCode = `<script setup>
import { Input } from "@dicehub/phi/components/input";
</script>

<template>
  <Input
    label="Email"
    placeholder="you@example.com"
    default-value="invalid-email"
    error="Please enter a valid email address"
  />
</template>`;

const errorObjectCode = `<script setup>
import { Input } from "@dicehub/phi/components/input";
</script>

<template>
  <Input
    label="Password"
    type="password"
    default-value="short"
    :error="{ message: 'Password must be at least 8 characters', match: 'tooShort' }"
    :minlength="8"
  />
</template>`;

const sizesCode = `<script setup>
import { Input } from "@dicehub/phi/components/input";
</script>

<template>
  <div class="stack">
    <Input size="xs" label="Extra Small" placeholder="Extra small input" />
    <Input size="sm" label="Small" placeholder="Small input" />
    <Input label="Base" placeholder="Base input (default)" />
    <Input size="lg" label="Large" placeholder="Large input" />
  </div>
</template>`;

const disabledCode = `<script setup>
import { Input } from "@dicehub/phi/components/input";
</script>

<template>
  <Input label="Disabled field" placeholder="Cannot edit" disabled />
</template>`;

const optionalCode = `<script setup>
import { Input } from "@dicehub/phi/components/input";
</script>

<template>
  <Input
    label="Phone Number"
    :required="false"
    placeholder="+1 (555) 000-0000"
  />
</template>`;

const tooltipCode = `<script setup>
import { Input } from "@dicehub/phi/components/input";
</script>

<template>
  <Input
    label="API Key"
    label-tooltip="Find this in your dashboard under Settings > API Keys"
    placeholder="sk_live_..."
  />
</template>`;

const richLabelCode = `<script setup>
import { Input } from "@dicehub/phi/components/input";
</script>

<template>
  <Input required placeholder="billing@example.com" type="email">
    <template #label>
      <span>Email for <strong>billing</strong></span>
    </template>
  </Input>
</template>`;

const controlledModelCode = `<script setup>
import { ref } from "vue";
import { Input } from "@dicehub/phi/components/input";

const value = ref("");
</script>

<template>
  <Input
    v-model="value"
    label="With v-model"
    placeholder="Type something..."
    :description="value ? \`Value: \${value}\` : 'Uses v-model'"
  />
</template>`;

const controlledValueChangeCode = `<script setup>
import { ref } from "vue";
import { Input } from "@dicehub/phi/components/input";

const value = ref("");
</script>

<template>
  <Input
    :model-value="value"
    label="With valueChange"
    placeholder="Type something..."
    :description="value ? \`Value: \${value}\` : 'Receives the value directly'"
    @value-change="value = $event"
  />
</template>`;

const errorWithoutLabelCode = `<script setup>
import { Input } from "@dicehub/phi/components/input";
</script>

<template>
  <div class="stack">
    <Input
      aria-label="Hostname"
      placeholder="example.com"
      default-value="not a host"
      error="Please enter a valid hostname"
    />
    <Input
      aria-label="Path"
      placeholder="/api/v1/users"
      default-value="missing-slash"
      :error="{ message: 'Path must start with /', match: true }"
    />
  </div>
</template>`;

const typesCode = `<script setup>
import { Input } from "@dicehub/phi/components/input";
</script>

<template>
  <div class="stack">
    <Input type="email" label="Email" placeholder="you@example.com" />
    <Input type="password" label="Password" placeholder="••••••••" />
    <Input type="number" label="Age" placeholder="18" />
    <Input type="tel" label="Phone" placeholder="+1 (555) 000-0000" />
  </div>
</template>`;

const passwordManagerCode = `<script setup>
import { Input } from "@dicehub/phi/components/input";
</script>

<template>
  <div class="stack">
    <Input label="API Key (default)" type="password" placeholder="sk_live_..." />
    <Input
      label="API Key (passwordManagerIgnore)"
      type="password"
      placeholder="sk_live_..."
      password-manager-ignore
    />
  </div>
</template>`;

export const inputExamples = [
  {
    id: "with-label-and-description",
    title: "With Label and Description",
    variant: "label-description",
    description: "Use the built-in field wrapper for accessible labels and helper text.",
    code: labelDescriptionCode,
  },
  {
    id: "with-error-string",
    title: "With Error (String)",
    variant: "error-string",
    description: "Passing an error string displays the message and applies the error ring.",
    code: errorStringCode,
  },
  {
    id: "with-error-validation-object",
    title: "With Error (Validation Object)",
    variant: "error-object",
    description: "Structured errors provide message and validity-match fields for validation use cases.",
    code: errorObjectCode,
  },
  {
    id: "input-sizes",
    title: "Input Sizes",
    variant: "sizes",
    description: "Inputs support xs, sm, base, and lg sizes.",
    code: sizesCode,
  },
  {
    id: "disabled",
    title: "Disabled",
    variant: "disabled",
    description: "Disabled inputs keep the same layout and mute the editable text state.",
    code: disabledCode,
  },
  {
    id: "optional-field",
    title: "Optional Field",
    variant: "optional",
    description: 'Set required to false to show the "(optional)" label marker.',
    code: optionalCode,
  },
  {
    id: "with-label-tooltip",
    title: "With Label Tooltip",
    variant: "tooltip",
    description: "Use labelTooltip for compact field guidance next to the label.",
    code: tooltipCode,
  },
  {
    id: "rich-label",
    title: "Rich Label",
    variant: "rich-label",
    description: "Use the label slot when the label needs inline markup.",
    code: richLabelCode,
  },
  {
    id: "controlled-with-v-model",
    title: "Controlled with v-model",
    variant: "controlled-model",
    description: "Bind the value with Vue's v-model syntax.",
    code: controlledModelCode,
  },
  {
    id: "controlled-with-value-change",
    title: "Controlled with valueChange",
    variant: "controlled-value-change",
    description: "Use valueChange when a string-only change event is more convenient.",
    code: controlledValueChangeCode,
  },
  {
    id: "bare-input-no-label",
    title: "Bare Input (No Label)",
    variant: "bare",
    description: "For custom layouts, provide an accessible name with aria-label or aria-labelledby.",
    code: inputBareCode,
  },
  {
    id: "error-without-label",
    title: "Error Without Label",
    variant: "error-without-label",
    description: "Bare inputs can still show errors when they have an accessible name.",
    code: errorWithoutLabelCode,
  },
  {
    id: "input-types",
    title: "Input Types",
    variant: "types",
    description: "Forward native input types such as email, password, number, and tel.",
    code: typesCode,
  },
  {
    id: "password-manager-overlays",
    title: "Password Manager Overlays",
    variant: "password-manager",
    description: "Set passwordManagerIgnore to add common password manager suppression attributes.",
    code: passwordManagerCode,
  },
] as const;

export const inputProps = [
  { name: "modelValue", type: "string | number", defaultValue: "-", description: "Controlled value used by v-model." },
  { name: "defaultValue", type: "string | number", defaultValue: "-", description: "Initial value for uncontrolled inputs." },
  { name: "label", type: "string", defaultValue: "-", description: "Visible field label. Enables the field wrapper." },
  { name: "description", type: "string", defaultValue: "-", description: "Helper text shown below the input when there is no error." },
  { name: "error", type: "string | { message: string; match?: InputErrorMatch }", defaultValue: "-", description: "Validation error message. Also applies error styling." },
  { name: "invalid", type: "boolean", defaultValue: "false", description: "Marks the input invalid without requiring an error message." },
  { name: "size", type: '"xs" | "sm" | "base" | "lg"', defaultValue: '"base"', description: "Controls height, padding, radius, and text size." },
  { name: "variant", type: '"default" | "error"', defaultValue: '"default"', description: "Visual variant. Prefer the error prop for validation." },
  { name: "type", type: "string", defaultValue: '"text"', description: "Native input type." },
  { name: "placeholder", type: "string", defaultValue: "-", description: "Native placeholder text." },
  { name: "required", type: "boolean", defaultValue: "-", description: 'Native required state. Set false to show "(optional)".' },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables the input." },
  { name: "readOnly", type: "boolean", defaultValue: "false", description: "Applies the native readonly attribute." },
  { name: "passwordManagerIgnore", type: "boolean", defaultValue: "false", description: "Adds data attributes and keeper-ignore for password manager suppression." },
  { name: "$attrs", type: "InputHTMLAttributes", defaultValue: "-", description: "Native input attributes such as aria-label, autocomplete, minLength, and pattern." },
] as const;

export const inputSlots = [
  { name: "label", description: "Overrides the label prop with custom label markup." },
  { name: "description", description: "Overrides the description prop with custom helper markup." },
  { name: "error", description: "Overrides the error message with custom error markup." },
] as const;

export const inputEvents = [
  { name: "update:modelValue", type: "(value: string) => void", description: "Emitted on native input for v-model." },
  { name: "valueChange", type: "(value: string) => void", description: "String-only convenience change event." },
] as const;

export const inputErrorTypes = [
  "boolean",
  "badInput",
  "customError",
  "patternMismatch",
  "rangeOverflow",
  "rangeUnderflow",
  "stepMismatch",
  "tooLong",
  "tooShort",
  "typeMismatch",
  "valid",
  "valueMissing",
] as const;
