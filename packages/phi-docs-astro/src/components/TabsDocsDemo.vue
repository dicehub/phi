<script setup lang="ts">
import { ref } from "vue";
import { Tabs, type TabsItem } from "@dicehub/phi/components/tabs";

type DemoVariant = "preview" | "segmented" | "underline" | "small" | "controlled" | "overflow";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);

const tabs: TabsItem[] = [
  { value: "tab1", label: "Tab 1" },
  { value: "tab2", label: "Tab 2" },
  { value: "tab3", label: "Tab 3" },
];

const overflowTabs: TabsItem[] = [
  { value: "overview", label: "Overview" },
  { value: "analytics", label: "Analytics" },
  { value: "reports", label: "Reports" },
  { value: "notifications", label: "Notifications" },
  { value: "settings", label: "Settings" },
  { value: "billing", label: "Billing" },
  { value: "security", label: "Security" },
  { value: "integrations", label: "Integrations" },
];

const activeTab = ref("tab1");
</script>

<template>
  <div class="tabs-demo" :class="{ 'tabs-demo--overflow': variant === 'overflow' }">
    <div v-if="variant === 'preview'" class="tabs-demo__stack">
      <div class="tabs-demo__group">
        <p class="tabs-demo__label">Segmented (default)</p>
        <Tabs :tabs="tabs" selected-value="tab1" variant="segmented" />
      </div>
      <div class="tabs-demo__group">
        <p class="tabs-demo__label">Underline</p>
        <Tabs :tabs="tabs" selected-value="tab1" variant="underline" />
      </div>
    </div>

    <Tabs v-else-if="variant === 'segmented'" :tabs="tabs" selected-value="tab1" variant="segmented" />
    <Tabs v-else-if="variant === 'underline'" :tabs="tabs" selected-value="tab1" variant="underline" />

    <div v-else-if="variant === 'small'" class="tabs-demo__stack">
      <div class="tabs-demo__group">
        <p class="tabs-demo__label">Segmented sm</p>
        <Tabs :tabs="tabs" selected-value="tab1" size="sm" />
      </div>
      <div class="tabs-demo__group">
        <p class="tabs-demo__label">Underline sm</p>
        <Tabs :tabs="tabs" selected-value="tab1" variant="underline" size="sm" />
      </div>
    </div>

    <div v-else-if="variant === 'controlled'" class="tabs-demo__stack">
      <Tabs v-model:value="activeTab" :tabs="tabs" />
      <p class="tabs-demo__status">Active tab: <code>{{ activeTab }}</code></p>
    </div>

    <div v-else-if="variant === 'overflow'" class="tabs-demo__overflow">
      <Tabs :tabs="overflowTabs" selected-value="overview" />
    </div>
  </div>
</template>

<style>
.tabs-demo {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  justify-content: center;
  color: var(--docs-default);
}

.tabs-demo__stack {
  display: grid;
  gap: 1.5rem;
  justify-items: start;
}

.tabs-demo__group {
  display: grid;
  gap: 0.5rem;
}

.tabs-demo__label,
.tabs-demo__status {
  margin: 0;
  color: var(--phi-subtle, #6c7480);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.tabs-demo__status code {
  color: var(--phi-default, #17191f);
}

.tabs-demo__overflow,
.tabs-demo--overflow {
  width: 100%;
  max-width: 20rem;
  min-width: 0;
}
</style>
