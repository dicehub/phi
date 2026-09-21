<script setup lang="ts">
import { computed, useSlots } from "vue";
import { Tabs, type TabsItem } from "@dicehub/phi/components/tabs";

type PageHeaderSpacing = "compact" | "base" | "relaxed";

const props = withDefaults(
  defineProps<{
    spacing?: PageHeaderSpacing;
    title?: string;
    description?: string;
    tabs?: TabsItem[];
    defaultTab?: string;
  }>(),
  {
    spacing: "base",
    title: undefined,
    description: undefined,
    tabs: () => [],
    defaultTab: undefined,
  },
);

const emit = defineEmits<{
  valueChange: [value: string];
}>();

const slots = useSlots();
const hasTabs = computed(() => props.tabs.length > 0);
</script>

<template>
  <div class="phi-page-header" :data-spacing="props.spacing">
    <div v-if="slots.breadcrumbs" class="phi-page-header__breadcrumbs">
      <slot name="breadcrumbs" />
    </div>

    <div v-if="props.title || props.description" class="phi-page-header__heading">
      <h1 v-if="props.title" class="phi-page-header__title">{{ props.title }}</h1>
      <p v-if="props.description" class="phi-page-header__description">{{ props.description }}</p>
    </div>

    <div v-if="hasTabs" class="phi-page-header__tabs-row">
      <Tabs
        :tabs="props.tabs"
        :selected-value="props.defaultTab"
        @value-change="(value: string) => emit('valueChange', value)"
      />
      <div v-if="slots.default" class="phi-page-header__actions">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.phi-page-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: var(--phi-font-sans, ui-sans-serif, system-ui, sans-serif);
}

.phi-page-header[data-spacing="compact"] {
  gap: 0.25rem;
}

.phi-page-header[data-spacing="relaxed"] {
  gap: 1rem;
}

.phi-page-header__breadcrumbs {
  border-bottom: 1px solid var(--phi-hairline, rgba(16, 24, 40, 0.08));
}

.phi-page-header__heading {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem 0 0.75rem 0.75rem;
}

.phi-page-header__title {
  margin: 0;
  font-size: 1.875rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--phi-default, #17191f);
}

.phi-page-header__description {
  margin: 0;
  max-width: 65ch;
  font-size: 1rem;
  color: var(--phi-subtle, #7d8693);
  text-wrap: balance;
}

.phi-page-header__tabs-row {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  border-bottom: 1px solid var(--phi-hairline, rgba(16, 24, 40, 0.08));
  padding: 0.25rem 0 0.75rem 0.75rem;
}

.phi-page-header__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
