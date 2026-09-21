export const inputAreaBarrelCode = `import { InputArea } from "@dicehub/phi";`;

export const inputAreaGranularCode = `import { InputArea } from "@dicehub/phi/components/input";`;

export const inputAreaAliasCode = `import { Textarea } from "@dicehub/phi/components/input";`;

export const inputAreaPreviewCode = `<script setup>
import { InputArea } from "@dicehub/phi/components/input";
</script>

<template>
  <InputArea
    label="Description"
    placeholder="Enter a description..."
    description="Provide details about your project"
  />
</template>`;

export const inputAreaUsageFieldCode = inputAreaPreviewCode;

export const inputAreaBareCode = `<script setup>
import { InputArea } from "@dicehub/phi/components/input";
</script>

<template>
  <InputArea placeholder="Add notes..." aria-label="Notes" rows="3" />
</template>`;

const withLabelCode = `<script setup>
import { InputArea } from "@dicehub/phi/components/input";
</script>

<template>
  <InputArea
    label="Bio"
    placeholder="Tell us about yourself"
    description="Max 500 characters"
  />
</template>`;

const rowsCode = `<script setup>
import { InputArea } from "@dicehub/phi/components/input";
</script>

<template>
  <div class="stack">
    <InputArea label="2 rows" placeholder="Small area" rows="2" />
    <InputArea label="4 rows (default)" placeholder="Medium area" rows="4" />
    <InputArea label="8 rows" placeholder="Large area" rows="8" />
  </div>
</template>`;

const autoResizeCode = `<script setup>
import { InputArea } from "@dicehub/phi/components/input";

const initialValue = "Review the configuration changes.\\n\\nAdd follow-up notes here.\\n\\n";
</script>

<template>
  <InputArea
    auto-resize
    label="Configuration value"
    :min-rows="2"
    :max-rows="8"
    :default-value="initialValue"
    description="Grows with content up to 8 rows, then scrolls."
  />
</template>`;

const controlledAutoResizeCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/phi/components/button";
import { InputArea } from "@dicehub/phi/components/input";

const autoResize = ref(true);
const notes = ref("Review the current configuration.");

const setLongValue = () => {
  notes.value = [
    "Review the current configuration.",
    "Confirm the deployment region.",
    "Check the rollback policy.",
  ].join("\\n");
};
</script>

<template>
  <InputArea
    v-model="notes"
    :auto-resize="autoResize"
    label="Controlled notes"
    :min-rows="2"
    :max-rows="6"
  />
  <Button @click="setLongValue">Set long value</Button>
  <Button variant="secondary" @click="autoResize = !autoResize">
    Toggle auto resize
  </Button>
</template>`;

const errorStringCode = `<script setup>
import { InputArea } from "@dicehub/phi/components/input";
</script>

<template>
  <InputArea
    label="Message"
    placeholder="Enter your message"
    default-value="Hi"
    error="Message must be at least 10 characters"
  />
</template>`;

const errorObjectCode = `<script setup>
import { InputArea } from "@dicehub/phi/components/input";
</script>

<template>
  <InputArea
    label="Feedback"
    default-value="Bad"
    :error="{ message: 'Feedback must be at least 20 characters', match: 'tooShort' }"
    :minlength="20"
  />
</template>`;

const sizesCode = `<script setup>
import { InputArea } from "@dicehub/phi/components/input";
</script>

<template>
  <div class="stack">
    <InputArea size="xs" label="Extra Small" placeholder="Extra small textarea" />
    <InputArea size="sm" label="Small" placeholder="Small textarea" />
    <InputArea label="Base" placeholder="Base textarea (default)" />
    <InputArea size="lg" label="Large" placeholder="Large textarea" />
  </div>
</template>`;

const disabledCode = `<script setup>
import { InputArea } from "@dicehub/phi/components/input";
</script>

<template>
  <InputArea label="Disabled field" placeholder="Cannot edit" disabled />
</template>`;

const optionalCode = `<script setup>
import { InputArea } from "@dicehub/phi/components/input";
</script>

<template>
  <InputArea
    label="Additional Notes"
    :required="false"
    placeholder="Any additional information..."
  />
</template>`;

const tooltipCode = `<script setup>
import { InputArea } from "@dicehub/phi/components/input";
</script>

<template>
  <InputArea
    label="Worker Script"
    label-tooltip="Enter your worker script code here"
    placeholder="export default { async fetch(request) { ... } }"
    rows="4"
  />
</template>`;

const richLabelCode = `<script setup>
import { InputArea } from "@dicehub/phi/components/input";
</script>

<template>
  <InputArea required placeholder="Add notes for the reviewer..." rows="3">
    <template #label>
      <span>Notes for <strong>review</strong></span>
    </template>
  </InputArea>
</template>`;

export const inputAreaExamples = [
  {
    id: "with-label",
    title: "With Label",
    variant: "with-label",
    description: "Use the built-in field wrapper for a label and helper text.",
    code: withLabelCode,
  },
  {
    id: "custom-row-count",
    title: "Custom Row Count",
    variant: "rows",
    description: "Use the rows prop to control the initial height.",
    code: rowsCode,
  },
  {
    id: "auto-resize",
    title: "Auto Resize",
    variant: "auto-resize",
    description: "Use autoResize to grow with typed or pasted content. minRows sets the floor and maxRows enables scrolling after the cap.",
    code: autoResizeCode,
  },
  {
    id: "controlled-auto-resize",
    title: "Controlled Auto Resize",
    variant: "auto-resize-controlled",
    description: "Controlled values remeasure after v-model or external state updates. Disabling autoResize restores native manual resizing.",
    code: controlledAutoResizeCode,
  },
  {
    id: "error-state-string",
    title: "Error State (String)",
    variant: "error-string",
    description: "Error styling is automatically applied when the error prop is truthy.",
    code: errorStringCode,
  },
  {
    id: "error-state-object",
    title: "Error State (Object)",
    variant: "error-object",
    description: "Use an error object with match for constraint validation.",
    code: errorObjectCode,
  },
  {
    id: "sizes",
    title: "Sizes",
    variant: "sizes",
    description: "Four sizes available: xs, sm, base (default), lg.",
    code: sizesCode,
  },
  {
    id: "disabled",
    title: "Disabled",
    variant: "disabled",
    description: "Disabled textareas keep the same layout and mute the editable state.",
    code: disabledCode,
  },
  {
    id: "bare-inputarea",
    title: "Bare InputArea",
    variant: "bare",
    description: "InputArea without label renders as a bare textarea. Must provide aria-label for accessibility.",
    code: inputAreaBareCode,
  },
  {
    id: "optional-field",
    title: "Optional Field",
    variant: "optional",
    description: 'Set required to false to show "(optional)" text after the label.',
    code: optionalCode,
  },
  {
    id: "label-with-tooltip",
    title: "Label with Tooltip",
    variant: "tooltip",
    description: "Use labelTooltip to add an info icon with additional context on hover.",
    code: tooltipCode,
  },
  {
    id: "rich-label",
    title: "Rich Label",
    variant: "rich-label",
    description: "Use the label slot when the label needs inline markup.",
    code: richLabelCode,
  },
] as const;

export const inputAreaProps = [
  { name: "modelValue", type: "string", defaultValue: "-", description: "Controlled value used by v-model." },
  { name: "defaultValue", type: "string", defaultValue: "-", description: "Initial value for uncontrolled textareas." },
  { name: "autoResize", type: "boolean", defaultValue: "false", description: "Grows and shrinks the textarea with its content and available width." },
  { name: "minRows", type: "number", defaultValue: "1", description: "Minimum visible rows while autoResize is enabled." },
  { name: "maxRows", type: "number", defaultValue: "-", description: "Maximum visible rows before vertical scrolling is enabled." },
  { name: "label", type: "string", defaultValue: "-", description: "Visible field label. Enables the field wrapper." },
  { name: "description", type: "string", defaultValue: "-", description: "Helper text shown below the textarea when there is no error." },
  { name: "error", type: "string | { message: string; match?: InputErrorMatch }", defaultValue: "-", description: "Validation error message. Also applies error styling." },
  { name: "invalid", type: "boolean", defaultValue: "false", description: "Marks the textarea invalid without requiring an error message." },
  { name: "size", type: '"xs" | "sm" | "base" | "lg"', defaultValue: '"base"', description: "Controls padding, radius, and text size." },
  { name: "variant", type: '"default" | "error"', defaultValue: '"default"', description: "Visual variant. Prefer the error prop for validation." },
  { name: "placeholder", type: "string", defaultValue: "-", description: "Native placeholder text." },
  { name: "required", type: "boolean", defaultValue: "-", description: 'Native required state. Set false to show "(optional)".' },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables the textarea." },
  { name: "readOnly", type: "boolean", defaultValue: "false", description: "Applies the native readonly attribute." },
  { name: "$attrs", type: "TextareaHTMLAttributes", defaultValue: "-", description: "Native textarea attributes such as aria-label, rows, minLength, and maxLength." },
] as const;

export const inputAreaSlots = [
  { name: "label", description: "Overrides the label prop with custom label markup." },
  { name: "description", description: "Overrides the description prop with custom helper markup." },
  { name: "error", description: "Overrides the error message with custom error markup." },
] as const;

export const inputAreaEvents = [
  { name: "update:modelValue", type: "(value: string) => void", description: "Emitted on native input for v-model." },
  { name: "valueChange", type: "(value: string) => void", description: "String-only convenience change event." },
] as const;

export const inputAreaErrorTypes = [
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
