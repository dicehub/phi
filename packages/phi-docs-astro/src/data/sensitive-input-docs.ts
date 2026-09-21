export const sensitiveInputBarrelCode = `import { SensitiveInput } from "@dicehub/phi";`;

export const sensitiveInputGranularCode = `import { SensitiveInput } from "@dicehub/phi/components/sensitive-input";`;

export const sensitiveInputPreviewCode = `<script setup>
import { SensitiveInput } from "@dicehub/phi/components/sensitive-input";
</script>

<template>
  <SensitiveInput
    label="API Key"
    default-value="example-api-key"
  />
</template>`;

export const sensitiveInputUsageCode = `<script setup>
import { SensitiveInput } from "@dicehub/phi/components/sensitive-input";
</script>

<template>
  <SensitiveInput label="Secret" default-value="my-secret-key" />
</template>`;

const sizesCode = `<script setup>
import { SensitiveInput } from "@dicehub/phi/components/sensitive-input";

const sizes = ["xs", "sm", "base", "lg"];
</script>

<template>
  <div class="stack">
    <SensitiveInput
      v-for="size in sizes"
      :key="size"
      :label="\`\${size} size\`"
      :size="size"
      default-value="secret-api-key-123"
    />
  </div>
</template>`;

const controlledCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/phi/components/button";
import { SensitiveInput } from "@dicehub/phi/components/sensitive-input";

const value = ref("my-secret-value");
</script>

<template>
  <div class="stack">
    <SensitiveInput label="Controlled Secret" v-model="value" />
    <div>Current value: <code>{{ value }}</code></div>
    <div class="actions">
      <Button size="sm" variant="primary" @click="value = 'new-secret'">
        Change value
      </Button>
      <Button size="sm" variant="secondary" @click="value = ''">
        Clear
      </Button>
    </div>
  </div>
</template>`;

const statesCode = `<script setup>
import { SensitiveInput } from "@dicehub/phi/components/sensitive-input";
</script>

<template>
  <div class="stack">
    <SensitiveInput
      label="Error State"
      variant="error"
      default-value="invalid-key"
      error="This API key is not valid"
    />
    <SensitiveInput label="Disabled" default-value="cannot-edit" disabled />
    <SensitiveInput label="Read-only" default-value="view-only-secret-key" read-only />
    <SensitiveInput
      label="With Description"
      default-value="my-secret-value"
      description="Keep this value secure and don't share it"
    />
  </div>
</template>`;

export const sensitiveInputExamples = [
  {
    id: "sizes",
    title: "Sizes",
    variant: "sizes",
    description: "SensitiveInput supports multiple sizes to fit different contexts.",
    code: sizesCode,
  },
  {
    id: "controlled",
    title: "Controlled",
    variant: "controlled",
    description: "Use controlled mode for full control over the input value.",
    code: controlledCode,
  },
  {
    id: "states",
    title: "States",
    variant: "states",
    description: "Various input states including error, disabled, read-only, and with description.",
    code: statesCode,
  },
] as const;
