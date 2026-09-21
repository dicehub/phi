export const switchApiSections = [
  {
    id: "switch",
    title: "Switch",
    description: "Individual switch toggle with built-in label.",
    rows: [
      { name: "variant", type: '"default" | "neutral"', defaultValue: '"default"', description: "Visual variant for the switch." },
      { name: "label", type: "string", defaultValue: "-", description: "Visible label rendered next to the switch." },
      { name: "default slot", type: "unknown", defaultValue: "-", description: "Rich Vue content for the switch label." },
      { name: "labelTooltip", type: "string", defaultValue: "-", description: "Tooltip content displayed next to the label via the Phi `Label` component." },
      { name: "required", type: "boolean", defaultValue: "-", description: "When explicitly `false`, shows `(optional)` text after the label." },
      { name: "controlFirst", type: "boolean", defaultValue: "true", description: "`true` places the switch before the label; `false` places the label before the switch." },
      { name: "size", type: '"sm" | "base" | "lg"', defaultValue: '"base"', description: "Switch size." },
      { name: "checked", type: "boolean", defaultValue: "-", description: "Controlled checked state." },
      { name: "disabled", type: "boolean", defaultValue: "-", description: "Disables the switch." },
      { name: "transitioning", type: "boolean", defaultValue: "-", description: "Sets `aria-busy` while the switch is transitioning." },
      { name: "ariaLabel", type: "string", defaultValue: "-", description: "Accessible label fallback. You can also pass native `aria-label` through `$attrs`." },
      { name: "id", type: "string", defaultValue: "-", description: "Custom id forwarded to the switch control." },
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the switch control." },
      { name: "$attrs", type: "ButtonHTMLAttributes", defaultValue: "-", description: "Native button attributes and listeners such as `aria-label`, `name`, `value`, `lang`, `title`, and `@click` are forwarded to the control." },
      { name: "@update:checked", type: "(checked: boolean) => void", defaultValue: "-", description: "`v-model:checked` update event." },
      { name: "@checked-change", type: "(details: SwitchCheckedChangeDetails) => void", defaultValue: "-", description: "Emitted when the checked state changes." },
    ],
  },
  {
    id: "switch-group",
    title: "Switch.Group",
    description: "Container for multiple switches with legend, description, and error support.",
    rows: [
      { name: "legend", type: "string", defaultValue: "-", description: "Legend text for the group. For custom styling, omit this prop and use `Switch.Legend`." },
      { name: "default slot", type: "unknown", defaultValue: "-", description: "Child `Switch.Item` components and optionally a `Switch.Legend`." },
      { name: "error", type: "string", defaultValue: "-", description: "Validation message displayed below the group." },
      { name: "description", type: "string", defaultValue: "-", description: "Helper text displayed below the group." },
      { name: "description slot", type: "unknown", defaultValue: "-", description: "Rich Vue helper content." },
      { name: "disabled", type: "boolean", defaultValue: "-", description: "Disables every item in the group." },
      { name: "controlFirst", type: "boolean", defaultValue: "true", description: "`true` places switches before labels; `false` places labels before switches." },
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the fieldset." },
    ],
  },
  {
    id: "switch-legend",
    title: "Switch.Legend",
    description: "Composable legend sub-component for Switch.Group.",
    rows: [
      { name: "default slot", type: "unknown", defaultValue: "-", description: "Legend content." },
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes, for example `phi-sr-only` to visually hide the legend. Use `class-name` in Vue templates." },
    ],
  },
  {
    id: "switch-item",
    title: "Switch.Item",
    description: "Individual switch within Switch.Group.",
    rows: [
      { name: "variant", type: '"default" | "neutral"', defaultValue: '"default"', description: "Visual variant for this item." },
      { name: "label", type: "string", defaultValue: "-", description: "Visible label rendered next to the switch." },
      { name: "label slot", type: "unknown", defaultValue: "-", description: "Rich label content." },
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the label wrapper." },
      { name: "checked", type: "boolean", defaultValue: "-", description: "Controlled checked state." },
      { name: "disabled", type: "boolean", defaultValue: "-", description: "Disables this switch item." },
      { name: "size", type: '"sm" | "base" | "lg"', defaultValue: '"base"', description: "Switch size." },
      { name: "transitioning", type: "boolean", defaultValue: "-", description: "Sets `aria-busy` while the switch is transitioning." },
      { name: "@update:checked", type: "(checked: boolean) => void", defaultValue: "-", description: "`v-model:checked` update event." },
      { name: "@checked-change", type: "(details: SwitchCheckedChangeDetails) => void", defaultValue: "-", description: "Emitted when the checked state changes." },
    ],
  },
] as const;

export const switchAccessibilityRows = [
  {
    title: "Switch Semantics",
    description: "Switch controls render with `role=\"switch\"` and keep `aria-checked` synchronized with state.",
  },
  {
    title: "Keyboard Interaction",
    description: "The switch control is a button, so Enter and Space toggle it through native button behavior.",
  },
  {
    title: "Grouping",
    description: "Switch.Group uses semantic fieldset and legend elements to group related switches.",
  },
] as const;
