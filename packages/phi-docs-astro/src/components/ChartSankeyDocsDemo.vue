<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { ChartPalette, SankeyChart } from "@dicehub/phi/components/chart";
import * as echarts from "echarts/core";
import { SankeyChart as EChartsSankeyChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { SankeyLinkData, SankeyNodeData, SankeyTooltipParams } from "@dicehub/phi/components/chart";

type DemoVariant = "basic" | "drill-down" | "full-width" | "inline-label" | "interactive" | "multi-level" | "rich-tooltip";

const props = withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "basic",
  },
);

echarts.use([CanvasRenderer, EChartsSankeyChart, TooltipComponent]);

const selectedSource = ref<string | null>(null);
const selectedTarget = ref<string | null>(null);
const selectedItem = ref("");
const isDarkMode = ref(false);
let observer: MutationObserver | undefined;

onMounted(() => {
  const syncMode = () => {
    isDarkMode.value = document.documentElement.dataset.mode === "dark";
  };

  syncMode();
  observer = new MutationObserver(syncMode);
  observer.observe(document.documentElement, { attributeFilter: ["data-mode"] });
});

onBeforeUnmount(() => {
  observer?.disconnect();
});

const basicNodes = computed<SankeyNodeData[]>(() => [
  { name: "Users", value: 103600, color: ChartPalette.categorical(0, isDarkMode.value) },
  { name: "Networks", value: 84100, color: ChartPalette.categorical(1, isDarkMode.value) },
  { name: "Devices", value: 50800, color: ChartPalette.categorical(2, isDarkMode.value) },
  { name: "Other", value: 2000, color: ChartPalette.categorical(3, isDarkMode.value) },
  { name: "Apps", value: 122600, color: ChartPalette.categorical(4, isDarkMode.value) },
  { name: "Tunnels", value: 87800, color: ChartPalette.categorical(5, isDarkMode.value) },
  { name: "BYOIP", value: 29500, color: ChartPalette.categorical(6, isDarkMode.value) },
  { name: "Other Target", value: 600, color: ChartPalette.categorical(7, isDarkMode.value) },
]);

const basicLinks: SankeyLinkData[] = [
  { source: 0, target: 4, value: 80000 },
  { source: 0, target: 5, value: 20000 },
  { source: 0, target: 6, value: 3600 },
  { source: 1, target: 4, value: 30000 },
  { source: 1, target: 5, value: 50000 },
  { source: 1, target: 6, value: 4100 },
  { source: 2, target: 4, value: 10000 },
  { source: 2, target: 5, value: 15000 },
  { source: 2, target: 6, value: 20000 },
  { source: 2, target: 7, value: 5800 },
  { source: 3, target: 5, value: 1400 },
  { source: 3, target: 7, value: 600 },
];

const multiLevelNodes = computed<SankeyNodeData[]>(() => [
  { name: "Input 1", color: ChartPalette.categorical(0, isDarkMode.value) },
  { name: "Input 2", color: ChartPalette.categorical(1, isDarkMode.value) },
  { name: "Process A", color: ChartPalette.categorical(2, isDarkMode.value) },
  { name: "Process B", color: ChartPalette.categorical(3, isDarkMode.value) },
  { name: "Output X", color: ChartPalette.categorical(4, isDarkMode.value) },
  { name: "Output Y", color: ChartPalette.categorical(5, isDarkMode.value) },
]);

const multiLevelLinks: SankeyLinkData[] = [
  { source: 0, target: 2, value: 40 },
  { source: 0, target: 3, value: 20 },
  { source: 1, target: 2, value: 30 },
  { source: 1, target: 3, value: 35 },
  { source: 2, target: 4, value: 50 },
  { source: 2, target: 5, value: 20 },
  { source: 3, target: 4, value: 25 },
  { source: 3, target: 5, value: 30 },
];

const tooltipNodes = computed<SankeyNodeData[]>(() => [
  {
    name: "Apps",
    value: 122600,
    color: ChartPalette.categorical(0, isDarkMode.value),
    tooltipData: { Apps: 166, Sessions: 122600 },
  },
  {
    name: "Tunnels",
    value: 31800,
    color: ChartPalette.categorical(1, isDarkMode.value),
    tooltipData: { Tunnels: 42, Sessions: 31800 },
  },
  {
    name: "Users",
    value: 103600,
    color: ChartPalette.categorical(2, isDarkMode.value),
    tooltipData: { Users: 1250, Sessions: 103600 },
  },
  {
    name: "Devices",
    value: 50800,
    color: ChartPalette.categorical(3, isDarkMode.value),
    tooltipData: { Devices: 890, Sessions: 50800 },
  },
]);

const tooltipLinks: SankeyLinkData[] = [
  { source: 2, target: 0, value: 80000 },
  { source: 2, target: 1, value: 23600 },
  { source: 3, target: 0, value: 42600 },
  { source: 3, target: 1, value: 8200 },
];

const inlineNodes: SankeyNodeData[] = [
  { name: "Workloads", value: 109870 },
  { name: "Users", value: 45 },
  { name: "API Management", value: 42 },
  { name: "Device Enrollment", value: 38 },
  { name: "Service Token", value: 109870 },
  { name: "Self-hosted", value: 109826 },
  { name: "Tunnels", value: 87 },
  { name: "Mesh", value: 87 },
];

const inlineLinks: SankeyLinkData[] = [
  { source: 0, target: 4, value: 80000 },
  { source: 0, target: 5, value: 29870 },
  { source: 1, target: 5, value: 45 },
  { source: 2, target: 6, value: 42 },
  { source: 3, target: 7, value: 38 },
];

const sourceNames = ["Users", "Networks", "Devices"];
const targetNames = ["Apps", "Tunnels", "BYOIP"];
const drillNodes = computed<SankeyNodeData[]>(() => basicNodes.value.filter((node) => node.name !== "Other" && node.name !== "Other Target"));
const drillLinks: SankeyLinkData[] = [
  { source: 0, target: 3, value: 80000 },
  { source: 0, target: 4, value: 20000 },
  { source: 0, target: 5, value: 3600 },
  { source: 1, target: 3, value: 30000 },
  { source: 1, target: 4, value: 50000 },
  { source: 1, target: 5, value: 4100 },
  { source: 2, target: 3, value: 12600 },
  { source: 2, target: 4, value: 17800 },
  { source: 2, target: 5, value: 20400 },
];

const filteredDrill = computed(() => {
  if (!selectedSource.value && !selectedTarget.value) return { nodes: drillNodes.value, links: drillLinks };

  let relevantLinks = drillLinks;
  if (selectedSource.value) {
    const sourceIndex = drillNodes.value.findIndex((node) => node.name === selectedSource.value);
    relevantLinks = relevantLinks.filter((link) => link.source === sourceIndex);
  }
  if (selectedTarget.value) {
    const targetIndex = drillNodes.value.findIndex((node) => node.name === selectedTarget.value);
    relevantLinks = relevantLinks.filter((link) => link.target === targetIndex);
  }

  const involved = new Set<number>();
  const valueByName = new Map<string, number>();
  for (const link of relevantLinks) {
    involved.add(link.source);
    involved.add(link.target);
    for (const index of [link.source, link.target]) {
      const name = drillNodes.value[index]?.name;
      if (name) valueByName.set(name, (valueByName.get(name) ?? 0) + link.value);
    }
  }

  const nodes = drillNodes.value
    .filter((_, index) => involved.has(index))
    .map((node) => ({ ...node, value: valueByName.get(node.name) ?? node.value }));
  const nodeIndexByName = new Map(nodes.map((node, index) => [node.name, index]));
  const links = relevantLinks.map((link) => ({
    ...link,
    source: nodeIndexByName.get(drillNodes.value[link.source]?.name ?? "") ?? 0,
    target: nodeIndexByName.get(drillNodes.value[link.target]?.name ?? "") ?? 0,
  }));

  return { nodes, links };
});

const filterLabel = computed(() => {
  const parts = [selectedSource.value, selectedTarget.value].filter(Boolean);
  return parts.length ? `Showing: ${parts.join(" -> ")}` : "Click a node or link to filter";
});

function formatCompact(value: number) {
  return value >= 1000 ? `${(value / 1000).toLocaleString()}k` : value.toLocaleString();
}

function formatRichTooltip(params: SankeyTooltipParams) {
  if (params.type === "node" && params.node) {
    const rows = Object.entries(params.node.tooltipData ?? {})
      .map(
        ([key, value]) =>
          `<div style="display:flex;justify-content:space-between;gap:16px;"><span>${escapeHtml(key)}</span><strong>${escapeHtml(String(typeof value === "number" ? value.toLocaleString() : value))}</strong></div>`,
      )
      .join("");

    return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${params.color}"></span><strong>${escapeHtml(params.name)}</strong></div>${rows}`;
  }

  if (params.type === "link" && params.link) {
    return `${escapeHtml(params.link.source)} -&gt; ${escapeHtml(params.link.target)}: <strong>${params.link.value.toLocaleString()}</strong>`;
  }

  return "";
}

function handleInteractiveNode(node: SankeyNodeData) {
  selectedItem.value = `Node: ${node.name}`;
}

function handleInteractiveLink(link: SankeyLinkData) {
  const source = basicNodes.value[link.source]?.name ?? String(link.source);
  const target = basicNodes.value[link.target]?.name ?? String(link.target);
  selectedItem.value = `Link: ${source} -> ${target}`;
}

function handleDrillNode(node: SankeyNodeData) {
  if (sourceNames.includes(node.name)) {
    selectedSource.value = selectedSource.value === node.name ? null : node.name;
    return;
  }

  if (targetNames.includes(node.name)) {
    selectedTarget.value = selectedTarget.value === node.name ? null : node.name;
  }
}

function handleDrillLink(link: SankeyLinkData) {
  selectedSource.value = drillNodes.value[link.source]?.name ?? null;
  selectedTarget.value = drillNodes.value[link.target]?.name ?? null;
}

function resetDrill() {
  selectedSource.value = null;
  selectedTarget.value = null;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
</script>

<template>
  <div class="chart-sankey-demo" :data-variant="props.variant">
    <SankeyChart
      v-if="variant === 'basic'"
      :echarts="echarts"
      :format-value="formatCompact"
      :is-dark-mode="isDarkMode"
      :links="basicLinks"
      :nodes="basicNodes"
      :height="350"
    />

    <SankeyChart
      v-else-if="variant === 'multi-level'"
      :echarts="echarts"
      :height="350"
      :is-dark-mode="isDarkMode"
      :links="multiLevelLinks"
      :nodes="multiLevelNodes"
      :node-padding="15"
      :node-width="20"
    />

    <SankeyChart
      v-else-if="variant === 'full-width'"
      :echarts="echarts"
      :format-value="formatCompact"
      :height="350"
      :is-dark-mode="isDarkMode"
      :left="0"
      :links="basicLinks"
      :nodes="basicNodes"
      :right="0"
    />

    <SankeyChart
      v-else-if="variant === 'rich-tooltip'"
      :echarts="echarts"
      :height="300"
      :is-dark-mode="isDarkMode"
      :links="tooltipLinks"
      :nodes="tooltipNodes"
      :tooltip-formatter="formatRichTooltip"
    />

    <div v-else-if="variant === 'interactive'" class="chart-sankey-demo__stack">
      <p class="chart-sankey-demo__status">{{ selectedItem || "Click a node or link" }}</p>
      <SankeyChart
        :echarts="echarts"
        :format-value="formatCompact"
        :height="350"
        :is-dark-mode="isDarkMode"
        :links="basicLinks"
        :nodes="basicNodes"
        @link-click="handleInteractiveLink"
        @node-click="handleInteractiveNode"
      />
    </div>

    <div v-else-if="variant === 'drill-down'" class="chart-sankey-demo__stack">
      <div class="chart-sankey-demo__toolbar">
        <span>{{ filterLabel }}</span>
        <button v-if="selectedSource || selectedTarget" type="button" @click="resetDrill">Reset</button>
      </div>
      <SankeyChart
        :echarts="echarts"
        :format-value="formatCompact"
        :height="300"
        :is-dark-mode="isDarkMode"
        :links="filteredDrill.links"
        :nodes="filteredDrill.nodes"
        @link-click="handleDrillLink"
        @node-click="handleDrillNode"
      />
    </div>

    <SankeyChart
      v-else
      :echarts="echarts"
      :height="300"
      :is-dark-mode="isDarkMode"
      :links="inlineLinks"
      :nodes="inlineNodes"
      node-label-layout="inline"
    />
  </div>
</template>

<style scoped>
.chart-sankey-demo {
  width: 100%;
  min-width: 0;
}

.chart-sankey-demo__stack {
  display: grid;
  gap: 0.75rem;
}

.chart-sankey-demo__status,
.chart-sankey-demo__toolbar {
  margin: 0;
  color: var(--docs-subtle);
  font-size: 0.8125rem;
}

.chart-sankey-demo__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.chart-sankey-demo__toolbar button {
  border: 0;
  background: transparent;
  color: var(--docs-link);
  cursor: pointer;
  font: inherit;
  font-weight: 600;
  padding: 0;
}
</style>
