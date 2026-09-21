import type { InjectionKey, Ref } from "vue";

export const GRID_VARIANTS = {
  "2up": {
    description: "Grid items stack on small screens, display side-by-side on medium screens and up",
  },
  "side-by-side": {
    description: "Grid items always displayed side-by-side",
  },
  "2-1": {
    description: "Two-thirds / one-third split (66%/33%) on medium screens and up",
  },
  "1-2": {
    description: "One-third / two-thirds split (33%/66%) on medium screens and up",
  },
  "1-3up": {
    description: "Grid items stack on small screens, expand to 3 across on large screens",
  },
  "3up": {
    description: "Grid items stack on small screens, 2 across on medium, 3 across on large",
  },
  "4up": {
    description: "Grid items stack on small screens, progressively increase columns at larger breakpoints",
  },
  "6up": {
    description: "Grid items start at 2 across, expand to 6 across on XL",
  },
  "1-2-4up": {
    description: "Grid items stack on small screens, 2 across on medium, 4 across on large",
  },
} as const;

export const GRID_GAPS = {
  none: {
    description: "No gap between grid items",
  },
  sm: {
    description: "Small gap between grid items",
  },
  base: {
    description: "Default responsive gap between grid items",
  },
  lg: {
    description: "Large gap between grid items",
  },
} as const;

export const GRID_DEFAULT_GAP = "base" satisfies GridGap;

export type GridVariant = keyof typeof GRID_VARIANTS;
export type GridGap = keyof typeof GRID_GAPS;

export interface GridContextValue {
  gap: Ref<GridGap>;
  mobileDivider: Ref<boolean | undefined>;
  variant: Ref<GridVariant | undefined>;
}

export const GRID_CONTEXT: InjectionKey<GridContextValue> = Symbol("phi-grid");

export const isGridVariant = (value: unknown): value is GridVariant =>
  typeof value === "string" && value in GRID_VARIANTS;

export const isGridGap = (value: unknown): value is GridGap =>
  typeof value === "string" && value in GRID_GAPS;
