<script setup lang="ts">
import { SkeletonLine } from "@dicehub/phi/components/skeleton-line";

type DemoVariant = "preview" | "custom-widths" | "custom-height" | "block-height" | "card";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);
</script>

<template>
  <div class="skeleton-line-demo">
    <div v-if="variant === 'custom-widths'" class="skeleton-line-demo__stack">
      <SkeletonLine :min-width="80" :max-width="100" />
      <SkeletonLine :min-width="60" :max-width="80" />
      <SkeletonLine :min-width="40" :max-width="60" />
    </div>

    <div v-else-if="variant === 'custom-height'" class="skeleton-line-demo__stack">
      <SkeletonLine class-name="h-2" />
      <SkeletonLine class-name="h-4" />
      <SkeletonLine class-name="h-6" />
      <SkeletonLine class-name="h-8" />
    </div>

    <div v-else-if="variant === 'block-height'" class="skeleton-line-demo__block-list">
      <div class="skeleton-line-demo__block-row">
        <span class="skeleton-line-demo__block-label">32px</span>
        <SkeletonLine :block-height="32" />
      </div>
      <div class="skeleton-line-demo__block-row">
        <span class="skeleton-line-demo__block-label">48px</span>
        <SkeletonLine :block-height="48" />
      </div>
      <div class="skeleton-line-demo__block-row">
        <span class="skeleton-line-demo__block-label">64px</span>
        <SkeletonLine :block-height="64" />
      </div>
    </div>

    <div v-else-if="variant === 'card'" class="skeleton-line-demo__card">
      <div class="skeleton-line-demo__card-title">
        <SkeletonLine :min-width="40" :max-width="60" />
      </div>
      <div class="skeleton-line-demo__stack skeleton-line-demo__stack--compact">
        <SkeletonLine />
        <SkeletonLine />
        <SkeletonLine :min-width="50" :max-width="70" />
      </div>
    </div>

    <div v-else class="skeleton-line-demo__stack">
      <SkeletonLine />
      <SkeletonLine />
      <SkeletonLine />
    </div>
  </div>
</template>

<style>
.skeleton-line-demo {
  display: flex;
  width: 100%;
  min-height: 7rem;
  align-items: center;
  justify-content: center;
  color: var(--docs-default);
}

.skeleton-line-demo__stack {
  display: flex;
  width: 16rem;
  max-width: 100%;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-line-demo__stack--compact {
  gap: 0.5rem;
}

.skeleton-line-demo .h-2 {
  height: 0.5rem;
}

.skeleton-line-demo .h-4 {
  height: 1rem;
}

.skeleton-line-demo .h-6 {
  height: 1.5rem;
}

.skeleton-line-demo .h-8 {
  height: 2rem;
}

.skeleton-line-demo__block-list {
  display: grid;
  width: 19.5rem;
  max-width: 100%;
  gap: 0.25rem;
}

.skeleton-line-demo__block-row {
  display: grid;
  grid-template-columns: 3.25rem minmax(0, 16rem);
  align-items: stretch;
  gap: 0.5rem;
}

.skeleton-line-demo__block-label {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.5rem;
  border-right: 2px solid var(--phi-tint, #f4f6f9);
  color: var(--docs-subtle);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.skeleton-line-demo__card {
  width: 16rem;
  max-width: 100%;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 0 1px var(--phi-hairline, rgba(16, 24, 40, 0.08));
}

.skeleton-line-demo__card-title {
  height: 1rem;
  margin-bottom: 1rem;
}
</style>
