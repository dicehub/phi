export const DROPDOWN_MENU_ITEM_VARIANTS = ["default", "danger"] as const;

export type DropdownMenuItemVariant = (typeof DROPDOWN_MENU_ITEM_VARIANTS)[number];

export const DROPDOWN_MENU_DEFAULT_ITEM_VARIANT = "default" satisfies DropdownMenuItemVariant;

export function isDropdownMenuItemVariant(value: unknown): value is DropdownMenuItemVariant {
  return typeof value === "string" && DROPDOWN_MENU_ITEM_VARIANTS.includes(value as DropdownMenuItemVariant);
}

export function resolveDropdownMenuItemVariant(value?: DropdownMenuItemVariant): DropdownMenuItemVariant {
  return isDropdownMenuItemVariant(value) ? value : DROPDOWN_MENU_DEFAULT_ITEM_VARIANT;
}
