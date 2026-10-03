export const radioApiSections = [
  {
    id: "radio-group",
    title: "Radio.Group",
    description: "Container for radio buttons with legend, description, and error support.",
    rows: [
      { name: "legend", type: "string", defaultValue: "-", description: "Legend text for the group. For custom styling, omit this prop and pass `Radio.Legend` as a direct child. Legends render above the items; this prop takes precedence." },
      { name: "default slot", type: "unknown", defaultValue: "-", description: "Child `Radio.Item` components and optionally a `Radio.Legend`." },
      { name: "orientation", type: '"vertical" | "horizontal"', defaultValue: '"vertical"', description: "Layout direction. Horizontal card groups use two columns, or one column below 641px." },
      { name: "appearance", type: '"default" | "card"', defaultValue: '"default"', description: "Card groups share one outline with internal dividers. Individual items can override this with `appearance`; default items retain padding inside a card group, and a card item in a default group keeps its own border." },
      { name: "description", type: "string", defaultValue: "-", description: "Helper text displayed below the group." },
      { name: "error", type: "string", defaultValue: "-", description: "Validation message displayed below the group." },
      { name: "defaultValue", type: "RadioValue", defaultValue: "-", description: "Initial selected value for uncontrolled usage." },
      { name: "modelValue", type: "RadioValue", defaultValue: "-", description: "Controlled selected value for `v-model`." },
      { name: "value", type: "RadioValue", defaultValue: "-", description: "Controlled selected value alias for `modelValue`." },
      { name: "disabled", type: "boolean", defaultValue: "-", description: "Disables every item in the group." },
      { name: "controlPosition", type: '"start" | "end"', defaultValue: "-", description: "`start` places the radio before the label; `end` places the label before the radio. Defaults to `start` for default appearance and `end` for card appearance." },
      { name: "name", type: "string", defaultValue: "-", description: "Native radio group name for form submission." },
      { name: "class", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the fieldset." },
      { name: "@update:model-value", type: "(value: RadioValue) => void", defaultValue: "-", description: "`v-model` update event." },
      { name: "@value-change", type: "(value: RadioValue, details: RadioValueChangeDetails) => void", defaultValue: "-", description: "Emitted when the selected value changes. The second argument carries the native event." },
    ],
  },
  {
    id: "radio-legend",
    title: "Radio.Legend",
    description: "Composable legend sub-component for Radio.Group.",
    rows: [
      { name: "default slot", type: "unknown", defaultValue: "-", description: "Legend content." },
      { name: "class", type: "string", defaultValue: "-", description: "Additional CSS classes, for example `phi-sr-only` to visually hide the legend." },
    ],
  },
  {
    id: "radio-item",
    title: "Radio.Item",
    description: "Individual radio button within Radio.Group.",
    rows: [
      { name: "variant", type: '"default" | "error"', defaultValue: '"default"', description: "Visual variant for validation states." },
      { name: "appearance", type: '"default" | "card"', defaultValue: "-", description: "Overrides the group-level appearance." },
      { name: "label", type: "string", defaultValue: "-", description: "Visible label rendered next to the radio item." },
      { name: "label slot", type: "unknown", defaultValue: "-", description: "Rich Vue content for the item label." },
      { name: "description", type: "string", defaultValue: "-", description: "Description text displayed below the label in card appearance." },
      { name: "description slot", type: "unknown", defaultValue: "-", description: "Rich description content displayed in card appearance." },
      { name: "value", type: "RadioValue", defaultValue: "-", description: "Item value used by Radio.Group." },
      { name: "class", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the label wrapper." },
      { name: "disabled", type: "boolean", defaultValue: "-", description: "Disables this radio item." },
      { name: "@value-change", type: "(value: RadioValue, details: RadioValueChangeDetails) => void", defaultValue: "-", description: "Emitted when this item is selected." },
    ],
  },
] as const;

export const radioAccessibilityRows = [
  {
    title: "Semantic HTML",
    description: "Radio.Group uses semantic fieldset and legend elements for proper grouping and screen reader announcement.",
  },
  {
    title: "Keyboard Navigation",
    description: "Arrow keys move between options. Space selects the focused option. Tab moves focus to and from the radio group.",
  },
  {
    title: "Screen Readers",
    description: "Each radio is announced with its label and selection state. The group legend provides context for all options.",
  },
] as const;
