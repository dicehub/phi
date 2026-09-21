import type * as echarts from "echarts/core";
import type { EChartsOption, SetOptionOpts, TooltipComponentOption } from "echarts";

export type SafeTooltipOption = Omit<TooltipComponentOption, "formatter"> & {
  dangerousHtmlFormatter?: TooltipComponentOption["formatter"];
};

export type PhiChartOption = {
  [K in keyof EChartsOption]: K extends "tooltip"
    ? SafeTooltipOption | SafeTooltipOption[] | undefined
    : EChartsOption[K];
};

export type EChartsMouseEventParams = {
  componentType: string;
  seriesType?: string;
  seriesIndex?: number;
  seriesName?: string;
  name?: string;
  dataIndex?: number;
  data?: unknown;
  dataType?: string;
  value?: number | unknown[];
  color?: string;
};

export interface ChartEvents {
  click: (params: EChartsMouseEventParams) => void;
  dblclick: (params: EChartsMouseEventParams) => void;
  mousedown: (params: EChartsMouseEventParams) => void;
  mousemove: (params: EChartsMouseEventParams) => void;
  mouseup: (params: EChartsMouseEventParams) => void;
  mouseover: (params: EChartsMouseEventParams) => void;
  mouseout: (params: EChartsMouseEventParams) => void;
  globalout: (params: unknown) => void;
  contextmenu: (params: unknown) => void;
  legendselectchanged: (params: { name: string; selected: Record<string, boolean> }) => void;
  legendselected: (params: { name: string; selected: Record<string, boolean> }) => void;
  legendunselected: (params: { name: string; selected: Record<string, boolean> }) => void;
  legendscroll: (params: unknown) => void;
  datazoom: (params: unknown) => void;
  datarangeselected: (params: unknown) => void;
  timelinechanged: (params: unknown) => void;
  timelineplaychanged: (params: unknown) => void;
  restore: (params: unknown) => void;
  dataviewchanged: (params: unknown) => void;
  magictypechanged: (params: unknown) => void;
  pieselectchanged: (params: unknown) => void;
  pieselected: (params: unknown) => void;
  pieunselected: (params: unknown) => void;
  mapselectchanged: (params: unknown) => void;
  mapselected: (params: unknown) => void;
  mapunselected: (params: unknown) => void;
  geoselectchanged: (params: unknown) => void;
  geoselected: (params: unknown) => void;
  geounselected: (params: unknown) => void;
  axisareaselected: (params: unknown) => void;
  brush: (params: unknown) => void;
  brushselected: (params: unknown) => void;
  brushend: (params: { areas: Array<{ coordRange: unknown; brushType?: string; panelId?: string; range?: unknown }> }) => void;
  updateaxispointer: (params: unknown) => void;
}

export interface ChartProps {
  echarts: typeof echarts;
  options: PhiChartOption;
  optionUpdateBehavior?: SetOptionOpts;
  className?: string;
  isDarkMode?: boolean;
  aspectRatio?: number | string;
  height?: number;
  onEvents?: Partial<ChartEvents>;
}

export interface TimeseriesData {
  name: string;
  data: [number, number][];
  color: string;
}

export interface SankeyNodeData {
  id?: string;
  name: string;
  color?: string;
  value?: number;
  tooltipData?: Record<string, number | string>;
  isDrillable?: boolean;
  childCount?: number;
}

export interface SankeyLinkData {
  id?: string;
  source: number;
  target: number;
  value: number;
  isDrillable?: boolean;
}

export interface SankeyTooltipParams {
  type: "node" | "link";
  name: string;
  node?: SankeyNodeData & { computedColor?: string };
  link?: { source: string; target: string; value: number };
  color?: string;
}

export interface MapGeoJson {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    id?: string | number;
    properties?: Record<string, unknown> | null;
    geometry: unknown;
  }>;
}

export interface MapProjection {
  project: (point: number[]) => number[];
  unproject: (point: number[]) => number[];
}

type KeysWithValue<Row, Value> = {
  [Key in keyof Row]-?: Row[Key] extends Value ? Key : never;
}[keyof Row];

export type MapAccessor<Row, Value> = KeysWithValue<Row, Value> | ((row: Row) => Value);
export type MapStyle<Row, Value> = Value | ((row: Row) => Value);
