export const CHART_LOADER_WIDTH = 400;
export const CHART_LOADER_SAMPLES = 80;
export const CHART_LOADER_BARS = 24;
export const CHART_LOADER_BAR_GAP_RATIO = 0.35;

export interface ChartLoaderBar {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ChartLoaderPaths {
  area: string;
  line: string;
}

/** Calm harmonic silhouette shared by line and bar loading states. */
export function chartLoaderWave(theta: number) {
  return 0.45 * Math.sin(3 * theta) + 0.3 * Math.sin(5 * theta + 0.9) + 0.25 * Math.sin(7 * theta + 2.1);
}

export function buildChartLoaderBars(height: number): ChartLoaderBar[] {
  const slot = CHART_LOADER_WIDTH / CHART_LOADER_BARS;
  const width = slot * (1 - CHART_LOADER_BAR_GAP_RATIO);
  const minHeight = height * 0.15;
  const maxHeight = height * 0.85;

  return Array.from({ length: CHART_LOADER_BARS }, (_, index) => {
    const theta = ((index + 0.5) / CHART_LOADER_BARS) * 2 * Math.PI;
    const normalizedHeight = (chartLoaderWave(theta) + 1) / 2;
    const barHeight = minHeight + normalizedHeight * (maxHeight - minHeight);

    return {
      x: index * slot + (slot - width) / 2,
      y: height - barHeight,
      width,
      height: barHeight,
    };
  });
}

export function buildChartLoaderPaths(height: number): ChartLoaderPaths {
  const midpoint = height / 2;
  const amplitude = Math.min(height * 0.18, 40);
  const line = Array.from({ length: CHART_LOADER_SAMPLES + 1 }, (_, index) => {
    const x = (index / CHART_LOADER_SAMPLES) * CHART_LOADER_WIDTH;
    const theta = (x / CHART_LOADER_WIDTH) * 2 * Math.PI;
    const y = midpoint - chartLoaderWave(theta) * amplitude;

    return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");

  return {
    line,
    area: `${line} L${CHART_LOADER_WIDTH},${height} L0,${height} Z`,
  };
}
