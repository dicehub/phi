export const selectApiSections = [
  {
    id: "select",
    title: "Select",
    description: "Root select component with trigger, optional field label, and dropdown content. The trigger uses the control surface, including while open; the popup uses the base surface.",
    rows: [
      { name: "default slot", type: "unknown", defaultValue: "-", description: "Child `Select.Option`, `Select.Group`, `Select.GroupLabel`, and `Select.Separator` components. If omitted, options are generated from `items`." },
      { name: "trigger slot", type: "{ label; value; items; empty; open }", defaultValue: "-", description: "Replaces the trigger through Ark UI `as-child` forwarding. Render exactly one interactive child, such as `Toolbar.Button`." },
      { name: "value slot", type: "{ value: unknown; items: SelectCollectionItem[]; empty: boolean }", defaultValue: "-", description: "Custom Vue slot for rendering the selected value inside the trigger." },
      { name: "class", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the trigger." },
      { name: "size", type: '"xs" | "sm" | "base" | "lg"', defaultValue: '"base"', description: "Trigger size. Matches the Input component sizes." },
      { name: "label", type: "string", defaultValue: "-", description: "Visible label rendered above the trigger." },
      { name: "hideLabel", type: "boolean", defaultValue: "false", description: "Deprecated hidden-label mode. Prefer `aria-label` for selects without a visible label." },
      { name: "placeholder", type: "string", defaultValue: "-", description: "Text shown when no value is selected." },
      { name: "loading", type: "boolean", defaultValue: "false", description: "Shows a skeleton value and disables the trigger." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables the select trigger and all selection interaction." },
      { name: "required", type: "boolean", defaultValue: "-", description: "Native required state. When explicitly `false`, the label shows optional text." },
      { name: "labelTooltip", type: "string", defaultValue: "-", description: "Tooltip content displayed next to the visible label." },
      { name: "description", type: "string", defaultValue: "-", description: "Helper text displayed below the trigger." },
      { name: "error", type: "string | SelectFieldError", defaultValue: "-", description: "Validation message. When present, it replaces `description` and marks the trigger invalid." },
      { name: "items", type: "Record<string, SelectItemValue> | SelectInputItem[]", defaultValue: "-", description: "Options rendered automatically when no default slot is provided. Object values may be descriptor objects with `label` and `disabled`." },
      { name: "modelValue / v-model", type: "unknown | unknown[] | null", defaultValue: "-", description: "Controlled selected value. Multiple mode uses an array." },
      { name: "value", type: "unknown | unknown[] | null", defaultValue: "-", description: "Controlled selected value alias for `modelValue`." },
      { name: "defaultValue", type: "unknown | unknown[] | null", defaultValue: "-", description: "Initial selected value for uncontrolled usage." },
      { name: "multiple", type: "boolean", defaultValue: "false", description: "Enables multiple selection and emits arrays from `v-model` and `@value-change`." },
      { name: "renderValue", type: "(value: unknown) => string", defaultValue: "-", description: "String formatter for the trigger value. Use the `value` slot for rich Vue markup." },
      { name: "isItemEqualToValue", type: "(itemValue: unknown, value: unknown) => boolean", defaultValue: "Object.is", description: "Custom comparison for object values." },
      { name: "open", type: "boolean", defaultValue: "-", description: "Controlled open state." },
      { name: "defaultOpen", type: "boolean", defaultValue: "-", description: "Initial open state for uncontrolled usage." },
      { name: "positioning", type: "object", defaultValue: "bottom-start, 4px gutter", description: "Ark positioning options for the popup. By default, the popup opens below the trigger and stays collision-aware." },
      { name: "name", type: "string", defaultValue: "-", description: "Native hidden select name for form submission." },
      { name: "@update:model-value", type: "(value: unknown) => void", defaultValue: "-", description: "`v-model` update event with the original option value." },
      { name: "@value-change", type: "(value: unknown, details: SelectValueChangeDetails) => void", defaultValue: "-", description: "Emitted when selection changes. Details include selected items and internal value keys." },
      { name: "@open-change", type: "(details: SelectOpenChangeDetails) => void", defaultValue: "-", description: "Emitted when the popup opens or closes." },
      { name: "@highlight-change", type: "(details: SelectHighlightChangeDetails) => void", defaultValue: "-", description: "Emitted when the highlighted option changes." },
    ],
  },
  {
    id: "select-option",
    title: "Select.Option",
    description: "Individual option rendered inside a Select list.",
    rows: [
      { name: "default slot", type: "unknown", defaultValue: "-", description: "Visible option content." },
      { name: "value", type: "unknown", defaultValue: "-", description: "Option value emitted by the parent Select." },
      { name: "label", type: "unknown", defaultValue: "-", description: "Text label used for selection display when slot content is custom." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "Prevents this option from being selected." },
      { name: "class", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the option item." },
    ],
  },
  {
    id: "select-group",
    title: "Select.Group",
    description: "Groups related options under a shared label.",
    rows: [
      { name: "default slot", type: "unknown", defaultValue: "-", description: "Grouped options and an optional `Select.GroupLabel`." },
      { name: "class", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the group wrapper." },
    ],
  },
  {
    id: "select-group-label",
    title: "Select.GroupLabel",
    description: "Visible label for a Select.Group.",
    rows: [
      { name: "default slot", type: "unknown", defaultValue: "-", description: "Group heading content." },
      { name: "class", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the group label." },
    ],
  },
  {
    id: "select-separator",
    title: "Select.Separator",
    description: "Visual divider between option groups.",
    rows: [
      { name: "class", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the separator." },
    ],
  },
] as const;

export const selectAccessibilityRows = [
  {
    title: "Accessible Name",
    description: "Use a visible label when possible. For compact controls without a visible label, provide aria-label or aria-labelledby.",
  },
  {
    title: "Keyboard Navigation",
    description: "Enter, Space, or ArrowDown opens the list. Arrow keys move highlight. Enter selects. Escape closes.",
  },
  {
    title: "Screen Readers",
    description: "The component is built on Ark UI Select primitives and preserves combobox/listbox semantics, disabled states, and hidden native form control output.",
  },
] as const;
