export const fieldBarrelCode = `import { Field } from "@dicehub/phi";`;

export const fieldGranularCode = `import { Field } from "@dicehub/phi/components/field";`;

export const fieldPreviewCode = `<script setup>
import { Field } from "@dicehub/phi/components/field";
import { Input } from "@dicehub/phi/components/input";
</script>

<template>
  <Field
    id="email"
    label="Email"
    description="We'll never share your email"
  >
    <Input id="email" placeholder="you@example.com" type="email" />
  </Field>
</template>`;

const errorCode = `<script setup>
import { Field } from "@dicehub/phi/components/field";
import { Input } from "@dicehub/phi/components/input";
</script>

<template>
  <Field
    id="password"
    label="Password"
    :error="{ message: 'Password must be at least 8 characters', match: 'tooShort' }"
    required
  >
    <Input id="password" default-value="short" type="password" :minlength="8" />
  </Field>
</template>`;

const optionalCode = `<script setup>
import { Field } from "@dicehub/phi/components/field";
import { Input } from "@dicehub/phi/components/input";
</script>

<template>
  <Field
    id="phone"
    label="Phone number"
    label-tooltip="Used only for account recovery"
    :required="false"
  >
    <Input id="phone" placeholder="+1 (555) 000-0000" type="tel" />
  </Field>
</template>`;

const hideLabelCode = `<script setup>
import { Field } from "@dicehub/phi/components/field";
import { Input } from "@dicehub/phi/components/input";
</script>

<template>
  <Field
    id="api-key"
    label="API key"
    hide-label
    description="The visible label can be owned by a parent layout."
  >
    <Input id="api-key" aria-label="API key" placeholder="sk_live_..." />
  </Field>
</template>`;

export const fieldExamples = [
  {
    id: "error-state",
    title: "Error State",
    description: "Use string or structured errors to mark the field invalid and render error text.",
    variant: "error",
    code: errorCode,
  },
  {
    id: "optional-field",
    title: "Optional Field",
    description: "Set required to false to show the optional marker and attach a label tooltip.",
    variant: "optional",
    code: optionalCode,
  },
  {
    id: "hidden-label",
    title: "Hidden Label",
    description: "Use hideLabel when another component owns the visible label but Field still owns helper or error text.",
    variant: "hide-label",
    code: hideLabelCode,
  },
] as const;

export const fieldProps = [
  { name: "id", type: "string", defaultValue: "-", description: "Field id. Use the same id on the wrapped control." },
  { name: "label", type: "string", defaultValue: "-", description: "Label text. Use the label slot for richer content." },
  { name: "description", type: "string", defaultValue: "-", description: "Helper text shown when there is no error." },
  { name: "error", type: "string | { message: string; match?: FieldErrorMatch }", defaultValue: "-", description: "Validation error text." },
  { name: "required", type: "boolean", defaultValue: "-", description: "Marks the field required. `false` shows the optional marker." },
  { name: "labelTooltip", type: "string", defaultValue: "-", description: "Tooltip text displayed beside the label." },
  { name: "controlFirst", type: "boolean", defaultValue: "false", description: "Places checkbox or switch controls before the label." },
  { name: "hideLabel", type: "boolean", defaultValue: "false", description: "Skips rendering the visible label." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Marks the field disabled." },
  { name: "invalid", type: "boolean", defaultValue: "false", description: "Marks the field invalid even without an error message." },
  { name: "readOnly", type: "boolean", defaultValue: "false", description: "Marks the field read-only." },
  { name: "class / className", type: "string | object | array", defaultValue: "-", description: "Additional classes for the root." },
];

export const fieldSlots = [
  { name: "default", description: "Wrapped form control." },
  { name: "label", description: "Custom label content." },
  { name: "description", description: "Custom helper text." },
  { name: "error", description: "Custom error content." },
];

export const fieldErrorTypes = [
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
];
