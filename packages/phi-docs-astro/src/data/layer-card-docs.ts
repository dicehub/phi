export const layerCardBarrelCode = `import { LayerCard } from "@dicehub/phi";`;

export const layerCardGranularCode = `import { LayerCard } from "@dicehub/phi/components/layer-card";`;

export const layerCardPreviewCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { LayerCard } from "@dicehub/phi/components/layer-card";
import { PhArrowRight } from "@phosphor-icons/vue";
</script>

<template>
  <LayerCard>
    <LayerCard.Secondary class="flex items-center justify-between">
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
</template>`;

export const layerCardUsageCode = `<script setup>
import { LayerCard } from "@dicehub/phi/components/layer-card";
</script>

<template>
  <LayerCard style="width: 250px;">
    <LayerCard.Secondary>Documentation</LayerCard.Secondary>
    <LayerCard.Primary>Learn how to use Phi components</LayerCard.Primary>
  </LayerCard>
</template>`;

export const layerCardSurfaceUsageCode = `<script setup>
import { LayerCard } from "@dicehub/phi/components/layer-card";
</script>

<template>
  <LayerCard style="width: 250px; padding: 1rem;">
    Learn how to use Phi components
  </LayerCard>
</template>`;

const basicCode = `<script setup>
import { LayerCard } from "@dicehub/phi/components/layer-card";
</script>

<template>
  <LayerCard style="width: 250px;">
    <LayerCard.Secondary>Getting Started</LayerCard.Secondary>
    <LayerCard.Primary>
      <p class="text-sm text-subtle">Quick start guide for new users</p>
    </LayerCard.Primary>
  </LayerCard>
</template>`;

const surfaceCode = `<script setup>
import { LayerCard } from "@dicehub/phi/components/layer-card";
</script>

<template>
  <LayerCard style="width: 250px; padding: 1rem;">
    <p class="text-sm text-subtle">Quick start guide for new users</p>
  </LayerCard>
</template>`;

const multipleCode = `<script setup>
import { LayerCard } from "@dicehub/phi/components/layer-card";
</script>

<template>
  <div class="flex gap-4">
    <LayerCard style="width: 200px;">
      <LayerCard.Secondary>Components</LayerCard.Secondary>
      <LayerCard.Primary>
        <p class="text-sm">Browse all components</p>
      </LayerCard.Primary>
    </LayerCard>

    <LayerCard style="width: 200px;">
      <LayerCard.Secondary>Examples</LayerCard.Secondary>
      <LayerCard.Primary>
        <p class="text-sm">View code examples</p>
      </LayerCard.Primary>
    </LayerCard>
  </div>
</template>`;

const filterCode = `<script setup>
import { computed, ref } from "vue";
import { Badge } from "@dicehub/phi/components/badge";
import { Input } from "@dicehub/phi/components/input";
import { LayerCard } from "@dicehub/phi/components/layer-card";

const origins = [
  { origin: "challenges.cloudflare.com", s2xx: 1, s4xx: 0, duration: "95.4ms" },
  { origin: "Unknown", s2xx: 19, s4xx: 7, duration: "463.7ms" },
  { origin: "api.example.com", s2xx: 42, s4xx: 3, duration: "128.1ms" },
];

const filter = ref("all");
const search = ref("");
const filteredOrigins = computed(() =>
  origins.filter((origin) => {
    if (filter.value === "2xx" && origin.s2xx === 0) return false;
    if (filter.value === "4xx" && origin.s4xx === 0) return false;
    if (["3xx", "5xx"].includes(filter.value)) return false;
    return origin.origin.toLowerCase().includes(search.value.toLowerCase());
  }),
);
</script>

<template>
  <LayerCard style="width: min(100%, 540px);">
    <LayerCard.Secondary>Subrequests</LayerCard.Secondary>
    <LayerCard.Primary>
      <div class="toolbar">
        <Input v-model="search" size="sm" placeholder="Filter origins..." />
        <button @click="filter = 'all'">All</button>
        <button @click="filter = '2xx'">2xx</button>
        <button @click="filter = '4xx'">4xx</button>
      </div>

      <div v-for="origin in filteredOrigins" :key="origin.origin">
        <span>{{ origin.origin }}</span>
        <Badge v-if="origin.s2xx > 0" variant="success">2xx {{ origin.s2xx }}</Badge>
        <Badge v-if="origin.s4xx > 0" variant="error">4xx {{ origin.s4xx }}</Badge>
        <span>{{ origin.duration }}</span>
      </div>
    </LayerCard.Primary>
  </LayerCard>
</template>`;

const testIdsCode = `<script setup>
import { LayerCard } from "@dicehub/phi/components/layer-card";
</script>

<template>
  <LayerCard style="width: 250px;">
    <LayerCard.Secondary data-testid="card-header">
      Getting Started
    </LayerCard.Secondary>
    <LayerCard.Primary data-testid="card-body">
      <p class="text-sm text-subtle">Quick start guide for new users</p>
    </LayerCard.Primary>
  </LayerCard>
</template>`;

export const layerCardExamples = [
  { id: "basic-card", title: "Basic Card", variant: "basic", code: basicCode },
  {
    id: "surface-style-card",
    title: "Surface-style Card",
    variant: "surface",
    description: "For simple card containers, render content directly inside LayerCard without LayerCard.Primary.",
    code: surfaceCode,
  },
  { id: "multiple-cards", title: "Multiple Cards", variant: "multiple", code: multipleCode },
  {
    id: "filter-toolbar-with-small-tabs",
    title: "Filter Toolbar with Small Tabs",
    variant: "filter",
    description: "Combine a small input with compact filter controls inside LayerCard for dense filter toolbars.",
    code: filterCode,
  },
  {
    id: "test-ids",
    title: "Test IDs",
    variant: "test-ids",
    description: "LayerCard.Primary and LayerCard.Secondary accept standard HTML attributes, including data-testid for testing.",
    code: testIdsCode,
  },
] as const;

export const layerCardProps = [
  {
    name: "as",
    type: "string",
    defaultValue: '"div"',
    description: "HTML element used for the rendered component.",
  },
  {
    name: "default slot",
    type: "slot",
    defaultValue: "-",
    description: "Card content. Use LayerCard.Secondary and LayerCard.Primary for the layered treatment.",
  },
  { name: "class", type: "string", defaultValue: "-", description: "-" },
  { name: "id", type: "string", defaultValue: "-", description: "-" },
  { name: "lang", type: "string", defaultValue: "-", description: "-" },
  { name: "title", type: "string", defaultValue: "-", description: "-" },
] as const;
