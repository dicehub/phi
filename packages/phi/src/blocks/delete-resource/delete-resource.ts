export const DELETE_RESOURCE_VARIANTS = {
  size: {
    sm: {
      classes: "",
      description: "Small dialog for simple delete confirmations",
    },
    base: {
      classes: "",
      description: "Default delete confirmation dialog size",
    },
  },
} as const;

export const DELETE_RESOURCE_DEFAULT_VARIANTS = {
  size: "base",
} as const;

export type DeleteResourceSize = keyof typeof DELETE_RESOURCE_VARIANTS.size;

export interface DeleteResourceVariantsProps {
  size?: DeleteResourceSize;
}

export interface DeleteResourceOpenChangeDetails {
  open: boolean;
}

export function normalizeDeleteResourceConfirmation(value: string, caseSensitive = true) {
  return caseSensitive ? value : value.toLowerCase();
}

export function isDeleteResourceConfirmed(input: string, resourceName: string, caseSensitive = true) {
  return (
    normalizeDeleteResourceConfirmation(input, caseSensitive) ===
    normalizeDeleteResourceConfirmation(resourceName, caseSensitive)
  );
}
