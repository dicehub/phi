export const TABS_VARIANTS = ["segmented", "underline"] as const;
export const TABS_SIZES = ["base", "sm"] as const;

export type TabsVariant = (typeof TABS_VARIANTS)[number];
export type TabsSize = (typeof TABS_SIZES)[number];

export type PhiTabsVariantsProps = {
  variant?: TabsVariant;
  size?: TabsSize;
};

export type TabsItem = {
  value: string;
  label: string;
  className?: string;
  as?: string | object;
  href?: string;
  target?: string;
  rel?: string;
};

export type TabsValueChangeDetails = {
  value: string;
};

export type TabsLabels = {
  scrollStart?: string;
  scrollEnd?: string;
};

export const TABS_DEFAULT_LABELS: Required<TabsLabels> = {
  scrollStart: "Scroll tabs left",
  scrollEnd: "Scroll tabs right",
};

export const TABS_DEFAULT_VARIANTS = {
  variant: "segmented",
  size: "base",
} as const;

export const PHI_TABS_DEFAULT_VARIANTS = TABS_DEFAULT_VARIANTS;

export const PHI_TABS_VARIANTS = {
  variant: {
    segmented: { classes: "phi-tabs--segmented", description: "Segmented tabs with a moving surface indicator" },
    underline: { classes: "phi-tabs--underline", description: "Underline tabs with a bottom border indicator" },
  },
  size: {
    base: { classes: "phi-tabs--base", description: "Default tabs size" },
    sm: { classes: "phi-tabs--sm", description: "Compact tabs size" },
  },
} as const;

let tabsId = 0;

export const createTabsId = () => {
  tabsId += 1;
  return `phi-tabs-${tabsId}`;
};

export const isTabsVariant = (value: unknown): value is TabsVariant =>
  typeof value === "string" && TABS_VARIANTS.includes(value as TabsVariant);

export const isTabsSize = (value: unknown): value is TabsSize =>
  typeof value === "string" && TABS_SIZES.includes(value as TabsSize);

export const resolveTabsVariant = (value: unknown): TabsVariant =>
  isTabsVariant(value) ? value : TABS_DEFAULT_VARIANTS.variant;

export const resolveTabsSize = (value: unknown): TabsSize =>
  isTabsSize(value) ? value : TABS_DEFAULT_VARIANTS.size;

export function tabsVariants({ variant = TABS_DEFAULT_VARIANTS.variant, size = TABS_DEFAULT_VARIANTS.size }: PhiTabsVariantsProps = {}) {
  const resolvedVariant = resolveTabsVariant(variant);
  const resolvedSize = resolveTabsSize(size);

  return `phi-tabs phi-tabs--${resolvedVariant} phi-tabs--${resolvedSize}`;
}
