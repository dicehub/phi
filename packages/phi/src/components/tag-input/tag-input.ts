/** Labels for TagInput feedback and controls. Override these for localization. */
export interface TagInputLabels {
  /** Accessible name used when neither `label` nor `aria-label` is provided. */
  input?: string;
  /** Accessible name for a tag's remove button. */
  removeValue?: (value: string) => string;
  /** Validation feedback shown when `validateValue` rejects a value. */
  invalidValue?: (value: string) => string;
  /** Feedback shown when adding a tag would exceed `maxValues`. */
  maxValuesReached?: (maxValues: number) => string;
}

export type ResolvedTagInputLabels = Required<TagInputLabels>;

export const TAG_INPUT_DEFAULT_LABELS: ResolvedTagInputLabels = {
  input: "Add tag",
  invalidValue: (value) => `"${value}" is not valid.`,
  maxValuesReached: (maxValues) => `Limit of ${maxValues} tags reached.`,
  removeValue: (value) => `Remove ${value}`,
};

export const resolveTagInputLabels = (labels?: TagInputLabels): ResolvedTagInputLabels => ({
  ...TAG_INPUT_DEFAULT_LABELS,
  ...labels,
});

/** Splits pasted or typed text on commas and newlines, dropping empty entries. */
export const splitTagInputValues = (value: string): string[] =>
  value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);

type PhiTagInputGlobal = typeof globalThis & {
  __phiTagInputId?: number;
};

export const createTagInputId = () => {
  const phiGlobal = globalThis as PhiTagInputGlobal;

  phiGlobal.__phiTagInputId = (phiGlobal.__phiTagInputId ?? 0) + 1;
  return `phi-tag-input-${phiGlobal.__phiTagInputId}`;
};
