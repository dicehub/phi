import type { Component } from "vue";

export type MenuBarOptionValue = number | string;
export type MenuBarActiveValue = MenuBarOptionValue | undefined;

export type MenuBarSelectDetails = {
  option: MenuOptionProps;
  index: number;
  value: MenuBarOptionValue;
};

export type MenuOptionProps = {
  disabled?: boolean;
  icon: Component;
  iconProps?: Record<string, unknown>;
  id?: number | string;
  onClick?: (details: MenuBarSelectDetails) => void;
  tooltip: string;
};

export type MenuBarOption = MenuOptionProps;

export function resolveMenuBarOptionValue(
  option: MenuOptionProps,
  index: number,
  optionIds = false,
): MenuBarOptionValue {
  return optionIds && option.id !== undefined ? option.id : index;
}
