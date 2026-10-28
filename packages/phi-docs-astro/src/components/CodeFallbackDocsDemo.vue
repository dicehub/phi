<script setup lang="ts">
import { CodeHighlighted, ShikiProvider } from "@dicehub/phi/code";
const code = "first line\nsecond line";
</script>

<template>
  <div data-code-fallback-demo>
    <ShikiProvider :languages="['typescript']">
      <div v-for="variant in (['default', 'plain'] as const)" :key="variant">
        <p>{{ variant === "plain" ? "Plain" : "Default" }} fallback, without and with line numbers:</p>
        <CodeHighlighted :code="code" lang="unsupported-example" :variant="variant" />
        <CodeHighlighted :code="code" lang="unsupported-example" :variant="variant" show-line-numbers />
      </div>
    </ShikiProvider>
  </div>
</template>
