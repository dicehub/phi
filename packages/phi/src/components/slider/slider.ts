export const SLIDER_VARIANTS = {
  size: {
    sm: { description: "Compact slider for dense layouts" },
    base: { description: "Default slider size" },
  },
} as const;
export const SLIDER_DEFAULT_VARIANTS = { size: "base" } as const;
export type SliderSize = keyof typeof SLIDER_VARIANTS.size;
export type SliderValue = number | readonly number[];
export type SliderValueChangeDetails = { value: SliderValue };

export const toSliderValues = (value: SliderValue | undefined, min: number) =>
  typeof value === "number" ? [value] : value?.length ? [...value] : [min];

type SliderLimits = { min: number; max: number; step: number; minStepsBetweenThumbs?: number };
const decimalPlaces = (value: number) => {
  const [mantissa, exponent = "0"] = value.toString().split("e");
  return Math.max(0, (mantissa.split(".")[1]?.length ?? 0) - Number(exponent));
};
const correctIntegerRatio = (value: number) => {
  const integer = Math.round(value);
  return Math.abs(value - integer) <= Number.EPSILON * Math.max(1, Math.abs(value)) * 8 ? integer : value;
};

/** Keep Ark's neighbor arithmetic in step positions, then map to public numbers. */
export const getSliderScale = (limits: SliderLimits) => {
  const { min, max, step, minStepsBetweenThumbs: gap = 0 } = limits;
  const maxPosition = correctIntegerRatio((max - min) / step);
  if (![min, max, step, gap, maxPosition].every(Number.isFinite) || max < min || step <= 0 || gap < 0) {
    throw new Error("Slider requires finite values, ordered limits, a positive step, and a nonnegative thumb gap.");
  }
  const precision = Math.min(100, Math.max(decimalPlaces(min), decimalPlaces(step)));
  return {
    maxPosition,
    gap: Math.ceil(gap),
    toPosition: (value: number) => Math.round(correctIntegerRatio((value - min) / step)),
    toValue: (position: number) => Number((min + position * step).toFixed(precision)),
  };
};

/** Clamp the whole range and reserve each gap on the grid anchored at min. */
export const normalizeSliderValues = (value: SliderValue | undefined, limits: SliderLimits) => {
  const scale = getSliderScale(limits);
  const values = toSliderValues(value, limits.min);
  if (!values.every(Number.isFinite)) throw new Error("Slider requires finite values.");
  const upperLimit = Math.floor(scale.maxPosition);
  if (scale.gap * (values.length - 1) > upperLimit) {
    throw new Error("Slider limits cannot fit the configured thumb gap.");
  }
  let previous = 0;
  return values.map((current, index) => {
    const lower = index === 0 ? 0 : previous + scale.gap;
    const upper = upperLimit - scale.gap * (values.length - index - 1);
    const next = Math.min(upper, Math.max(lower, scale.toPosition(current)));
    previous = next;
    return scale.toValue(next);
  });
};
