export const BREADCRUMBS_SIZES = ["sm", "base"] as const;
export const BREADCRUMBS_DEFAULT_SIZE = "base" satisfies BreadcrumbsSize;

export type BreadcrumbsSize = (typeof BREADCRUMBS_SIZES)[number];

export const isBreadcrumbsSize = (value: unknown): value is BreadcrumbsSize =>
  typeof value === "string" && BREADCRUMBS_SIZES.includes(value as BreadcrumbsSize);
