export const checkboxProps = [
  { name: "variant", type: '"default" | "error"', defaultValue: '"default"', description: "Sets the visual variant. Use error for validation styling." },
  { name: "label", type: "string", defaultValue: "-", description: "Visible label rendered next to the checkbox." },
  { name: "labelTooltip", type: "string", defaultValue: "-", description: "Tooltip text next to the label. LocaleProvider translates its accessible name." },
  { name: "controlFirst", type: "boolean", defaultValue: "true", description: "Places the checkbox before the label. Set false for label-first layout." },
  { name: "checked", type: 'boolean | "indeterminate"', defaultValue: "-", description: "Controlled checked state. Use v-model:checked in Vue." },
  { name: "defaultChecked", type: 'boolean | "indeterminate"', defaultValue: "-", description: "Initial checked state for uncontrolled usage." },
  { name: "indeterminate", type: "boolean", defaultValue: "-", description: "Compatibility prop that renders the mixed state." },
  { name: "disabled", type: "boolean", defaultValue: "-", description: "Disables pointer and keyboard interaction." },
  { name: "name", type: "string", defaultValue: "-", description: "Native checkbox name for form submission." },
  { name: "required", type: "boolean", defaultValue: "-", description: "Marks the checkbox as required. False displays the optional marker, which LocaleProvider can translate." },
];

export const groupProps = [
  { name: "appearance", type: '"default" | "card"', defaultValue: '"default"', description: "Card groups share one outline with internal dividers. Items can override the appearance; default items retain padding inside the card." },
  { name: "orientation", type: '"vertical" | "horizontal"', defaultValue: '"vertical"', description: "Layout direction. Horizontal card groups use two columns, or one column below 641px." },
  { name: "legend", type: "string", defaultValue: "-", description: "Visible legend above the items. For custom styling, omit this prop and pass Checkbox.Legend as a direct child. This prop takes precedence." },
  { name: "description", type: "string", defaultValue: "-", description: "Helper text displayed below the group." },
  { name: "error", type: "string", defaultValue: "-", description: "Validation message. Replaces description when present." },
  { name: "modelValue", type: "string[]", defaultValue: "-", description: "Controlled selected values. Use v-model in Vue." },
  { name: "defaultValue", type: "string[]", defaultValue: "[]", description: "Initial selected values for uncontrolled usage." },
  { name: "disabled", type: "boolean", defaultValue: "-", description: "Disables every item in the group." },
  { name: "controlFirst", type: "boolean", defaultValue: "-", description: "Sets the label/control order. Defaults to true for default items and false for card items." },
  { name: "name", type: "string", defaultValue: "-", description: "Native checkbox name passed to group items." },
];

export const legendProps = [
  { name: "default slot", type: "unknown", defaultValue: "-", description: "Legend content. Pass class or style for custom presentation." },
];

export const itemProps = [
  { name: "appearance", type: '"default" | "card"', defaultValue: "-", description: "Overrides the group appearance. A card outside a card group keeps its own border." },
  { name: "description", type: "string", defaultValue: "-", description: "Helper text below the label in card appearance." },
  { name: "description slot", type: "unknown", defaultValue: "-", description: "Rich helper content in card appearance." },
  { name: "controlFirst", type: "boolean", defaultValue: "-", description: "Overrides the group control order. Without an explicit order, card items place the control last." },
  { name: "value", type: "string", defaultValue: "-", description: "Item value used by Checkbox.Group." },
  { name: "label", type: "string", defaultValue: "-", description: "Visible label rendered next to the checkbox item." },
  { name: "variant", type: '"default" | "error"', defaultValue: '"default"', description: "Sets the visual variant for the item." },
  { name: "checked", type: 'boolean | "indeterminate"', defaultValue: "-", description: "Controlled checked state when used outside a group." },
  { name: "disabled", type: "boolean", defaultValue: "-", description: "Disables this checkbox item." },
];
