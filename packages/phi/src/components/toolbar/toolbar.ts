export const TOOLBAR_SIZES = ["xs", "sm", "base", "lg"] as const;
export const TOOLBAR_DEFAULT_SIZE = "base" satisfies ToolbarSize;

export const TOOLBAR_VARIANTS = {
  size: {
    xs: {
      classes: "phi-toolbar--xs",
      description: "Extra small toolbar for compact UIs",
    },
    sm: {
      classes: "phi-toolbar--sm",
      description: "Small toolbar for secondary controls",
    },
    base: {
      classes: "phi-toolbar--base",
      description: "Default toolbar size",
    },
    lg: {
      classes: "phi-toolbar--lg",
      description: "Large toolbar for prominent controls",
    },
  },
} as const;

export const PHI_TOOLBAR_VARIANTS = TOOLBAR_VARIANTS;

export type ToolbarSize = (typeof TOOLBAR_SIZES)[number];

export const isToolbarSize = (value: unknown): value is ToolbarSize =>
  typeof value === "string" && TOOLBAR_SIZES.includes(value as ToolbarSize);

export const resolveToolbarSize = (value?: ToolbarSize) =>
  isToolbarSize(value) ? value : TOOLBAR_DEFAULT_SIZE;
