export const EMPTY_SIZES = ["sm", "base", "lg"] as const;
export const EMPTY_DEFAULT_SIZE = "base" satisfies EmptySize;

export type EmptySize = (typeof EMPTY_SIZES)[number];

export const isEmptySize = (value: unknown): value is EmptySize =>
  typeof value === "string" && (EMPTY_SIZES as readonly string[]).includes(value);

export const resolveEmptySize = (value: unknown): EmptySize =>
  isEmptySize(value) ? value : EMPTY_DEFAULT_SIZE;

export interface EmptyLabels {
  copyCommand?: string;
  copiedCommand?: string;
}
