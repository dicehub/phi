export const skeletonLineBarrelCode = `import { SkeletonLine } from "@dicehub/phi";`;

export const skeletonLineGranularCode = `import { SkeletonLine } from "@dicehub/phi/components/skeleton-line";`;

export const skeletonLinePreviewCode = `<script setup>
import { SkeletonLine } from "@dicehub/phi/components/skeleton-line";
</script>

<template>
  <div class="skeleton-line-stack">
    <SkeletonLine />
    <SkeletonLine />
    <SkeletonLine />
  </div>
</template>`;

const customWidthsCode = `<script setup>
import { SkeletonLine } from "@dicehub/phi/components/skeleton-line";
</script>

<template>
  <div class="skeleton-line-stack">
    <SkeletonLine :min-width="80" :max-width="100" />
    <SkeletonLine :min-width="60" :max-width="80" />
    <SkeletonLine :min-width="40" :max-width="60" />
  </div>
</template>`;

const customHeightCode = `<script setup>
import { SkeletonLine } from "@dicehub/phi/components/skeleton-line";
</script>

<template>
  <div class="skeleton-line-stack">
    <SkeletonLine class-name="h-2" />
    <SkeletonLine class-name="h-4" />
    <SkeletonLine class-name="h-6" />
    <SkeletonLine class-name="h-8" />
  </div>
</template>`;

const blockHeightCode = `<script setup>
import { SkeletonLine } from "@dicehub/phi/components/skeleton-line";
</script>

<template>
  <div class="skeleton-line-stack skeleton-line-block-demo">
    <div class="skeleton-line-block-demo__row">
      <span>32px</span>
      <SkeletonLine :block-height="32" />
    </div>
    <div class="skeleton-line-block-demo__row">
      <span>48px</span>
      <SkeletonLine :block-height="48" />
    </div>
    <div class="skeleton-line-block-demo__row">
      <span>64px</span>
      <SkeletonLine :block-height="64" />
    </div>
  </div>
</template>`;

const cardLoadingStateCode = `<script setup>
import { SkeletonLine } from "@dicehub/phi/components/skeleton-line";
</script>

<template>
  <div class="skeleton-card">
    <div class="skeleton-card__title">
      <SkeletonLine :min-width="40" :max-width="60" />
    </div>
    <div class="skeleton-line-stack skeleton-line-stack--compact">
      <SkeletonLine />
      <SkeletonLine />
      <SkeletonLine :min-width="50" :max-width="70" />
    </div>
  </div>
</template>`;

export const skeletonLineExamples = [
  {
    id: "custom-widths",
    title: "Custom Widths",
    variant: "custom-widths",
    description: "Control the randomized width range for more natural-looking skeletons.",
    code: customWidthsCode,
  },
  {
    id: "custom-height",
    title: "Custom Height",
    variant: "custom-height",
    description: "Override the default height using CSS classes via `className`. The default height is `0.5rem`.",
    code: customHeightCode,
  },
  {
    id: "block-height",
    title: "Block Height",
    variant: "block-height",
    description:
      "Use `blockHeight` to set the height of a container that vertically centers the skeleton line. Numbers are treated as `px`; strings are passed through as CSS values.",
    code: blockHeightCode,
  },
  {
    id: "card-loading-state",
    title: "Card Loading State",
    variant: "card",
    description: "Use skeleton lines to create loading states for cards and content areas.",
    code: cardLoadingStateCode,
  },
] as const;

export const skeletonLineProps = [
  {
    name: "minWidth",
    type: "number",
    defaultValue: "30",
    description: "Minimum randomized line width as a percentage.",
  },
  {
    name: "maxWidth",
    type: "number",
    defaultValue: "100",
    description: "Maximum randomized line width as a percentage.",
  },
  {
    name: "minDuration",
    type: "number",
    defaultValue: "1.3",
    description: "Minimum shimmer animation duration in seconds.",
  },
  {
    name: "maxDuration",
    type: "number",
    defaultValue: "1.7",
    description: "Maximum shimmer animation duration in seconds.",
  },
  {
    name: "minDelay",
    type: "number",
    defaultValue: "0",
    description: "Minimum shimmer animation delay in seconds.",
  },
  {
    name: "maxDelay",
    type: "number",
    defaultValue: "0.5",
    description: "Maximum shimmer animation delay in seconds.",
  },
  {
    name: "blockHeight",
    type: "string | number",
    defaultValue: "-",
    description: "Optional block height that vertically centers the line.",
  },
  {
    name: "className",
    type: "string",
    defaultValue: "-",
    description: "Additional CSS classes applied to the skeleton line.",
  },
] as const;
