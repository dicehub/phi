import TabsRoot from "./Tabs.vue";

export const Tabs = Object.assign(TabsRoot, {
  Root: TabsRoot,
});

export { TabsRoot };
export {
  PHI_TABS_DEFAULT_VARIANTS,
  PHI_TABS_VARIANTS,
  TABS_DEFAULT_VARIANTS,
  TABS_SIZES,
  TABS_VARIANTS,
  isTabsSize,
  isTabsVariant,
  resolveTabsSize,
  resolveTabsVariant,
  tabsVariants,
  type PhiTabsVariantsProps,
  type TabsItem,
  type TabsLabels,
  type TabsSize,
  type TabsValueChangeDetails,
  type TabsVariant,
} from "./tabs";
