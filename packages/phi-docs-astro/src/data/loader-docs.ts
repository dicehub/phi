export const loaderBarrelCode = `import { Loader } from "@dicehub/phi";`;

export const loaderGranularCode = `import { Loader } from "@dicehub/phi/components/loader";`;

export const loaderPreviewCode = `<script setup>
import { Loader } from "@dicehub/phi/components/loader";
</script>

<template>
  <Loader />
</template>`;

export const loaderUsageCode = `<script setup>
import { Loader } from "@dicehub/phi/components/loader";
</script>

<template>
  <Loader />
</template>`;

const defaultSizeCode = `<script setup>
import { Loader } from "@dicehub/phi/components/loader";
</script>

<template>
  <Loader />
</template>`;

const customSizeCode = `<script setup>
import { Loader } from "@dicehub/phi/components/loader";
</script>

<template>
  <Loader :size="24" />
</template>`;

export const loaderExamples = [
  { id: "default-size", title: "Default Size", variant: "default", code: defaultSizeCode },
  { id: "custom-size", title: "Custom Size", variant: "custom", code: customSizeCode },
] as const;

export const loaderProps = [
  {
    name: "size",
    type: '"sm" | "base" | "lg" | number',
    defaultValue: '"base"',
    description: 'SVG width and height. Presets map to 16px, 24px, and 32px; numbers are treated as pixels. CSS width and height can override this size.',
  },
  { name: "class", type: "string", defaultValue: "-", description: "Additional CSS classes." },
] as const;
