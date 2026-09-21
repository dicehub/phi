export const tableApiSections = [
  {
    id: "table",
    title: "Table",
    description: "Root table component. Renders a semantic `table` element.",
    rows: [
      { name: "layout", type: '"auto" | "fixed"', defaultValue: '"auto"', description: "Table layout algorithm." },
      { name: "default slot", type: "unknown", defaultValue: "-", description: "`Table.Header`, `Table.Body`, `Table.Footer`, `colgroup`, and other table children." },
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the table." },
      { name: "$attrs", type: "TableHTMLAttributes", defaultValue: "-", description: "Native table attributes." },
    ],
  },
  {
    id: "table-header",
    title: "Table.Header",
    description: "Table header section. Renders `thead`.",
    rows: [
      { name: "variant", type: '"default" | "compact"', defaultValue: '"default"', description: "Header density and background style." },
      { name: "sticky", type: "boolean", defaultValue: "false", description: "Pins header cells to the top of the scroll container." },
      { name: "default slot", type: "unknown", defaultValue: "-", description: "`Table.Row` children." },
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the `thead`." },
    ],
  },
  {
    id: "table-body",
    title: "Table.Body",
    description: "Table body section. Renders `tbody`.",
    rows: [
      { name: "default slot", type: "unknown", defaultValue: "-", description: "`Table.Row` children." },
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the `tbody`." },
    ],
  },
  {
    id: "table-row",
    title: "Table.Row",
    description: "Borderless table row. Default rows alternate between semantic base and elevated backgrounds.",
    rows: [
      { name: "variant", type: '"default" | "selected"', defaultValue: '"default"', description: "Row visual variant. Selected rows always use the semantic tint background." },
      { name: "default slot", type: "unknown", defaultValue: "-", description: "`Table.Head`, `Table.Cell`, `Table.CheckHead`, or `Table.CheckCell` children." },
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the `tr`." },
    ],
  },
  {
    id: "table-head",
    title: "Table.Head",
    description: "Header cell. Renders `th`.",
    rows: [
      { name: "sticky", type: '"left" | "right"', defaultValue: "-", description: "Pins the header cell to an edge of the horizontal scroll container." },
      { name: "default slot", type: "unknown", defaultValue: "-", description: "Header cell content." },
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the `th`." },
    ],
  },
  {
    id: "table-cell",
    title: "Table.Cell",
    description: "Body cell. Renders `td`.",
    rows: [
      { name: "sticky", type: '"left" | "right"', defaultValue: "-", description: "Pins the cell to an edge of the horizontal scroll container." },
      { name: "default slot", type: "unknown", defaultValue: "-", description: "Cell content." },
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the `td`." },
    ],
  },
  {
    id: "table-check-head",
    title: "Table.CheckHead",
    description: "Header cell with checkbox for select-all behavior.",
    rows: [
      { name: "checked", type: "boolean", defaultValue: "-", description: "Controlled checkbox state." },
      { name: "indeterminate", type: "boolean", defaultValue: "-", description: "Renders the mixed checkbox state." },
      { name: "label", type: "string", defaultValue: '"Select all rows"', description: "Accessible label for the checkbox. Native `aria-label` is also supported." },
      { name: "disabled", type: "boolean", defaultValue: "-", description: "Disables the checkbox." },
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the `th`." },
      { name: "@update:checked", type: "(checked: boolean) => void", defaultValue: "-", description: "`v-model:checked` update event." },
      { name: "@checked-change", type: "(details: TableCheckboxChangeDetails) => void", defaultValue: "-", description: "Emitted when the checkbox state changes." },
      { name: "@value-change", type: "(checked: boolean) => void", defaultValue: "-", description: "Deprecated alias for checked changes." },
    ],
  },
  {
    id: "table-check-cell",
    title: "Table.CheckCell",
    description: "Body cell with checkbox for row selection.",
    rows: [
      { name: "checked", type: "boolean", defaultValue: "-", description: "Controlled checkbox state." },
      { name: "indeterminate", type: "boolean", defaultValue: "-", description: "Renders the mixed checkbox state." },
      { name: "label", type: "string", defaultValue: '"Select row"', description: "Accessible label for the checkbox. Native `aria-label` is also supported." },
      { name: "disabled", type: "boolean", defaultValue: "-", description: "Disables the checkbox." },
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the `td`." },
      { name: "@update:checked", type: "(checked: boolean) => void", defaultValue: "-", description: "`v-model:checked` update event." },
      { name: "@checked-change", type: "(details: TableCheckboxChangeDetails) => void", defaultValue: "-", description: "Emitted when the checkbox state changes." },
      { name: "@value-change", type: "(checked: boolean) => void", defaultValue: "-", description: "Deprecated alias for checked changes." },
    ],
  },
  {
    id: "table-resize-handle",
    title: "Table.ResizeHandle",
    description: "Button handle for column resizing integrations.",
    rows: [
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the button." },
      { name: "$attrs", type: "ButtonHTMLAttributes", defaultValue: "-", description: "Native button attributes and mouse/touch listeners." },
    ],
  },
] as const;

export const tableAccessibilityRows = [
  {
    title: "Semantic HTML",
    description: "Table uses semantic `table`, `thead`, `tbody`, `th`, and `td` elements for screen reader navigation.",
  },
  {
    title: "Checkbox Labels",
    description: "Always provide `aria-label` or `label` for `Table.CheckHead` and `Table.CheckCell`.",
  },
  {
    title: "Keyboard Navigation",
    description: "`Tab` moves focus through interactive elements. Checkboxes respond to `Space`.",
  },
] as const;
