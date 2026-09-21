export const inlineCopyTextBarrelCode = `import { InlineCopyText } from "@dicehub/phi";`;

export const inlineCopyTextGranularCode = `import { InlineCopyText } from "@dicehub/phi/components/inline-copy-text";`;

export const inlineCopyTextPreviewCode = `<script setup>
import { InlineCopyText } from "@dicehub/phi/components/inline-copy-text";
</script>

<template>
  <InlineCopyText text="0c239dd2-1f6a-4c0b-9f8e-2c1f77bd9a10" />
</template>`;

export const inlineCopyTextUsageCode = `<script setup>
import { InlineCopyText } from "@dicehub/phi/components/inline-copy-text";
</script>

<template>
  <!-- Copy a different value than the one shown, and localize the labels. -->
  <InlineCopyText
    :labels="{ copyAction: 'Copy database ID', copied: 'Copied' }"
    text="0c23…9a10"
    text-to-copy="0c239dd2-1f6a-4c0b-9f8e-2c1f77bd9a10"
    @copy="handleCopy"
  />
</template>`;

const tableCellCode = `<template>
  <table>
    <tbody>
      <tr v-for="row in rows" :key="row.id">
        <td>{{ row.name }}</td>
        <td class="cell-id">
          <InlineCopyText :text="row.id" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style>
.cell-id {
  /* The cell must be allowed to shrink, otherwise the value pushes the table wider. */
  min-width: 0;
  max-width: 12rem;
}
</style>`;

const variantsCode = `<template>
  <InlineCopyText as="strong" bold size="lg" text="body" variant="body" />
  <InlineCopyText text="secondary" variant="secondary" />
  <InlineCopyText text="success" variant="success" />
  <InlineCopyText text="error" variant="error" />
  <InlineCopyText text="mono" variant="mono" />
  <InlineCopyText text="mono-secondary" variant="mono-secondary" />
</template>`;

const customLabelsCode = `<template>
  <InlineCopyText
    :labels="{ copyAction: 'Datenbank-ID kopieren', copied: 'Kopiert' }"
    text="0c239dd2"
  />
</template>`;

const wrapCode = `<template>
  <!-- truncate={false} lets long values wrap instead of clipping them. -->
  <InlineCopyText :truncate="false" text="0c239dd2-1f6a-4c0b-9f8e-2c1f77bd9a10" />
</template>`;

export const inlineCopyTextExamples = [
  {
    id: "table-cell",
    title: "Table cell",
    variant: "table-cell",
    description: "The control shrinks inside narrow containers. Keep `min-width: 0` on the cell so the value truncates instead of pushing the table wider.",
    code: tableCellCode,
  },
  {
    id: "variants",
    title: "Text variants",
    variant: "variants",
    description: "Typography comes from the Text component. Headings are not available here: use `body`, `secondary`, `success`, `error`, `mono`, or `mono-secondary`.",
    code: variantsCode,
  },
  {
    id: "custom-labels",
    title: "Custom labels",
    variant: "custom-labels",
    description: "Pass `labels` to localize the accessible name and the copied announcement.",
    code: customLabelsCode,
  },
  {
    id: "wrapping",
    title: "Wrapping",
    variant: "wrap",
    description: "Set `truncate` to false when the full value must stay readable.",
    code: wrapCode,
  },
] as const;

export const inlineCopyTextProps = [
  {
    name: "text",
    type: "string",
    defaultValue: "-",
    description: "Required. Text shown in the control. It is copied unless textToCopy is set.",
  },
  {
    name: "textToCopy",
    type: "string",
    defaultValue: "-",
    description: "Value written to the clipboard. Defaults to text.",
  },
  {
    name: "variant",
    type: '"body" | "secondary" | "success" | "error" | "mono" | "mono-secondary"',
    defaultValue: '"mono-secondary"',
    description: "Text typography. Heading variants are excluded.",
  },
  {
    name: "as",
    type: '"span" | "code" | "em" | "strong" | "small" | "abbr" | "time"',
    defaultValue: '"span"',
    description: "Semantic element used for the displayed text inside the button.",
  },
  {
    name: "size",
    type: '"xs" | "sm" | "base" | "lg"',
    defaultValue: "variant default",
    description: "Text size. Monospace variants accept only lg, matching Text.",
  },
  {
    name: "bold",
    type: "boolean",
    defaultValue: "false",
    description: "Bold text for body and semantic color variants. Monospace variants do not accept it.",
  },
  {
    name: "truncate",
    type: "boolean",
    defaultValue: "true",
    description: "Truncates the text with an ellipsis instead of wrapping.",
  },
  {
    name: "labels",
    type: "{ copyAction?: string; copied?: string }",
    defaultValue: "-",
    description: "Accessible names before and after copying.",
  },
  {
    name: "@copy",
    type: "({ text }: { text: string }) => void",
    defaultValue: "-",
    description: "Emitted after a successful clipboard write with the copied value. Never emitted when the write fails.",
  },
  { name: "class", type: "string", defaultValue: "-", description: "Forwarded to the button element." },
] as const;
