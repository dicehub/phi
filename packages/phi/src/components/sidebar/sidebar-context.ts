import { computed, inject, provide, ref, type ComputedRef, type InjectionKey, type Ref } from "vue";
import type { SidebarCollapsibleMode, SidebarSide, SidebarState, SidebarVariant } from "./sidebar";
import type { createSidebarItemScroller } from "./sidebar-scroll";

export type SidebarContext = {
  state: ComputedRef<SidebarState>;
  open: ComputedRef<boolean>;
  setOpen: (open: boolean) => void;
  openMobile: Ref<boolean>;
  setOpenMobile: (open: boolean) => void;
  isMobile: Ref<boolean>;
  toggleSidebar: () => void;
  variant: ComputedRef<SidebarVariant>;
  side: ComputedRef<SidebarSide>;
  collapsible: ComputedRef<SidebarCollapsibleMode>;
  width: Ref<number>;
  resizable: ComputedRef<boolean>;
  minWidth: ComputedRef<number>;
  maxWidth: ComputedRef<number>;
  isResizing: Ref<boolean>;
  setIsResizing: (resizing: boolean) => void;
  setWidth: (width: number) => void;
  isPeeking: Ref<boolean>;
  peekable: ComputedRef<boolean>;
  startPeek: () => void;
  stopPeek: () => void;
  contained: ComputedRef<boolean>;
  animationDuration: ComputedRef<number>;
} & ReturnType<typeof createSidebarItemScroller>;

const sidebarContextKey: InjectionKey<SidebarContext> = Symbol("phi-sidebar");

export const provideSidebarContext = (context: SidebarContext) => {
  provide(sidebarContextKey, context);
};

export const useSidebarContext = () => {
  const context = inject(sidebarContextKey);

  if (!context) {
    throw new Error("useSidebar must be used within a Sidebar.Provider");
  }

  return context;
};

export type SidebarCollapseContext = {
  contentId: string;
  isOpen: Ref<boolean>;
  autoScrollOnOpen: Ref<boolean>;
  /** Reports the settled open state once this collapsible's content transition ends. */
  completeOpenChange: () => void;
  toggle: () => void;
};

const sidebarCollapseContextKey: InjectionKey<SidebarCollapseContext> = Symbol("phi-sidebar-collapse");

export const provideSidebarCollapseContext = (context: SidebarCollapseContext) => {
  provide(sidebarCollapseContextKey, context);
};

export const useSidebarCollapseContext = () =>
  inject(
    sidebarCollapseContextKey,
    {
      contentId: "",
      isOpen: ref(true),
      autoScrollOnOpen: ref(false),
      completeOpenChange: () => {},
      toggle: () => {},
    },
  );

export type SidebarSlidingViewContext = {
  activeKey: Ref<string>;
};

const sidebarSlidingViewContextKey: InjectionKey<SidebarSlidingViewContext> = Symbol("phi-sidebar-sliding-view");

export const provideSidebarSlidingViewContext = (context: SidebarSlidingViewContext) => {
  provide(sidebarSlidingViewContextKey, context);
};

export const useSidebarSlidingViewContext = () =>
  inject(
    sidebarSlidingViewContextKey,
    {
      activeKey: ref(""),
    },
  );

const sidebarMenuItemContextKey: InjectionKey<Ref<boolean>> = Symbol("phi-sidebar-menu-item");
const sidebarMenuSubItemContextKey: InjectionKey<Ref<boolean>> = Symbol("phi-sidebar-menu-sub-item");

export const provideSidebarMenuItemContext = () => {
  provide(sidebarMenuItemContextKey, ref(true));
};

export const provideSidebarMenuSubItemContext = () => {
  provide(sidebarMenuSubItemContextKey, ref(true));
};

export const useSidebarMenuItemContext = () => inject(sidebarMenuItemContextKey, ref(false));
export const useSidebarMenuSubItemContext = () => inject(sidebarMenuSubItemContextKey, ref(false));

export const useSidebar = () => {
  const context = useSidebarContext();

  return {
    ...context,
    isExpanded: computed(() => context.state.value === "expanded"),
    isCollapsed: computed(() => context.state.value === "collapsed"),
    isPeekingState: computed(() => context.state.value === "peeking"),
  };
};
