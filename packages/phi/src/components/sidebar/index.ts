import SidebarRoot from "./SidebarRoot.vue";
import SidebarProvider from "./SidebarProvider.vue";
import SidebarHeader from "./SidebarHeader.vue";
import SidebarContent from "./SidebarContent.vue";
import SidebarFooter from "./SidebarFooter.vue";
import SidebarLoading from "./SidebarLoading.vue";
import SidebarGroup from "./SidebarGroup.vue";
import SidebarGroupLabel from "./SidebarGroupLabel.vue";
import SidebarMenu from "./SidebarMenu.vue";
import SidebarMenuItem from "./SidebarMenuItem.vue";
import SidebarMenuButton from "./SidebarMenuButton.vue";
import SidebarMenuBadge from "./SidebarMenuBadge.vue";
import SidebarMenuSub from "./SidebarMenuSub.vue";
import SidebarMenuSubItem from "./SidebarMenuSubItem.vue";
import SidebarMenuSubButton from "./SidebarMenuSubButton.vue";
import SidebarSeparator from "./SidebarSeparator.vue";
import SidebarTrigger from "./SidebarTrigger.vue";
import SidebarClose from "./SidebarClose.vue";
import SidebarRail from "./SidebarRail.vue";
import SidebarResizeHandle from "./SidebarResizeHandle.vue";
import SidebarCollapsibleRoot from "./SidebarCollapsible.vue";
import SidebarCollapsibleTrigger from "./SidebarCollapsibleTrigger";
import SidebarCollapsibleContent from "./SidebarCollapsibleContent.vue";
import SidebarMenuChevron from "./SidebarMenuChevron.vue";
import SidebarSlidingViews from "./SidebarSlidingViews.vue";
import SidebarSlidingView from "./SidebarSlidingView.vue";

export const Sidebar = Object.assign(SidebarRoot, {
  Provider: SidebarProvider,
  Root: SidebarRoot,
  Header: SidebarHeader,
  Content: SidebarContent,
  Footer: SidebarFooter,
  Loading: SidebarLoading,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  Menu: SidebarMenu,
  MenuItem: SidebarMenuItem,
  MenuButton: SidebarMenuButton,
  MenuBadge: SidebarMenuBadge,
  MenuSub: SidebarMenuSub,
  MenuSubItem: SidebarMenuSubItem,
  MenuSubButton: SidebarMenuSubButton,
  Separator: SidebarSeparator,
  Trigger: SidebarTrigger,
  Close: SidebarClose,
  Rail: SidebarRail,
  ResizeHandle: SidebarResizeHandle,
  Collapsible: SidebarCollapsibleRoot,
  CollapsibleTrigger: SidebarCollapsibleTrigger,
  CollapsibleContent: SidebarCollapsibleContent,
  MenuChevron: SidebarMenuChevron,
  SlidingViews: SidebarSlidingViews,
  SlidingView: SidebarSlidingView,
});

export {
  SidebarRoot,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarLoading,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
  SidebarTrigger,
  SidebarClose,
  SidebarRail,
  SidebarResizeHandle,
  SidebarCollapsibleRoot as SidebarCollapsible,
  SidebarCollapsibleTrigger,
  SidebarCollapsibleContent,
  SidebarMenuChevron,
  SidebarSlidingViews,
  SidebarSlidingView,
};

export { useSidebar } from "./sidebar-context";
export type { SidebarScrollAlign, SidebarScrollToItemOptions } from "./sidebar-scroll";
export type { SidebarContext as SidebarContextValue } from "./sidebar-context";
export {
  PHI_SIDEBAR_DEFAULT_VARIANTS,
  PHI_SIDEBAR_STYLING,
  PHI_SIDEBAR_VARIANTS,
  SIDEBAR_DEFAULT_VARIANTS,
  SIDEBAR_STYLING,
  SIDEBAR_VARIANTS,
  createSidebarId,
  type SidebarCollapsibleMode as SidebarCollapsibleType,
  type SidebarCollapsibleMode,
  type SidebarMenuButtonSize,
  type SidebarSide,
  type SidebarState,
  type SidebarVariant,
} from "./sidebar";

export type SidebarProviderProps = InstanceType<typeof SidebarProvider>["$props"];
export type SidebarRootProps = InstanceType<typeof SidebarRoot>["$props"];
export type SidebarCloseProps = InstanceType<typeof SidebarClose>["$props"];
export type SidebarLoadingProps = InstanceType<typeof SidebarLoading>["$props"];
export type SidebarMenuButtonProps = InstanceType<typeof SidebarMenuButton>["$props"];
export type SidebarMenuSubButtonProps = InstanceType<typeof SidebarMenuSubButton>["$props"];
export type SidebarCollapsibleProps = InstanceType<typeof SidebarCollapsibleRoot>["$props"];
export type SidebarCollapsibleTriggerProps = InstanceType<typeof SidebarCollapsibleTrigger>["$props"];
export type SidebarSlidingViewsProps = InstanceType<typeof SidebarSlidingViews>["$props"];
export type SidebarSlidingViewProps = InstanceType<typeof SidebarSlidingView>["$props"];
