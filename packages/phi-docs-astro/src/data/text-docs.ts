export const textBarrelCode = `import { Text } from "@dicehub/phi";`;

export const textGranularCode = `import { Text } from "@dicehub/phi/components/text";`;

export const textPreviewCode = `<script setup>
import { Text } from "@dicehub/phi/components/text";
</script>

<template>
  <div class="text-demo-grid">
    <div class="text-demo-card">
      <Text variant="heading">Heading</Text>
      <Text variant="mono-secondary">text-base (16px)</Text>
    </div>

    <div class="text-demo-card">
      <Text variant="heading" size="lg" as="h2">Heading large</Text>
      <Text variant="mono-secondary">text-lg (20px)</Text>
    </div>

    <div class="text-demo-card">
      <Text>Body</Text>
      <Text variant="mono-secondary">text-base (14px)</Text>
    </div>

    <div class="text-demo-card">
      <Text bold>Body bold</Text>
      <Text variant="mono-secondary">text-base (14px)</Text>
    </div>

    <div class="text-demo-card">
      <Text size="lg">Body lg</Text>
      <Text variant="mono-secondary">text-lg (16px)</Text>
    </div>

    <div class="text-demo-card">
      <Text size="sm">Body sm</Text>
      <Text variant="mono-secondary">text-sm (13px)</Text>
    </div>

    <div class="text-demo-card">
      <Text size="xs">Body xs</Text>
      <Text variant="mono-secondary">text-xs (12px)</Text>
    </div>

    <div class="text-demo-card">
      <Text variant="secondary">Body secondary</Text>
      <Text variant="mono-secondary">text-base (14px)</Text>
    </div>

    <div class="text-demo-card">
      <Text variant="mono">Monospace</Text>
      <Text variant="mono-secondary">text-sm (13px)</Text>
    </div>

    <div class="text-demo-card">
      <Text variant="mono" size="lg">Monospace lg</Text>
      <Text variant="mono-secondary">text-base (14px)</Text>
    </div>

    <div class="text-demo-card">
      <Text variant="mono-secondary">Monospace secondary</Text>
      <Text variant="mono-secondary">text-sm (13px)</Text>
    </div>

    <div class="text-demo-card">
      <Text variant="success">Success</Text>
      <Text variant="mono-secondary">text-base (14px)</Text>
    </div>

    <div class="text-demo-card">
      <Text variant="error">Error</Text>
      <Text variant="mono-secondary">text-base (14px)</Text>
    </div>
  </div>
</template>`;

export const textUsageCode = `<script setup>
import { Text } from "@dicehub/phi/components/text";
</script>

<template>
  <Text>Your content here</Text>
</template>`;

export const textSemanticCode = `<template>
  <!-- Heading styles do not choose a semantic element for you. -->
  <Text variant="heading" size="lg" as="h1">Page Title</Text>
  <Text variant="heading" as="h2">Section Title</Text>

  <!-- Decorative heading-styled text that is not a section heading. -->
  <Text variant="heading" as="span">Big bold card label</Text>

  <!-- Visually one size, semantically another. -->
  <Text variant="heading" as="h3">Visually heading-sized, semantically h3</Text>
</template>`;

export const textRestrictionsCode = `<template>
  <Text size="sm" bold>Body</Text>
  <Text variant="secondary" bold>Body secondary</Text>
  <Text variant="success" size="lg">Success</Text>
  <Text variant="error">Error</Text>

  <Text variant="mono">Monospace</Text>
  <Text variant="mono" size="lg">Monospace lg</Text>

  <!-- Invalid in TypeScript: mono variants cannot use \`bold\`. -->
  <!-- <Text variant="mono" bold>Monospace</Text> -->

  <!-- Invalid in TypeScript: heading supports only the \`lg\` size. -->
  <!-- <Text variant="heading" size="base">Heading</Text> -->
</template>`;

export const textTruncateCode = `<script setup>
import { Text } from "@dicehub/phi/components/text";
</script>

<template>
  <div class="text-demo-truncate-card">
    <Text truncate>
      This is a long piece of text that will be truncated with an ellipsis when it overflows its container.
    </Text>
  </div>
</template>`;

export const textProps = [
  {
    name: "variant",
    type: '"heading" | "heading1" | "heading2" | "heading3" | "body" | "secondary" | "success" | "error" | "mono" | "mono-secondary"',
    defaultValue: '"body"',
    description:
      'Text style variant. `"heading"` is 16px semibold by default or 20px with `size="lg"`; the numbered heading variants are deprecated. `"body"` is default text, `"secondary"` is muted text, `"success"` uses the link color, `"error"` uses the danger color, `"mono"` is monospace, and `"mono-secondary"` is muted monospace.',
  },
  {
    name: "size",
    type: '"xs" | "sm" | "base" | "lg"',
    defaultValue: '"base"',
    description:
      'Text size for `heading`, `body`, `secondary`, `success`, and `error` variants. Heading accepts only `"lg"` (20px); copy accepts `"xs"` (12px), `"sm"` (13px), `"base"` (14px), and `"lg"` (16px). For `mono` variants, only `"lg"` is accepted and renders as 14px. Non-heading variants inherit line height from their parent.',
  },
  {
    name: "bold",
    type: "boolean",
    defaultValue: "-",
    description: "Whether to use medium font weight. Only applies to body-style variants.",
  },
  {
    name: "truncate",
    type: "boolean",
    defaultValue: "-",
    description: "Whether to clip overflowing text with an ellipsis. Adds `overflow: hidden`, `text-overflow: ellipsis`, `white-space: nowrap`, and `min-width: 0`.",
  },
  {
    name: "as",
    type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "label" | "dt" | "dd" | "li" | "figcaption" | "legend" | "pre" | "code" | "em" | "strong" | "small" | "abbr" | "time"',
    defaultValue: "-",
    description:
      'The HTML element to render. Optional for `heading` and defaults to `<span>`; required by the exported `TextProps` type for deprecated numbered heading variants. Body variants default to `<p>` and monospace variants default to `<span>` at runtime.',
  },
  {
    name: "default",
    type: "slot",
    defaultValue: "-",
    description: "Text content.",
  },
] as const;
