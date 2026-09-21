import type * as echarts from "echarts/core";
import type { TimeseriesMarker } from "./timeseries-markers";
import { escapeHtml } from "./tooltip-utils";
import type { TimeseriesData } from "./types";

export type TooltipRow = {
  name: string;
  value: number;
  color: string;
};

export type MarkerTooltipState = {
  timestamp: number;
  color: string;
  markers: TimeseriesMarker[];
  rows: TooltipRow[];
  hiddenCount: number;
  left: number;
  top: number;
  align: "start" | "center" | "end";
};

export function getMarkerTooltipPosition(
  chart: echarts.ECharts | null | undefined,
  timestamp: number,
): Pick<MarkerTooltipState, "align" | "left" | "top"> {
  const dom = chart?.getDom();
  const width = dom?.clientWidth ?? 0;
  const pixel = chart?.convertToPixel({ xAxisIndex: 0 }, timestamp) as number | number[] | undefined;
  const x = Array.isArray(pixel) ? pixel[0] : pixel;
  const left = clamp(Number.isFinite(x) ? Number(x) : 8, 8, Math.max(8, width - 8));
  const align = left > width - 176 ? "end" : left < 176 ? "start" : "center";

  return { left, top: 12, align };
}

export function getTimestamps(data: TimeseriesData[], markers: TimeseriesMarker[] | undefined): number[] {
  return [
    ...data.flatMap((series) => series.data.map(([timestamp]) => timestamp)),
    ...(markers?.map((marker) => marker.timestamp) ?? []),
  ];
}

export function findNearest(data: [number, number][], timestamp: number): number | null {
  if (data.length === 0) return null;

  let low = 0;
  let high = data.length - 1;
  while (low < high) {
    const middle = (low + high) >> 1;
    if (data[middle][0] < timestamp) low = middle + 1;
    else high = middle;
  }

  if (low > 0 && Math.abs(data[low - 1][0] - timestamp) < Math.abs(data[low][0] - timestamp)) low -= 1;

  return data[low][1];
}

export function getTooltipRowsAtTimestamp(
  data: TimeseriesData[],
  timestamp: number,
  selected: Record<string, boolean> | null,
  max: number,
) {
  return limitTooltipRows(getAllTooltipRowsAtTimestamp(data, timestamp, selected), max);
}

export function formatTimeseriesTooltip(
  params: unknown,
  options: {
    valueFormat?: (value: number) => string;
    timestampFormat?: (timestamp: number) => string;
    mode: "all" | "single";
    maxItems: number;
    footer?: string;
  },
): string {
  const points = (Array.isArray(params) ? params : [params]) as Array<{
    axisValue?: number;
    data?: [number, number];
    seriesName?: string;
    color?: string;
  }>;
  const timestamp = points[0]?.axisValue ?? points[0]?.data?.[0];
  const rows = points
    .filter((point) => point.seriesName && Array.isArray(point.data))
    .filter((point, index, all) => all.findIndex((item) => item.seriesName === point.seriesName) === index)
    .sort((a, b) => (b.data?.[1] ?? 0) - (a.data?.[1] ?? 0));
  const visibleRows = options.mode === "single" ? rows.slice(0, 1) : rows.slice(0, options.maxItems);
  const hiddenCount = Math.max(0, rows.length - visibleRows.length);
  const formattedTitle =
    typeof timestamp === "number"
      ? (options.timestampFormat?.(timestamp) ?? defaultTooltipTimestampFormat.format(timestamp))
      : "";
  const body = visibleRows
    .map((point) => {
      const value = point.data?.[1] ?? 0;
      const label = escapeHtml(point.seriesName ?? "");
      const formatted = escapeHtml(options.valueFormat ? options.valueFormat(value) : formatDefaultValue(value));
      const color = escapeHtml(String(point.color ?? "#4290F0"));

      return `<div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:2px 0;"><span style="display:flex;align-items:center;gap:0.5rem;min-width:0;"><span style="width:0.75rem;height:0.75rem;border-radius:999px;background:${color};flex:none;"></span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${label}</span></span><strong>${formatted}</strong></div>`;
    })
    .join("");
  const hiddenRows =
    hiddenCount > 0 ? `<div style="margin-top:0.25rem;color:var(--phi-subtle);">+${hiddenCount} more</div>` : "";
  const footer = options.footer
    ? `<div class="phi-chart-tooltip__footer" style="margin-top:0.25rem;color:var(--phi-subtle);">${escapeHtml(options.footer)}</div>`
    : "";

  return `<div style="min-width:150px;max-width:20rem;"><div style="margin-bottom:0.25rem;font-weight:600;">${escapeHtml(formattedTitle)}</div>${body}${hiddenRows}${footer}</div>`;
}

function getAllTooltipRowsAtTimestamp(
  data: TimeseriesData[],
  timestamp: number,
  selected: Record<string, boolean> | null,
): TooltipRow[] {
  const seenNames = new Set<string>();
  const rows: TooltipRow[] = [];

  for (const series of data) {
    if (seenNames.has(series.name)) continue;
    if (selected && selected[series.name] === false) continue;

    seenNames.add(series.name);
    const value = findNearest(series.data, timestamp);
    if (value !== null) rows.push({ name: series.name, value, color: series.color });
  }

  return rows.sort((a, b) => b.value - a.value);
}

function limitTooltipRows(rows: TooltipRow[], max: number): { rows: TooltipRow[]; hiddenCount: number } {
  return {
    rows: rows.slice(0, max),
    hiddenCount: Math.max(0, rows.length - max),
  };
}

function clamp(value: number, min: number, max: number) {
  if (max < min) return min;

  return Math.max(min, Math.min(max, value));
}

/**
 * Formats tooltip timestamps with the browser's locale and time zone.
 * Shared by the series tooltip and the marker tooltip so both stay in lockstep.
 */
export const defaultTooltipTimestampFormat = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const defaultNumberFormat = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 3,
});

function formatDefaultValue(value: number) {
  return Number.isInteger(value) ? String(value) : defaultNumberFormat.format(value);
}
