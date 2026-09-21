import {
  TEXT_COPY_VARIANTS,
  TEXT_MONOSPACE_VARIANTS,
  type TextCopyVariant,
  type TextMonospaceVariant,
  type TextSize,
} from "../text/text";

export const INLINE_COPY_TEXT_VARIANTS = [...TEXT_COPY_VARIANTS, ...TEXT_MONOSPACE_VARIANTS] as const;
export const INLINE_COPY_TEXT_ELEMENTS = ["span", "code", "em", "strong", "small", "abbr", "time"] as const;

export type InlineCopyTextVariant = TextCopyVariant | TextMonospaceVariant;
export type InlineCopyTextElement = (typeof INLINE_COPY_TEXT_ELEMENTS)[number];

export const INLINE_COPY_TEXT_DEFAULT_VARIANT: InlineCopyTextVariant = "mono-secondary";

export const INLINE_COPY_TEXT_DEFAULT_LABELS = {
  copied: "Copied",
  copyAction: "Copy to clipboard",
} as const;

/** How long the copied state stays visible before it resets. */
export const INLINE_COPY_TEXT_FEEDBACK_MS = 1500;

export type InlineCopyTextLabels = {
  /** Accessible name before the text is copied. */
  copyAction?: string;
  /** Accessible name and live-region message after copying. */
  copied?: string;
};

type InlineCopyTextSharedProps = {
  /** Text content to display. Its value is copied unless `textToCopy` is provided. */
  text: string;
  /** Value to copy. Defaults to `text`. */
  textToCopy?: string;
  labels?: InlineCopyTextLabels;
  /** Truncates with an ellipsis instead of wrapping. Defaults to true. */
  truncate?: boolean;
  /** Semantic element used for the displayed text inside the button. */
  as?: InlineCopyTextElement;
};

/** Keeps the Text component's valid size and bold combinations. */
export type InlineCopyTextProps = InlineCopyTextSharedProps &
  (
    | {
        variant: TextCopyVariant;
        size?: TextSize;
        bold?: boolean;
      }
    | {
        variant?: TextMonospaceVariant;
        size?: "lg";
        bold?: never;
      }
  );

export const isInlineCopyTextVariant = (value: unknown): value is InlineCopyTextVariant =>
  typeof value === "string" && (INLINE_COPY_TEXT_VARIANTS as readonly string[]).includes(value);

export const resolveInlineCopyTextVariant = (value: unknown): InlineCopyTextVariant =>
  isInlineCopyTextVariant(value) ? value : INLINE_COPY_TEXT_DEFAULT_VARIANT;
