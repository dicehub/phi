<script setup lang="ts">
import { ClipboardText } from "../../../phi/src/components/clipboard-text";

type DemoVariant = "basic" | "usage" | "short" | "api-key" | "alternate" | "long" | "tooltip";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "basic",
  },
);
</script>

<template>
  <div class="clipboard-text-demo" :class="{ 'clipboard-text-demo--tooltip': variant === 'tooltip' }">
    <ClipboardText v-if="variant === 'basic'" text="0c239dd2" />
    <ClipboardText v-else-if="variant === 'usage'" text="Copy this text" />
    <ClipboardText v-else-if="variant === 'short'" text="abc123" />
    <ClipboardText v-else-if="variant === 'api-key'" text="sk_live_51H8..." />
    <ClipboardText
      v-else-if="variant === 'alternate'"
      text="sk_live_***********"
      text-to-copy="sk_live_51H8_abc123"
    />
    <ClipboardText v-else-if="variant === 'long'" text="https://example.com/very/long/url/path" />
    <ClipboardText
      v-else
      text="npx phi add button"
      :tooltip="{ text: 'Copy', copiedText: 'Copied!', side: 'top' }"
    />
  </div>
</template>

<style scoped>
.clipboard-text-demo {
  display: flex;
  min-height: 4.5rem;
  align-items: center;
  justify-content: center;
}

.clipboard-text-demo--tooltip {
  min-height: 6.5rem;
}
</style>
