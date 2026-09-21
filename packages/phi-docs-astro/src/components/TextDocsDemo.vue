<script setup lang="ts">
import { Text } from "@dicehub/phi/components/text";

type TextDocsDemoVariant = "variants" | "truncate";

withDefaults(
  defineProps<{
    variant?: TextDocsDemoVariant;
  }>(),
  {
    variant: "variants",
  },
);
</script>

<template>
  <div v-if="variant === 'truncate'" class="text-demo-truncate-card">
    <Text truncate>
      This is a long piece of text that will be truncated with an ellipsis when it overflows its container.
    </Text>
  </div>

  <div v-else class="text-demo-grid">
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
</template>
