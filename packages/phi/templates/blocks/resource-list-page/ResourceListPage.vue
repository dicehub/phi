<script setup lang="ts">
import { computed, useSlots } from "vue";

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
  }>(),
  {
    title: undefined,
    description: undefined,
  },
);

const slots = useSlots();

const hasHeading = computed(() => Boolean(props.title) || Boolean(props.description) || Boolean(slots.icon));
const hasSidebar = computed(() => Boolean(slots.usage) || Boolean(slots.additionalContent));
</script>

<template>
  <div class="phi-resource-list-page">
    <div class="phi-resource-list-page__inner">
      <header v-if="hasHeading" class="phi-resource-list-page__header">
        <div v-if="props.title || slots.icon" class="phi-resource-list-page__title-row">
          <span v-if="slots.icon" class="phi-resource-list-page__icon">
            <slot name="icon" />
          </span>
          <h1 v-if="props.title" class="phi-resource-list-page__title">{{ props.title }}</h1>
        </div>
        <p v-if="props.description" class="phi-resource-list-page__description">{{ props.description }}</p>
      </header>

      <div class="phi-resource-list-page__layout">
        <main class="phi-resource-list-page__main">
          <slot />
        </main>

        <aside v-if="hasSidebar" class="phi-resource-list-page__aside">
          <div v-if="slots.usage" class="phi-resource-list-page__usage">
            <slot name="usage" />
          </div>
          <div v-if="slots.additionalContent" class="phi-resource-list-page__additional">
            <slot name="additionalContent" />
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.phi-resource-list-page {
  width: 100%;
  min-width: 0;
  min-height: 100svh;
  background: var(--phi-overlay, #f7f8fa);
  color: var(--phi-default, #17191f);
  font-family: var(--phi-font-sans, ui-sans-serif, system-ui, sans-serif);
}

.phi-resource-list-page__inner {
  display: flex;
  max-width: 87.5rem;
  flex-direction: column;
  gap: 1rem;
  margin: 0 auto;
  padding: 1.5rem;
}

.phi-resource-list-page__header {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.375rem;
}

.phi-resource-list-page__title-row {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.375rem;
}

.phi-resource-list-page__icon {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  color: var(--phi-subtle, #6c7480);
}

.phi-resource-list-page__icon :deep(svg) {
  width: 2rem;
  height: 2rem;
}

.phi-resource-list-page__title {
  min-width: 0;
  margin: 0;
  color: var(--phi-default, #17191f);
  font-size: 1.875rem;
  font-weight: 600;
  line-height: 1.15;
}

.phi-resource-list-page__description {
  margin: 0;
  color: var(--phi-subtle, #6c7480);
  font-size: 1.125rem;
  line-height: 1.45;
  text-wrap: pretty;
}

/* Main content comes first in the DOM so reading and focus order match the mobile layout. */
.phi-resource-list-page__layout {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 1.5rem;
}

.phi-resource-list-page__main {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 1rem;
}

.phi-resource-list-page__aside {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 1rem;
}

.phi-resource-list-page__usage,
.phi-resource-list-page__additional {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .phi-resource-list-page__inner {
    gap: 1rem;
    padding: 2rem;
  }
}

@media (min-width: 70rem) {
  .phi-resource-list-page__inner {
    gap: 1.5rem;
    padding: 2.25rem 2.5rem;
  }

  .phi-resource-list-page__layout {
    flex-direction: row;
    gap: 2rem;
  }

  .phi-resource-list-page__main {
    flex: 1 1 auto;
  }

  .phi-resource-list-page__aside {
    position: sticky;
    top: 5.5rem;
    width: 23.75rem;
    flex: none;
    align-self: flex-start;
  }
}
</style>
