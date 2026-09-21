export const TEXT_HEADING_VARIANTS = ["heading", "heading1", "heading2", "heading3"] as const;
export const TEXT_DEPRECATED_HEADING_VARIANTS = ["heading1", "heading2", "heading3"] as const;
export const TEXT_COPY_VARIANTS = ["body", "secondary", "success", "error"] as const;
export const TEXT_MONOSPACE_VARIANTS = ["mono", "mono-secondary"] as const;
export const TEXT_VARIANTS = [...TEXT_HEADING_VARIANTS, ...TEXT_COPY_VARIANTS, ...TEXT_MONOSPACE_VARIANTS] as const;
export const TEXT_SIZES = ["xs", "sm", "base", "lg"] as const;
export const TEXT_ELEMENTS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span",
  "label",
  "dt",
  "dd",
  "li",
  "figcaption",
  "legend",
  "pre",
  "code",
  "em",
  "strong",
  "small",
  "abbr",
  "time",
] as const;

export type TextHeadingVariant = (typeof TEXT_HEADING_VARIANTS)[number];
export type TextDeprecatedHeadingVariant = (typeof TEXT_DEPRECATED_HEADING_VARIANTS)[number];
export type TextCopyVariant = (typeof TEXT_COPY_VARIANTS)[number];
export type TextMonospaceVariant = (typeof TEXT_MONOSPACE_VARIANTS)[number];
export type TextVariant = (typeof TEXT_VARIANTS)[number];
export type TextSize = (typeof TEXT_SIZES)[number];
export type TextElement = (typeof TEXT_ELEMENTS)[number];

export type TextProps =
  | {
      variant?: TextCopyVariant;
      size?: TextSize;
      bold?: boolean;
      truncate?: boolean;
      as?: TextElement;
    }
  | {
      variant: TextMonospaceVariant;
      size?: "lg";
      bold?: never;
      truncate?: boolean;
      as?: TextElement;
    }
  | {
      variant: "heading";
      size?: "lg";
      bold?: never;
      truncate?: boolean;
      as?: TextElement;
    }
  | {
      variant: TextDeprecatedHeadingVariant;
      size?: never;
      bold?: never;
      truncate?: boolean;
      as: TextElement;
    };

export type PhiTextVariantsProps = {
  variant?: TextVariant;
  size?: TextSize;
};

export const TEXT_DEFAULT_VARIANTS = {
  variant: "body",
  size: "base",
} as const;

export const PHI_TEXT_DEFAULT_VARIANTS = TEXT_DEFAULT_VARIANTS;

export const PHI_TEXT_VARIANTS = {
  variant: {
    heading: {
      classes: "phi-text--heading",
      description: "Heading text (16px by default, 20px at large size)",
    },
    /** @deprecated Use `heading` and set `size` and `as` explicitly. */
    heading1: {
      classes: "phi-text--heading1",
      description: "Deprecated large heading for page titles; use heading instead",
    },
    /** @deprecated Use `heading` and set `size` and `as` explicitly. */
    heading2: {
      classes: "phi-text--heading2",
      description: "Deprecated medium heading for section titles; use heading instead",
    },
    /** @deprecated Use `heading` and set `size` and `as` explicitly. */
    heading3: {
      classes: "phi-text--heading3",
      description: "Deprecated small heading for subsections; use heading instead",
    },
    body: {
      classes: "phi-text--body",
      description: "Default body text",
    },
    secondary: {
      classes: "phi-text--secondary",
      description: "Muted text for secondary information",
    },
    success: {
      classes: "phi-text--success",
      description: "Success state text",
    },
    error: {
      classes: "phi-text--error",
      description: "Error state text",
    },
    mono: {
      classes: "phi-text--mono",
      description: "Monospace text for code",
    },
    "mono-secondary": {
      classes: "phi-text--mono-secondary",
      description: "Muted monospace text",
    },
  },
  size: {
    xs: {
      classes: "phi-text--size-xs",
      description: "Extra small text",
    },
    sm: {
      classes: "phi-text--size-sm",
      description: "Small text",
    },
    base: {
      classes: "phi-text--size-base",
      description: "Default text size",
    },
    lg: {
      classes: "phi-text--size-lg",
      description: "Large text",
    },
  },
} as const;

export const PHI_TEXT_STYLING = {
  fontSizes: {
    xs: 12,
    sm: 13,
    base: 14,
    lg: 16,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
  },
  baseColor: "phi-text--body",
  variantColors: {
    body: "phi-text--body",
    secondary: "phi-text--secondary",
    success: "phi-text--success",
    error: "phi-text--error",
    mono: "phi-text--mono",
    "mono-secondary": "phi-text--mono-secondary",
  },
  fontFamilies: {
    default: "sans-serif",
    mono: "monospace",
  },
} as const;

export const isTextVariant = (value: unknown): value is TextVariant =>
  typeof value === "string" && TEXT_VARIANTS.includes(value as TextVariant);

export const isTextSize = (value: unknown): value is TextSize =>
  typeof value === "string" && TEXT_SIZES.includes(value as TextSize);

export const isTextElement = (value: unknown): value is TextElement =>
  typeof value === "string" && TEXT_ELEMENTS.includes(value as TextElement);

export const isCopyTextVariant = (value: unknown): value is TextCopyVariant =>
  typeof value === "string" && TEXT_COPY_VARIANTS.includes(value as TextCopyVariant);

export const isMonospaceTextVariant = (value: unknown): value is TextMonospaceVariant =>
  typeof value === "string" && TEXT_MONOSPACE_VARIANTS.includes(value as TextMonospaceVariant);

export const isHeadingTextVariant = (value: unknown): value is TextHeadingVariant =>
  typeof value === "string" && TEXT_HEADING_VARIANTS.includes(value as TextHeadingVariant);

export const isDeprecatedHeadingTextVariant = (value: unknown): value is TextDeprecatedHeadingVariant =>
  typeof value === "string" &&
  TEXT_DEPRECATED_HEADING_VARIANTS.includes(value as TextDeprecatedHeadingVariant);

export const resolveTextVariant = (value: unknown): TextVariant =>
  isTextVariant(value) ? value : TEXT_DEFAULT_VARIANTS.variant;

export const resolveTextSize = (value: unknown): TextSize =>
  isTextSize(value) ? value : TEXT_DEFAULT_VARIANTS.size;

export const resolveTextElement = (value: unknown, variant: TextVariant): TextElement => {
  if (isTextElement(value)) return value;
  if (isMonospaceTextVariant(variant) || isHeadingTextVariant(variant)) return "span";
  return "p";
};

export function textVariants({
  variant = TEXT_DEFAULT_VARIANTS.variant,
  size = TEXT_DEFAULT_VARIANTS.size,
}: PhiTextVariantsProps = {}) {
  const resolvedVariant = resolveTextVariant(variant);
  const resolvedSize = resolveTextSize(size);
  const resolvedVariantClass = PHI_TEXT_VARIANTS.variant[resolvedVariant].classes;
  const resolvedSizeClass = resolveTextSizeClass(resolvedVariant, resolvedSize);

  return `phi-text ${resolvedVariantClass} ${resolvedSizeClass}`;
}

function resolveTextSizeClass(variant: TextVariant, size: TextSize) {
  if (variant === "heading") return size === "lg" ? PHI_TEXT_VARIANTS.size.lg.classes : "";
  if (isHeadingTextVariant(variant)) return "";

  if (isMonospaceTextVariant(variant)) {
    return (size === "lg" ? PHI_TEXT_VARIANTS.size.base : PHI_TEXT_VARIANTS.size.sm).classes;
  }

  return PHI_TEXT_VARIANTS.size[size].classes;
}
