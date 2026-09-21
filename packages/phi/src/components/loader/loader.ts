export const LOADER_SIZES = {
  sm: 16,
  base: 24,
  lg: 32,
} as const;

export type LoaderSize = keyof typeof LOADER_SIZES;

export const LOADER_DEFAULT_SIZE: LoaderSize = "base";

export const isLoaderSize = (value: string): value is LoaderSize => value in LOADER_SIZES;

export const resolveLoaderSize = (size: LoaderSize | number = LOADER_DEFAULT_SIZE) => {
  if (typeof size === "number") return Number.isFinite(size) && size > 0 ? size : LOADER_SIZES[LOADER_DEFAULT_SIZE];
  return isLoaderSize(size) ? LOADER_SIZES[size] : LOADER_SIZES[LOADER_DEFAULT_SIZE];
};
