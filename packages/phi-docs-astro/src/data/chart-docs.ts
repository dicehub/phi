import type { MapGeoJson, SankeyLinkData, SankeyNodeData } from "@dicehub/phi/components/chart";

export const chartInstallCode = `pnpm add echarts`;

export const chartRegisterCode = `import * as echarts from "echarts/core";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import {
  AriaComponent,
  AxisPointerComponent,
  BrushComponent,
  GridComponent,
  MarkLineComponent,
  ToolboxComponent,
  TooltipComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  AriaComponent,
  AxisPointerComponent,
  BrushComponent,
  GridComponent,
  MarkLineComponent,
  ToolboxComponent,
  TooltipComponent,
  CanvasRenderer,
]);`;

export const chartBarrelCode = `import { Chart, TimeseriesChart, BubbleMap, ChoroplethMap, ChartLegend, ChartPalette } from "@dicehub/phi";`;

export const chartGranularCode = `import { Chart, TimeseriesChart, BubbleMap, ChoroplethMap, ChartLegend, ChartPalette } from "@dicehub/phi/components/chart";`;

export const timeseriesUsageCode = `<script setup lang="ts">
import { ChartPalette, TimeseriesChart } from "@dicehub/phi/components/chart";
import * as echarts from "echarts/core";

const data = [
  {
    name: "Requests",
    data: [[Date.now(), 42]],
    color: ChartPalette.categorical(0),
  },
];
</script>

<template>
  <TimeseriesChart
    :echarts="echarts"
    :data="data"
    y-axis-name="Requests"
  />
</template>`;

export const customChartUsageCode = `<script setup lang="ts">
import { Chart, type PhiChartOption } from "@dicehub/phi/components/chart";
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([CanvasRenderer, PieChart, TooltipComponent]);

const options: PhiChartOption = {
  animation: true,
  animationDuration: 2000,
  tooltip: { show: true },
  series: [
    {
      type: "pie",
      data: [
        { value: 101, name: "Series A" },
        { value: 202, name: "Series B" },
        { value: 303, name: "Series C" },
        { value: 404, name: "Series D" },
        { value: 505, name: "Series E" },
      ],
    },
  ],
};
</script>

<template>
  <Chart :echarts="echarts" :options="options" :height="400" />
</template>`;

export const mapUsageCode = `<script setup lang="ts">
import { BubbleMap, type MapGeoJson } from "@dicehub/phi/components/chart";
import * as echarts from "echarts/core";
import { MapChart, ScatterChart } from "echarts/charts";
import { GeoComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([CanvasRenderer, GeoComponent, MapChart, ScatterChart, TooltipComponent]);

const geoJson = world as MapGeoJson;

const colos = [
  { city: "San Francisco", lat: 37.77, lon: -122.42, requests: 1200 },
  { city: "London", lat: 51.5, lon: -0.12, requests: 1500 },
];
</script>

<template>
  <BubbleMap
    :echarts="echarts"
    :geo-json="geoJson"
    :data="colos"
    lng="lon"
    lat="lat"
    name="city"
    value="requests"
  />
</template>`;

export const choroplethMapUsageCode = `<script setup lang="ts">
import { ChoroplethMap, type MapGeoJson } from "@dicehub/phi/components/chart";
import * as echarts from "echarts/core";
import { MapChart } from "echarts/charts";
import { TooltipComponent, VisualMapComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([CanvasRenderer, MapChart, TooltipComponent, VisualMapComponent]);

const geoJson = world as MapGeoJson;

const countries = [
  { country: "United States of America", requests: 4200 },
  { country: "Germany", requests: 3100 },
  { country: "Japan", requests: 2500 },
];
</script>

<template>
  <ChoroplethMap
    :echarts="echarts"
    :geo-json="geoJson"
    :data="countries"
    name="country"
    value="requests"
  />
</template>`;

export const sankeyUsageCode = `<script setup lang="ts">
import { ChartPalette, SankeyChart } from "@dicehub/phi/components/chart";
import * as echarts from "echarts/core";
import { SankeyChart as EChartsSankeyChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([CanvasRenderer, EChartsSankeyChart, TooltipComponent]);

const nodes = [
  { name: "Users", value: 103600, color: ChartPalette.categorical(0) },
  { name: "Devices", value: 50800, color: ChartPalette.categorical(1) },
  { name: "Apps", value: 122600, color: ChartPalette.categorical(2) },
  { name: "Tunnels", value: 31800, color: ChartPalette.categorical(3) },
];

const links = [
  { source: 0, target: 2, value: 80000 },
  { source: 0, target: 3, value: 23600 },
  { source: 1, target: 2, value: 42600 },
  { source: 1, target: 3, value: 8200 },
];
</script>

<template>
  <SankeyChart
    :echarts="echarts"
    :nodes="nodes"
    :links="links"
    :height="350"
  />
</template>`;

export const chartProps = [
  { name: "echarts", type: "typeof echarts", defaultValue: "-", description: "ECharts core instance with the required modules registered." },
  { name: "options", type: "PhiChartOption", defaultValue: "-", description: "ECharts option object passed through to setOption." },
  { name: "optionUpdateBehavior", type: "SetOptionOpts", defaultValue: "-", description: "Additional options passed to chart.setOption." },
  { name: "className", type: "string", defaultValue: "-", description: "Optional class passed to the chart element." },
  { name: "aspectRatio", type: "number | string", defaultValue: "-", description: "Responsive container ratio used when height is not set." },
  { name: "height", type: "number", defaultValue: "350", description: "Chart container height in pixels." },
  { name: "isDarkMode", type: "boolean", defaultValue: "false", description: "Initializes ECharts with dark mode and dark chart colors." },
  { name: "onEvents", type: "Partial<ChartEvents>", defaultValue: "-", description: "Event handlers registered on the ECharts instance." },
];

export const timeseriesProps = [
  { name: "echarts", type: "typeof echarts", defaultValue: "-", description: "ECharts core instance with the required modules registered." },
  { name: "data", type: "TimeseriesData[]", defaultValue: "-", description: "Series as [timestamp_ms, value] tuples." },
  { name: "type", type: "\"line\" | \"bar\"", defaultValue: "\"line\"", description: "Renders line series or stacked bar series." },
  { name: "markers", type: "TimeseriesMarker[]", defaultValue: "-", description: "Vertical reference markers rendered at specific timestamps." },
  { name: "thresholds", type: "TimeseriesThreshold[]", defaultValue: "-", description: "Horizontal threshold lines rendered on the value axis." },
  { name: "xAxisName", type: "string", defaultValue: "-", description: "Label for the time axis." },
  { name: "xAxisTickCount", type: "number", defaultValue: "5", description: "Approximate number of x-axis ticks." },
  { name: "xAxisTickFormat", type: "(value: number) => string", defaultValue: "-", description: "Formats x-axis timestamp labels." },
  { name: "yAxisName", type: "string", defaultValue: "-", description: "Label for the value axis." },
  { name: "yAxisTickCount", type: "number", defaultValue: "-", description: "Approximate number of y-axis ticks." },
  { name: "yAxisMinInterval", type: "number", defaultValue: "-", description: "Minimum interval between y-axis ticks. Use 1 for discrete count data." },
  { name: "yAxisTickFormat", type: "(value: number) => string", defaultValue: "-", description: "Formats y-axis value labels." },
  { name: "yAxisTickLabelFormat", type: "(value: number) => string", defaultValue: "-", description: "Deprecated alias for tooltip value formatting." },
  { name: "tooltipValueFormat", type: "(value: number) => string", defaultValue: "-", description: "Formats values in the tooltip." },
  { name: "tooltipTimestampFormat", type: "(timestamp: number) => string", defaultValue: "-", description: "Formats tooltip timestamps in standard and marker tooltips. Receives the raw timestamp in milliseconds. Defaults to the browser locale and time zone." },
  { name: "tooltipFooter", type: "string", defaultValue: "-", description: "Footer text rendered below the values in standard and marker tooltips. An empty string adds no space." },
  { name: "tooltipFollowCursor", type: "\"both\" | \"x\"", defaultValue: "\"both\"", description: "Controls whether the tooltip follows both axes or locks vertically." },
  { name: "tooltipBoundary", type: "\"clipping-ancestors\" | Element | Element[]", defaultValue: "\"clipping-ancestors\"", description: "Constrains tooltip placement." },
  { name: "tooltipMode", type: "\"all\" | \"single\"", defaultValue: "\"all\"", description: "Controls how many series are shown in the tooltip." },
  { name: "tooltipMaxItems", type: "number", defaultValue: "10", description: "Maximum tooltip rows when tooltipMode is all." },
  { name: "gradient", type: "boolean", defaultValue: "false", description: "Adds a fading area fill beneath line series." },
  { name: "incomplete", type: "{ before?: number; after?: number }", defaultValue: "-", description: "Renders incomplete edge ranges as dashed lines." },
  { name: "enableLegendSelection", type: "boolean", defaultValue: "false", description: "Adds a hidden legend so custom legend items can drive series visibility." },
  { name: "loading", type: "boolean", defaultValue: "false", description: "Shows a mode-aware skeleton matching the line or bar chart type." },
  { name: "onTimeRangeChange", type: "(from: number, to: number) => void", defaultValue: "-", description: "Called when the user drags to select a time range." },
  { name: "height", type: "number", defaultValue: "350", description: "Chart height in pixels." },
  { name: "isDarkMode", type: "boolean", defaultValue: "false", description: "Initializes ECharts with dark mode and dark chart colors." },
  { name: "ariaDescription", type: "string", defaultValue: "-", description: "Accessible chart description passed to ECharts aria labels." },
  { name: "optionUpdateBehavior", type: "SetOptionOpts", defaultValue: "-", description: "Additional options passed to chart.setOption. Time-range brushing remains active after notMerge replacements." },
];

export const mapProps = [
  { name: "echarts", type: "typeof echarts", defaultValue: "-", description: "ECharts core instance with map, scatter, geo, tooltip, and renderer modules registered." },
  { name: "geoJson", type: "MapGeoJson", defaultValue: "-", description: "GeoJSON feature collection used as the map base." },
  { name: "mapName", type: "string", defaultValue: "-", description: "Optional stable ECharts map registry name." },
  { name: "data", type: "T[]", defaultValue: "-", description: "Rows rendered as proportional bubbles." },
  { name: "lng", type: "MapAccessor<T, number>", defaultValue: "-", description: "Longitude accessor." },
  { name: "lat", type: "MapAccessor<T, number>", defaultValue: "-", description: "Latitude accessor." },
  { name: "value", type: "MapAccessor<T, number>", defaultValue: "-", description: "Numeric accessor used for bubble size." },
  { name: "name", type: "MapAccessor<T, string>", defaultValue: "-", description: "Optional label accessor used by the default tooltip." },
  { name: "minRadius", type: "number", defaultValue: "6", description: "Smallest bubble radius in pixels." },
  { name: "maxRadius", type: "number", defaultValue: "26", description: "Largest bubble radius in pixels." },
  { name: "bubbleSize", type: "(value: number) => number", defaultValue: "-", description: "Explicit bubble radius function. Overrides minRadius and maxRadius scaling." },
  { name: "bubbleColor", type: "MapStyle<T, string>", defaultValue: "palette bubble", description: "Bubble fill color as a constant or row function." },
  { name: "bubbleBorderColor", type: "MapStyle<T, string>", defaultValue: "\"transparent\"", description: "Bubble border color as a constant or row function." },
  { name: "bubbleBorderWidth", type: "MapStyle<T, number>", defaultValue: "0", description: "Bubble border width as a constant or row function." },
  { name: "center", type: "[number, number]", defaultValue: "-", description: "Map center as longitude and latitude." },
  { name: "zoom", type: "number", defaultValue: "1.25", description: "Zoom level applied to the auto-fit scale." },
  { name: "roam", type: "boolean", defaultValue: "false", description: "Enables drag-to-pan and scroll-to-zoom." },
  { name: "projection", type: "MapProjection | null", defaultValue: "Mercator", description: "Geographic projection. Pass null for raw longitude/latitude plotting." },
  { name: "showTooltip", type: "boolean", defaultValue: "true", description: "Controls map tooltip visibility." },
  { name: "valueFormat", type: "(value: number) => string", defaultValue: "toLocaleString()", description: "Formats values in the default tooltip." },
  { name: "tooltipFormatter", type: "(row: T) => string", defaultValue: "-", description: "Optional trusted HTML tooltip formatter." },
  { name: "onBubbleHover", type: "(row: T | undefined) => void", defaultValue: "-", description: "Called as the pointer enters or leaves a bubble." },
  { name: "onBubbleClick", type: "(row: T) => void", defaultValue: "-", description: "Called when a bubble is clicked." },
  { name: "aspectRatio", type: "number | string", defaultValue: "projected map ratio", description: "Responsive container ratio. Ignored when height is set." },
  { name: "height", type: "number", defaultValue: "-", description: "Fixed chart height in pixels. Overrides aspectRatio." },
  { name: "className", type: "string", defaultValue: "-", description: "Optional class passed to the chart element." },
  { name: "isDarkMode", type: "boolean", defaultValue: "false", description: "Initializes ECharts with dark mode and dark map colors." },
];

export const choroplethMapProps = [
  { name: "echarts", type: "typeof echarts", defaultValue: "-", description: "ECharts core instance with map, visual map, tooltip, and renderer modules registered." },
  { name: "geoJson", type: "MapGeoJson", defaultValue: "-", description: "GeoJSON feature collection whose regions are shaded by value." },
  { name: "mapName", type: "string", defaultValue: "-", description: "Optional stable ECharts map registry name." },
  { name: "data", type: "T[]", defaultValue: "-", description: "Rows joined to GeoJSON regions." },
  { name: "name", type: "MapAccessor<T, string>", defaultValue: "-", description: "Region-key accessor matched against the configured GeoJSON name property." },
  { name: "value", type: "MapAccessor<T, number>", defaultValue: "-", description: "Numeric accessor used for the region color scale." },
  { name: "nameProperty", type: "string", defaultValue: "\"name\"", description: "GeoJSON feature property used for region joins." },
  { name: "colorRange", type: "string[]", defaultValue: "sequential blues", description: "Continuous color ramp from low to high values." },
  { name: "min", type: "number", defaultValue: "data min", description: "Lower bound of the continuous color scale." },
  { name: "max", type: "number", defaultValue: "data max", description: "Upper bound of the continuous color scale." },
  { name: "noDataColor", type: "string", defaultValue: "map area color", description: "Fill color for regions without matching data." },
  { name: "showLegend", type: "boolean", defaultValue: "false", description: "Shows the continuous visual map legend." },
  { name: "showTooltip", type: "boolean", defaultValue: "true", description: "Controls region tooltip visibility." },
  { name: "valueFormat", type: "(value: number) => string", defaultValue: "toLocaleString()", description: "Formats values in the default tooltip." },
  { name: "tooltipFormatter", type: "(row: T) => string", defaultValue: "-", description: "Optional trusted HTML tooltip formatter." },
  { name: "onRegionHover", type: "(row: T | undefined) => void", defaultValue: "-", description: "Called as the pointer enters or leaves a matched region." },
  { name: "onRegionClick", type: "(row: T) => void", defaultValue: "-", description: "Called when a matched region is clicked." },
  { name: "center", type: "[number, number]", defaultValue: "-", description: "Map center as longitude and latitude." },
  { name: "zoom", type: "number", defaultValue: "1.25", description: "Zoom level applied to the map layout." },
  { name: "roam", type: "boolean", defaultValue: "false", description: "Enables drag-to-pan and scroll-to-zoom." },
  { name: "projection", type: "MapProjection | null", defaultValue: "Mercator", description: "Geographic projection. Pass null for raw longitude/latitude plotting." },
  { name: "aspectRatio", type: "number | string", defaultValue: "projected map ratio", description: "Responsive container ratio. Ignored when height is set." },
  { name: "height", type: "number", defaultValue: "-", description: "Fixed chart height in pixels. Overrides aspectRatio." },
  { name: "className", type: "string", defaultValue: "-", description: "Optional class passed to the chart element." },
  { name: "isDarkMode", type: "boolean", defaultValue: "false", description: "Initializes ECharts with dark mode and dark map colors." },
];

export const sankeyProps = [
  { name: "echarts", type: "typeof echarts", defaultValue: "-", description: "ECharts core instance with Sankey, tooltip, and renderer modules registered." },
  { name: "nodes", type: "SankeyNodeData[]", defaultValue: "-", description: "Nodes in the Sankey diagram." },
  { name: "links", type: "SankeyLinkData[]", defaultValue: "-", description: "Links connecting node indexes." },
  { name: "height", type: "number", defaultValue: "400", description: "Chart height in pixels." },
  { name: "showNodeValues", type: "boolean", defaultValue: "auto", description: "Shows node values when any node has a value." },
  { name: "nodeLabelLayout", type: "\"stacked\" | \"inline\"", defaultValue: "\"stacked\"", description: "Controls whether node values stack above labels or render inline." },
  { name: "formatValue", type: "(value: number) => string", defaultValue: "toLocaleString()", description: "Formats node and link values." },
  { name: "tooltipFormatter", type: "(params: SankeyTooltipParams) => string", defaultValue: "-", description: "Optional trusted HTML tooltip formatter." },
  { name: "nodeWidth", type: "number", defaultValue: "8", description: "Width of each Sankey node." },
  { name: "nodePadding", type: "number", defaultValue: "10", description: "Vertical gap between nodes." },
  { name: "showTooltip", type: "boolean", defaultValue: "true", description: "Controls tooltip visibility." },
  { name: "defaultNodeColor", type: "string", defaultValue: "-", description: "Fallback color for nodes without explicit colors." },
  { name: "left", type: "number | string", defaultValue: "-", description: "Left padding of the Sankey layout." },
  { name: "right", type: "number | string", defaultValue: "-", description: "Right padding of the Sankey layout." },
  { name: "linkColor", type: "\"gradient\" | \"gray\"", defaultValue: "\"gradient\"", description: "Controls whether links blend from source color or use flat gray." },
  { name: "linkOpacity", type: "number", defaultValue: "0.5", description: "Opacity for gradient links." },
  { name: "className", type: "string", defaultValue: "-", description: "Optional class passed to the chart element." },
  { name: "isDarkMode", type: "boolean", defaultValue: "false", description: "Initializes ECharts with dark mode and dark chart colors." },
  { name: "onNodeClick", type: "(node: SankeyNodeData) => void", defaultValue: "-", description: "Called when a node is clicked." },
  { name: "onLinkClick", type: "(link: SankeyLinkData) => void", defaultValue: "-", description: "Called when a link is clicked." },
];

export const sankeyNodes: SankeyNodeData[] = [
  { name: "Users", value: 103600, color: "#4290F0" },
  { name: "Devices", value: 50800, color: "#F5B647" },
  { name: "Apps", value: 122600, color: "#E8649D" },
  { name: "Tunnels", value: 31800, color: "#8D58EE" },
];

export const sankeyLinks: SankeyLinkData[] = [
  { source: 0, target: 2, value: 80000 },
  { source: 0, target: 3, value: 23600 },
  { source: 1, target: 2, value: 42600 },
  { source: 1, target: 3, value: 8200 },
];

export const simpleWorldGeoJson: MapGeoJson = {
  type: "FeatureCollection",
  features: [
    polygonFeature("North America", [[-168, 12], [-52, 12], [-52, 72], [-168, 72], [-168, 12]]),
    polygonFeature("South America", [[-82, -56], [-34, -56], [-34, 12], [-82, 12], [-82, -56]]),
    polygonFeature("Europe", [[-12, 35], [42, 35], [42, 72], [-12, 72], [-12, 35]]),
    polygonFeature("Africa", [[-18, -35], [52, -35], [52, 35], [-18, 35], [-18, -35]]),
    polygonFeature("Asia", [[42, 5], [150, 5], [150, 72], [42, 72], [42, 5]]),
    polygonFeature("Oceania", [[110, -45], [178, -45], [178, -8], [110, -8], [110, -45]]),
  ],
};

function polygonFeature(name: string, coordinates: number[][]) {
  return {
    type: "Feature" as const,
    properties: { name },
    geometry: {
      type: "Polygon",
      coordinates: [coordinates],
    },
  };
}
