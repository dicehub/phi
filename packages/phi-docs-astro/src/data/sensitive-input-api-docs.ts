export const sensitiveInputProps = [
  { name: "modelValue / v-model", type: "string", defaultValue: "-", description: "Controlled sensitive value." },
  { name: "value", type: "string", defaultValue: "-", description: "Controlled value alias for `modelValue`." },
  { name: "defaultValue", type: "string", defaultValue: '""', description: "Initial value for uncontrolled usage." },
  { name: "size", type: '"xs" | "sm" | "base" | "lg"', defaultValue: '"base"', description: "Input size. Matches the Input component sizes." },
  { name: "variant", type: '"default" | "error"', defaultValue: '"default"', description: "Visual variant. Error styling is also applied automatically when `error` is present." },
  { name: "label", type: "string", defaultValue: "-", description: "Visible label rendered above the input and used for the masked button label." },
  { name: "labelTooltip", type: "string", defaultValue: "-", description: "Tooltip content displayed next to the visible label." },
  { name: "description", type: "string", defaultValue: "-", description: "Helper text displayed below the input when no error is present." },
  { name: "error", type: "string | { message: string; match?: SensitiveInputErrorMatch }", defaultValue: "-", description: "Validation message. Marks the control invalid and replaces `description`." },
  { name: "invalid", type: "boolean", defaultValue: "false", description: "Marks the input invalid without requiring an error message." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables reveal, copy, editing, and focus interactions." },
  { name: "readOnly", type: "boolean", defaultValue: "false", description: "Allows reveal without editing the value." },
  { name: "required", type: "boolean", defaultValue: "-", description: "Native required state. When explicitly `false`, the label shows optional text." },
  { name: "placeholder", type: "string", defaultValue: "-", description: "Native placeholder text shown when the value is empty." },
  { name: "autoComplete", type: "string", defaultValue: '"off"', description: "Native autocomplete attribute." },
  { name: "name", type: "string", defaultValue: "-", description: "Native input name." },
  { name: "id", type: "string", defaultValue: "generated", description: "Native input id and base id for associated field text." },
  { name: "$attrs", type: "InputHTMLAttributes", defaultValue: "-", description: "Native input attributes and listeners except `type`, `value`, `defaultValue`, and native `size`." },
] as const;

export const sensitiveInputEvents = [
  { name: "@update:model-value", type: "(value: string) => void", description: "`v-model` update event." },
  { name: "@value-change", type: "(value: string) => void", description: "Emitted with the next value when the input changes." },
  { name: "@copy", type: "() => void", description: "Emitted after the value is copied to the clipboard." },
] as const;

export const sensitiveInputSlots = [
  { name: "label", description: "Overrides the label prop with custom label markup." },
  { name: "description", description: "Overrides the description prop with custom helper markup." },
  { name: "error", description: "Overrides the error message with custom error markup." },
] as const;

export const sensitiveInputAccessibilityRows = [
  {
    title: "Masked Value",
    description: "A populated masked input renders a focusable button-like container with an accessible masked label.",
  },
  {
    title: "Reveal Flow",
    description: "Click, Enter, or Space reveals the value. Escape masks it again and returns focus to the container.",
  },
  {
    title: "Clipboard Feedback",
    description: "A successful copy updates the action label to Copied and announces the result through a polite live region. Feedback lasts two seconds after the latest successful copy.",
  },
] as const;
