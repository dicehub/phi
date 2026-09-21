import DropdownMenuRoot from "./DropdownMenu.vue";
import DropdownMenuCheckboxItem from "./DropdownMenuCheckboxItem.vue";
import DropdownMenuContent from "./DropdownMenuContent.vue";
import DropdownMenuGroup from "./DropdownMenuGroup.vue";
import DropdownMenuItem from "./DropdownMenuItem.vue";
import DropdownMenuLabel from "./DropdownMenuLabel.vue";
import DropdownMenuLinkItem from "./DropdownMenuLinkItem.vue";
import DropdownMenuRadioGroup from "./DropdownMenuRadioGroup.vue";
import DropdownMenuRadioItem from "./DropdownMenuRadioItem.vue";
import DropdownMenuRadioItemIndicator from "./DropdownMenuRadioItemIndicator.vue";
import DropdownMenuSeparator from "./DropdownMenuSeparator.vue";
import DropdownMenuShortcut from "./DropdownMenuShortcut.vue";
import DropdownMenuSub from "./DropdownMenuSub.vue";
import DropdownMenuSubContent from "./DropdownMenuSubContent.vue";
import DropdownMenuSubTrigger from "./DropdownMenuSubTrigger.vue";
import DropdownMenuTrigger from "./DropdownMenuTrigger.vue";

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Root: DropdownMenuRoot,
  CheckboxItem: DropdownMenuCheckboxItem,
  Content: DropdownMenuContent,
  Group: DropdownMenuGroup,
  Item: DropdownMenuItem,
  Label: DropdownMenuLabel,
  LinkItem: DropdownMenuLinkItem,
  RadioGroup: DropdownMenuRadioGroup,
  RadioItem: DropdownMenuRadioItem,
  RadioItemIndicator: DropdownMenuRadioItemIndicator,
  Separator: DropdownMenuSeparator,
  Shortcut: DropdownMenuShortcut,
  Sub: DropdownMenuSub,
  SubContent: DropdownMenuSubContent,
  SubTrigger: DropdownMenuSubTrigger,
  Trigger: DropdownMenuTrigger,
});

export {
  DropdownMenuRoot,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRadioItemIndicator,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};

export {
  DROPDOWN_MENU_DEFAULT_ITEM_VARIANT,
  DROPDOWN_MENU_ITEM_VARIANTS,
  isDropdownMenuItemVariant,
  resolveDropdownMenuItemVariant,
  type DropdownMenuItemVariant,
} from "./dropdown";

export type {
  MenuCheckboxItemProps as DropdownMenuCheckboxItemProps,
  MenuContentProps as DropdownMenuContentProps,
  MenuItemGroupLabelProps as DropdownMenuLabelProps,
  MenuItemGroupProps as DropdownMenuGroupProps,
  MenuItemProps as DropdownMenuItemProps,
  MenuRadioItemGroupProps as DropdownMenuRadioGroupProps,
  MenuRadioItemProps as DropdownMenuRadioItemProps,
  MenuRootProps as DropdownMenuRootProps,
  MenuSeparatorProps as DropdownMenuSeparatorProps,
  MenuTriggerItemProps as DropdownMenuSubTriggerProps,
  MenuTriggerProps as DropdownMenuTriggerProps,
} from "@ark-ui/vue/menu";
