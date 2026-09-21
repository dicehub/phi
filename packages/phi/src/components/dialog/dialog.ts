export const DIALOG_SIZES = ["sm", "base", "lg", "xl"] as const;
export const DIALOG_ROLES = ["dialog", "alertdialog"] as const;

export type DialogSize = (typeof DIALOG_SIZES)[number];
export type DialogRole = (typeof DIALOG_ROLES)[number];

export const DIALOG_DEFAULT_SIZE: DialogSize = "base";
export const DIALOG_DEFAULT_ROLE: DialogRole = "dialog";

export function isDialogSize(value: unknown): value is DialogSize {
  return typeof value === "string" && DIALOG_SIZES.includes(value as DialogSize);
}

export function resolveDialogSize(value?: DialogSize): DialogSize {
  return isDialogSize(value) ? value : DIALOG_DEFAULT_SIZE;
}
