<script setup lang="ts">
import { computed } from "vue";
import type * as echarts from "echarts/core";
import Chart from "./Chart.vue";
import { ChartPalette } from "./Color";
import { defaultValueFormat, escapeHtml } from "./tooltip-utils";
import type { ChartEvents, PhiChartOption, SankeyLinkData, SankeyNodeData, SankeyTooltipParams } from "./types";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    echarts: typeof echarts;
    nodes: SankeyNodeData[];
    links: SankeyLinkData[];
    height?: number;
    showNodeValues?: boolean;
    nodeLabelLayout?: "stacked" | "inline";
    formatValue?: (value: number) => string;
    tooltipFormatter?: (params: SankeyTooltipParams) => string;
    nodeWidth?: number;
    nodePadding?: number;
    showTooltip?: boolean;
    defaultNodeColor?: string;
    left?: number | string;
    right?: number | string;
    linkColor?: "gradient" | "gray";
    linkOpacity?: number;
    className?: string;
    isDarkMode?: boolean;
    onNodeClick?: (node: SankeyNodeData) => void;
    onLinkClick?: (link: SankeyLinkData) => void;
  }>(),
  {
    height: 400,
    isDarkMode: false,
    linkColor: "gradient",
    linkOpacity: 0.5,
    nodeLabelLayout: "stacked",
    nodePadding: 10,
    nodeWidth: 8,
    showTooltip: true,
  },
);

const emit = defineEmits<{
  linkClick: [link: SankeyLinkData];
  nodeClick: [node: SankeyNodeData];
}>();

const resolvedFormatValue = computed(() => props.formatValue ?? defaultValueFormat);
const hasNodeValues = computed(() => props.nodes.some((node) => node.value !== undefined));
const shouldShowValues = computed(() => props.showNodeValues ?? hasNodeValues.value);
const isInlineLayout = computed(() => props.nodeLabelLayout === "inline");

const options = computed<PhiChartOption>(() => {
  const labelColor = ChartPalette.text("primary", props.isDarkMode);
  const secondaryColor = ChartPalette.text("secondary", props.isDarkMode);
  const nodeColors = props.nodes.map(
    (node, index) => node.color ?? props.defaultNodeColor ?? ChartPalette.categorical(index, props.isDarkMode),
  );
  const nodeDataMap = new Map(
    props.nodes.map((node, index) => [node.name, { ...node, computedColor: nodeColors[index] }]),
  );

  return {
    backgroundColor: "transparent",
    animation: true,
    animationDuration: 500,
    animationDurationUpdate: 300,
    animationEasingUpdate: "cubicInOut",
    tooltip: props.showTooltip
      ? {
          trigger: "item",
          triggerOn: "mousemove",
          backgroundColor: "var(--phi-base)",
          borderColor: "var(--phi-line)",
          borderWidth: 1,
          padding: 8,
          textStyle: {
            color: "var(--phi-default)",
            fontSize: 12,
          },
          extraCssText: "border-radius:0.5rem;box-shadow:0 8px 24px rgba(15,23,42,0.12);",
          dangerousHtmlFormatter(params: unknown) {
            return formatTooltip(params, nodeDataMap, secondaryColor);
          },
        }
      : undefined,
    series: [
      {
        type: "sankey",
        ...(props.left !== undefined ? { left: props.left } : {}),
        ...(props.right !== undefined ? { right: props.right } : {}),
        data: props.nodes.map((node, index) => ({
          name: node.name,
          value: node.value,
          itemStyle: { color: nodeColors[index] },
        })),
        links: props.links.map((link) => ({
          source: props.nodes[link.source]?.name ?? "",
          target: props.nodes[link.target]?.name ?? "",
          value: link.value,
        })),
        draggable: false,
        emphasis: { focus: "adjacency" },
        nodeWidth: props.nodeWidth,
        nodeGap: props.nodePadding,
        lineStyle: {
          color: props.linkColor === "gradient" ? "source" : "#d1d5db",
          opacity: props.linkColor === "gradient" ? props.linkOpacity : 0.4,
          curveness: 0.5,
        },
        label: {
          show: true,
          color: labelColor,
          fontSize: 12,
          formatter: shouldShowValues.value
            ? (params: { name?: string }) => {
                const name = params.name ?? "";
                const nodeData = nodeDataMap.get(name);
                const safeName = escapeRichText(name);

                if (nodeData?.value !== undefined) {
                  const formatted = escapeRichText(resolvedFormatValue.value(nodeData.value));

                  return isInlineLayout.value ? `{name|${safeName}} {value|${formatted}}` : `{value|${formatted}}\n{name|${safeName}}`;
                }

                return safeName;
              }
            : undefined,
          rich: shouldShowValues.value
            ? {
                value: {
                  fontSize: 11,
                  color: labelColor,
                  lineHeight: isInlineLayout.value ? undefined : 16,
                },
                name: {
                  fontSize: 12,
                  color: labelColor,
                  fontWeight: 700,
                },
              }
            : undefined,
        },
      },
    ],
  };
});

const events = computed<Partial<ChartEvents>>(() => ({
  click: (params) => {
    const isNodeClick = params.dataType === "node" || (params.name && params.dataType !== "edge");

    if (isNodeClick && params.name) {
      const nodeIndex = props.nodes.findIndex((node) => node.name === params.name);
      const originalNode = nodeIndex >= 0 ? props.nodes[nodeIndex] : undefined;
      const node = { ...originalNode, name: params.name };

      props.onNodeClick?.(node);
      emit("nodeClick", node);
      return;
    }

    if (params.dataType !== "edge" || !params.data) return;

    const data = params.data as { source?: string; target?: string };
    const sourceIndex = props.nodes.findIndex((node) => node.name === String(data.source ?? ""));
    const targetIndex = props.nodes.findIndex((node) => node.name === String(data.target ?? ""));
    if (sourceIndex === -1 || targetIndex === -1) return;

    const originalLink = props.links.find((link) => link.source === sourceIndex && link.target === targetIndex);
    const value = typeof params.value === "number" ? params.value : originalLink?.value ?? 0;
    const link = {
      ...originalLink,
      source: sourceIndex,
      target: targetIndex,
      value,
    };

    props.onLinkClick?.(link);
    emit("linkClick", link);
  },
}));

function formatTooltip(
  params: unknown,
  nodeDataMap: Map<string, SankeyNodeData & { computedColor: string }>,
  secondaryColor: string,
) {
  if (!params || typeof params !== "object") return "";

  const item = params as {
    color?: string;
    data?: { source?: string; target?: string; value?: number };
    dataType?: string;
    name?: string;
  };

  if (item.dataType === "node" && item.name) {
    const node = nodeDataMap.get(item.name);
    const color = sanitizeColor(node?.computedColor ?? item.color ?? "#666");

    if (props.tooltipFormatter) {
      return props.tooltipFormatter({ type: "node", name: item.name, node, color });
    }

    return `<div style="display:flex;align-items:center;gap:6px;"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color}"></span><strong>${escapeHtml(item.name)}</strong></div>`;
  }

  if (item.dataType === "edge" && item.data) {
    const source = item.data.source ?? "";
    const target = item.data.target ?? "";
    const value = item.data.value ?? 0;

    if (props.tooltipFormatter) {
      return props.tooltipFormatter({
        type: "link",
        name: `${source} -> ${target}`,
        link: { source, target, value },
      });
    }

    const sourceColor = sanitizeColor(nodeDataMap.get(source)?.computedColor ?? "#666");
    const targetColor = sanitizeColor(nodeDataMap.get(target)?.computedColor ?? "#666");

    return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${sourceColor}"></span><strong>${escapeHtml(source)}</strong><span style="color:${secondaryColor}">-&gt;</span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${targetColor}"></span><strong>${escapeHtml(target)}</strong></div><strong>${escapeHtml(resolvedFormatValue.value(value))}</strong>`;
  }

  return "";
}

function escapeRichText(value: string) {
  return value.replace(/[{}|]/g, (char) => `\\${char}`);
}

function sanitizeColor(color: string) {
  if (/^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color)) return color;
  if (/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(?:,\s*[\d.]+\s*)?\)$/i.test(color)) return color;
  if (/^hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(?:,\s*[\d.]+\s*)?\)$/i.test(color)) return color;
  if (/^[a-z]{3,20}$/i.test(color)) return color;

  return "#666";
}
</script>

<template>
  <Chart
    v-bind="$attrs"
    class="phi-chart-sankey"
    :class-name="className"
    :echarts="echarts"
    :height="height"
    :is-dark-mode="isDarkMode"
    :on-events="events"
    :options="options"
    data-phi-component="SankeyChart"
  />
</template>
