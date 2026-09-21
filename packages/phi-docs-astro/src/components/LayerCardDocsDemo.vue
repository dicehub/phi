<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Badge } from "@dicehub/phi/components/badge";
import { Button } from "@dicehub/phi/components/button";
import { Input } from "@dicehub/phi/components/input";
import { LayerCard } from "@dicehub/phi/components/layer-card";
import { PhArrowRight } from "@phosphor-icons/vue";

type DemoVariant = "preview" | "usage" | "basic" | "surface" | "multiple" | "filter" | "test-ids";
type StatusFilter = "all" | "2xx" | "3xx" | "4xx" | "5xx";

const props = withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);

const origins = [
  { origin: "challenges.cloudflare.com", s2xx: 1, s4xx: 0, duration: "95.4ms" },
  { origin: "Unknown", s2xx: 19, s4xx: 7, duration: "463.7ms" },
  { origin: "api.example.com", s2xx: 42, s4xx: 3, duration: "128.1ms" },
];

const filterOptions: Array<{ label: string; value: StatusFilter }> = [
  { label: "All", value: "all" },
  { label: "2xx", value: "2xx" },
  { label: "3xx", value: "3xx" },
  { label: "4xx", value: "4xx" },
  { label: "5xx", value: "5xx" },
];

const activeFilter = ref<StatusFilter>("all");
const search = ref("");
const tabsEl = ref<HTMLElement>();
const activeTabMetrics = ref({
  height: 22,
  left: 0,
  rendered: false,
  top: 2,
  width: 0,
});

const updateActiveTabMetrics = async () => {
  await nextTick();

  const activeTab = tabsEl.value?.querySelector<HTMLButtonElement>('button[data-active="true"]');
  if (!activeTab) return;

  activeTabMetrics.value = {
    height: activeTab.offsetHeight,
    left: activeTab.offsetLeft,
    rendered: true,
    top: activeTab.offsetTop,
    width: activeTab.offsetWidth,
  };
};

const filteredOrigins = computed(() => {
  const query = search.value.trim().toLowerCase();

  return origins.filter((origin) => {
    if (activeFilter.value === "2xx" && origin.s2xx === 0) return false;
    if (activeFilter.value === "4xx" && origin.s4xx === 0) return false;
    if (["3xx", "5xx"].includes(activeFilter.value)) return false;
    if (query && !origin.origin.toLowerCase().includes(query)) return false;
    return true;
  });
});

const cardClass = computed(() => [
  "layer-card-demo",
  `layer-card-demo--${props.variant}`,
]);

const tabsStyle = computed<Record<string, string>>(() => ({
  "--active-tab-height": `${activeTabMetrics.value.height}px`,
  "--active-tab-left": `${activeTabMetrics.value.left}px`,
  "--active-tab-top": `${activeTabMetrics.value.top}px`,
  "--active-tab-width": `${activeTabMetrics.value.width}px`,
}));

onMounted(() => {
  void updateActiveTabMetrics();
  window.addEventListener("resize", updateActiveTabMetrics);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateActiveTabMetrics);
});

watch(activeFilter, () => {
  void updateActiveTabMetrics();
});
</script>

<template>
  <div :class="cardClass">
    <LayerCard v-if="variant === 'preview'" class="layer-card-demo__card layer-card-demo__card--preview">
      <LayerCard.Secondary class="layer-card-demo__secondary layer-card-demo__secondary--split">
        <span>Next Steps</span>
        <Button
          :icon="PhArrowRight"
          :icon-props="{ size: 16 }"
          aria-label="Go to next steps"
          shape="square"
          size="sm"
          variant="ghost"
        />
      </LayerCard.Secondary>
      <LayerCard.Primary>Get started with Phi</LayerCard.Primary>
    </LayerCard>

    <LayerCard v-else-if="variant === 'usage'" class="layer-card-demo__card">
      <LayerCard.Secondary>Documentation</LayerCard.Secondary>
      <LayerCard.Primary>Learn how to use Phi components</LayerCard.Primary>
    </LayerCard>

    <LayerCard v-else-if="variant === 'basic'" class="layer-card-demo__card">
      <LayerCard.Secondary>Getting Started</LayerCard.Secondary>
      <LayerCard.Primary>
        <p class="layer-card-demo__muted">Quick start guide for new users</p>
      </LayerCard.Primary>
    </LayerCard>

    <LayerCard v-else-if="variant === 'surface'" class="layer-card-demo__card layer-card-demo__surface">
      <p class="layer-card-demo__muted">Quick start guide for new users</p>
    </LayerCard>

    <div v-else-if="variant === 'multiple'" class="layer-card-demo__multiple">
      <LayerCard class="layer-card-demo__card layer-card-demo__card--small">
        <LayerCard.Secondary>Components</LayerCard.Secondary>
        <LayerCard.Primary>
          <p class="layer-card-demo__compact">Browse all components</p>
        </LayerCard.Primary>
      </LayerCard>

      <LayerCard class="layer-card-demo__card layer-card-demo__card--small">
        <LayerCard.Secondary>Examples</LayerCard.Secondary>
        <LayerCard.Primary>
          <p class="layer-card-demo__compact">View code examples</p>
        </LayerCard.Primary>
      </LayerCard>
    </div>

    <LayerCard v-else-if="variant === 'filter'" class="layer-card-demo__filter-card">
      <LayerCard.Secondary>Subrequests</LayerCard.Secondary>
      <LayerCard.Primary>
        <div class="layer-card-demo__toolbar">
          <Input
            v-model="search"
            aria-label="Filter origins"
            class="layer-card-demo__search"
            placeholder="Filter origins..."
            size="sm"
          />
          <div
            ref="tabsEl"
            class="layer-card-demo__tabs"
            role="tablist"
            aria-label="Status filter"
            :data-rendered="activeTabMetrics.rendered ? 'true' : 'false'"
            :style="tabsStyle"
          >
            <span class="layer-card-demo__tabs-indicator" role="presentation" aria-hidden="true" />
            <button
              v-for="option in filterOptions"
              :key="option.value"
              type="button"
              role="tab"
              :aria-selected="activeFilter === option.value"
              :data-active="activeFilter === option.value ? 'true' : undefined"
              @click="activeFilter = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="layer-card-demo__table" role="table" aria-label="Subrequest origins">
          <div class="layer-card-demo__row layer-card-demo__row--header" role="row">
            <span role="columnheader">Origin</span>
            <span role="columnheader">Requests</span>
            <span role="columnheader">Duration</span>
          </div>

          <div
            v-for="origin in filteredOrigins"
            :key="origin.origin"
            class="layer-card-demo__row"
            role="row"
          >
            <span class="layer-card-demo__origin" role="cell">{{ origin.origin }}</span>
            <span class="layer-card-demo__requests" role="cell">
              <Badge v-if="origin.s2xx > 0" variant="success">2xx {{ origin.s2xx }}</Badge>
              <Badge v-if="origin.s4xx > 0" variant="error">4xx {{ origin.s4xx }}</Badge>
            </span>
            <span class="layer-card-demo__duration" role="cell">{{ origin.duration }}</span>
          </div>
        </div>

        <div class="layer-card-demo__footer">
          Showing {{ filteredOrigins.length }} of {{ origins.length }}
        </div>
      </LayerCard.Primary>
    </LayerCard>

    <LayerCard v-else class="layer-card-demo__card">
      <LayerCard.Secondary data-testid="card-header">Getting Started</LayerCard.Secondary>
      <LayerCard.Primary data-testid="card-body" aria-label="Getting started body">
        <p class="layer-card-demo__muted">Quick start guide for new users</p>
      </LayerCard.Primary>
    </LayerCard>
  </div>
</template>

<style scoped>
.layer-card-demo {
  display: flex;
  width: 100%;
  justify-content: center;
}

.layer-card-demo__card {
  width: 15.625rem;
}

.layer-card-demo__card--small {
  width: 12.5rem;
}

.layer-card-demo__card--preview {
  width: 100%;
  max-width: 49.75rem;
}

.layer-card-demo__filter-card {
  width: min(100%, 33.75rem);
}

.layer-card-demo__surface {
  padding: 1rem;
}

.layer-card-demo__secondary--split {
  justify-content: space-between;
}

.layer-card-demo__muted,
.layer-card-demo__compact {
  margin: 0;
  color: var(--phi-subtle, #6c7480);
  font-size: 0.8125rem;
  line-height: 0.95625rem;
}

.layer-card-demo__compact {
  color: var(--phi-default, #17191f);
}

.layer-card-demo__multiple {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.layer-card-demo__toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.layer-card-demo__search {
  min-width: 0;
  flex: 1 1 auto;
}

.layer-card-demo__tabs {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  flex: none;
  align-items: stretch;
  height: 1.625rem;
  padding: 0 0.125rem;
  border-radius: 0.375rem;
  background: var(--phi-tint, #f4f6f9);
  box-shadow: inset 0 0 0 1px var(--phi-hairline, rgba(16, 24, 40, 0.08));
  overflow-x: auto;
  scrollbar-width: none;
}

.layer-card-demo__tabs::-webkit-scrollbar {
  display: none;
}

.layer-card-demo__tabs-indicator {
  position: absolute;
  top: var(--active-tab-top, 0.125rem);
  left: 0;
  z-index: 1;
  width: var(--active-tab-width, 0);
  height: var(--active-tab-height, 1.375rem);
  border-radius: 0.25rem;
  background: var(--phi-base, #ffffff);
  box-shadow:
    0 0 0 1px var(--phi-line, rgba(20, 20, 20, 0.1)),
    var(--phi-shadow, 0 1px 2px rgba(16, 24, 40, 0.05));
  opacity: 1;
  pointer-events: none;
  transform: translateX(var(--active-tab-left, 0)) scale(1);
  transition:
    opacity 200ms cubic-bezier(0.4, 0, 0.2, 1),
    transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
    width 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.layer-card-demo__tabs[data-rendered="false"] .layer-card-demo__tabs-indicator {
  opacity: 0;
  transform: translateX(var(--active-tab-left, 0)) scale(0.9);
}

.layer-card-demo__tabs button {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 0.25rem;
  background: transparent;
  color: var(--phi-subtle, #6c7480);
  cursor: pointer;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem;
  margin-block: 0.125rem;
  padding: 0 0.5rem;
  transition: color 140ms ease;
  white-space: nowrap;
}

.layer-card-demo__tabs button[data-active="true"] {
  color: var(--phi-default, #17191f);
}

.layer-card-demo__tabs button:hover {
  color: var(--phi-default, #17191f);
}

@media (prefers-reduced-motion: reduce) {
  .layer-card-demo__tabs-indicator {
    transition: none;
  }
}

.layer-card-demo__table {
  margin-inline: -0.25rem;
  color: var(--phi-default, #17191f);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.layer-card-demo__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 1rem;
  padding: 0.625rem 0.25rem;
  border-bottom: 1px solid var(--phi-hairline, rgba(16, 24, 40, 0.08));
}

.layer-card-demo__row--header {
  padding-top: 0;
  padding-bottom: 0.5rem;
  border-bottom-color: var(--phi-fill, rgba(17, 24, 39, 0.1));
  color: var(--phi-subtle, #6c7480);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem;
}

.layer-card-demo__row:last-child {
  border-bottom: 0;
}

.layer-card-demo__origin {
  min-width: 0;
  overflow: hidden;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.layer-card-demo__requests {
  display: inline-flex;
  width: 7rem;
  justify-content: flex-end;
  gap: 0.375rem;
}

.layer-card-demo__duration {
  width: 5rem;
  color: var(--phi-subtle, #6c7480);
  text-align: right;
}

.layer-card-demo__footer {
  margin-inline: -0.25rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--phi-fill, rgba(17, 24, 39, 0.1));
  color: var(--phi-subtle, #6c7480);
  font-size: 0.75rem;
  line-height: 1rem;
}

@media (max-width: 520px) {
  .layer-card-demo__toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .layer-card-demo__tabs {
    width: 100%;
  }

  .layer-card-demo__tabs button {
    flex: 1;
  }
}
</style>
