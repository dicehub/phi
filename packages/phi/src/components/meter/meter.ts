export const METER_DEFAULT_MIN = 0;
export const METER_DEFAULT_MAX = 100;

export function clampMeterValue(value: number, min = METER_DEFAULT_MIN, max = METER_DEFAULT_MAX) {
  return Math.min(Math.max(value, min), max);
}

export function getMeterPercentage(value: number, min = METER_DEFAULT_MIN, max = METER_DEFAULT_MAX) {
  if (max <= min) return 0;

  return ((clampMeterValue(value, min, max) - min) / (max - min)) * 100;
}

export function formatMeterValue(value: number, min = METER_DEFAULT_MIN, max = METER_DEFAULT_MAX) {
  return `${Math.round(getMeterPercentage(value, min, max))}%`;
}
