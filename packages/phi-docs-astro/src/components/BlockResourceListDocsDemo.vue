<script setup lang="ts">
import { computed } from "vue";
import ResourceListPage from "../../../phi/templates/blocks/resource-list-page/ResourceListPage.vue";

type DemoVariant = "basic" | "complete" | "minimal" | "usage";

const props = withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "complete",
  },
);

const title = computed(() => {
  if (props.variant === "minimal") return undefined;
  if (props.variant === "usage") return "API Keys";
  if (props.variant === "basic") return "Databases";
  return "KV Namespaces";
});
const description = computed(() => {
  if (props.variant === "minimal") return undefined;
  if (props.variant === "usage") return "Create and manage API keys for your applications";
  if (props.variant === "basic") return "Manage your database instances and configurations";
  return "Store key-value data globally with low-latency access";
});
const showUsage = computed(() => props.variant === "complete" || props.variant === "usage");
const showAdditionalContent = computed(() => props.variant === "complete");
</script>

<template>
  <div class="resource-list-demo" :data-variant="props.variant">
    <ResourceListPage :description="description" :title="title">
      <template v-if="props.variant !== 'minimal'" #icon>
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <ellipse cx="16" cy="8" rx="10" ry="4" />
          <path d="M6 8v8c0 2.2 4.5 4 10 4s10-1.8 10-4V8" />
          <path d="M6 16v8c0 2.2 4.5 4 10 4s10-1.8 10-4v-8" />
        </svg>
      </template>

      <template v-if="props.variant === 'complete'">
        <article class="resource-list-surface">
          <p class="resource-list-surface__title">production-kv</p>
          <p>Created 2 days ago</p>
        </article>
        <article class="resource-list-surface">
          <p class="resource-list-surface__title">staging-kv</p>
          <p>Created 1 week ago</p>
        </article>
      </template>
      <article v-else class="resource-list-surface">
        <p>{{ props.variant === "usage" ? "API keys list would appear here" : "Main content area - your resource list would go here" }}</p>
      </article>

      <template v-if="showUsage" #usage>
        <article class="resource-list-surface resource-list-surface--sidebar">
          <h3>{{ props.variant === "usage" ? "Quick Start" : "Usage Example" }}</h3>
          <p v-if="props.variant === 'usage'">Generate an API key to authenticate your requests</p>
          <pre v-if="props.variant === 'usage'"><code>curl --oauth2-bearer "$API_TOKEN" https://api.example.com</code></pre>
          <pre v-else><code>// Read from KV
const value = await KV.get('key');

// Write to KV
await KV.put('key', 'value');</code></pre>
        </article>
      </template>

      <template v-if="showAdditionalContent" #additionalContent>
        <article class="resource-list-surface resource-list-surface--sidebar">
          <h3>Learn More</h3>
          <p>Check out our documentation to learn more about KV storage.</p>
        </article>
      </template>
    </ResourceListPage>
  </div>
</template>

<style scoped>
.resource-list-demo {
  width: 100%;
  min-width: 0;
}

/* The docs preview frames the block, so it does not need a full viewport of height. */
.resource-list-demo :deep(.phi-resource-list-page) {
  min-height: auto;
}

.resource-list-surface {
  min-width: 0;
  border: 1px solid var(--phi-line);
  border-radius: 0.5rem;
  background: var(--phi-base);
  padding: 1.5rem;
}

.resource-list-surface--sidebar {
  padding: 1rem;
}

.resource-list-surface h3,
.resource-list-surface p {
  margin: 0;
}

.resource-list-surface h3,
.resource-list-surface__title {
  color: var(--phi-default);
  font-size: 1rem;
  font-weight: 600;
}

.resource-list-surface p {
  margin-top: 0.5rem;
  color: var(--phi-subtle);
  font-size: 0.875rem;
  line-height: 1.45;
}

.resource-list-surface pre {
  overflow-x: auto;
  margin: 0.75rem 0 0;
  border: 1px solid var(--phi-line);
  border-radius: 0.375rem;
  background: var(--phi-tint);
  padding: 0.75rem;
  color: var(--phi-default);
  font-size: 0.75rem;
  line-height: 1.45;
}
</style>
