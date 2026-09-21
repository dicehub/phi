<script setup lang="ts">
defineProps<{ variant: "status" | "surface" }>();
</script>

<template>
  <div
    v-if="variant === 'surface'"
    class="docs-colors-live-demo docs-colors-surface-demo bg-phi-canvas text-phi-default"
    data-colors-demo="surface"
  >
    <div class="docs-colors-surface-demo__base bg-phi-base border-phi-hairline">
      <span class="docs-colors-demo-label text-phi-subtle">Canvas → Base</span>
      <strong class="text-phi-strong">Workspace</strong>
      <div class="docs-colors-surface-demo__layers">
        <div class="docs-colors-surface-demo__layer bg-phi-elevated border-phi-line">
          <span class="docs-colors-demo-label text-phi-subtle">Elevated</span>
          <span>Active work</span>
        </div>
        <div class="docs-colors-surface-demo__layer bg-phi-recessed">
          <span class="docs-colors-demo-label text-phi-subtle">Recessed</span>
          <span>Grouped controls</span>
        </div>
      </div>
      <span class="docs-colors-surface-demo__tag bg-phi-contrast text-phi-inverse">Contrast</span>
    </div>
  </div>

  <div
    v-else
    class="docs-colors-live-demo docs-colors-status-grid"
    data-colors-demo="status"
  >
    <article class="docs-colors-status-card bg-phi-info-tint border-phi-info text-phi-info">
      <svg viewBox="0 0 20 20" aria-hidden="true" class="fill-phi-info"><circle cx="10" cy="10" r="8" /></svg>
      <span><strong>Info</strong> Deployment starts in five minutes.</span>
    </article>
    <article class="docs-colors-status-card bg-phi-success-tint border-phi-success text-phi-success">
      <svg viewBox="0 0 20 20" aria-hidden="true" class="fill-phi-success"><circle cx="10" cy="10" r="8" /></svg>
      <span><strong>Success</strong> Changes are live.</span>
    </article>
    <article class="docs-colors-status-card bg-phi-warning-tint border-phi-warning text-phi-warning">
      <svg viewBox="0 0 20 20" aria-hidden="true" class="fill-phi-warning"><circle cx="10" cy="10" r="8" /></svg>
      <span><strong>Warning</strong> Review the pending update.</span>
    </article>
    <article class="docs-colors-status-card bg-phi-danger-tint border-phi-danger text-phi-danger">
      <svg viewBox="0 0 20 20" aria-hidden="true" class="fill-phi-danger"><circle cx="10" cy="10" r="8" /></svg>
      <span><strong>Danger</strong> The deployment failed.</span>
    </article>
  </div>
</template>
