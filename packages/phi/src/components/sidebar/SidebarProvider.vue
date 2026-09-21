<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  SIDEBAR_ANIMATION_DURATION_MS,
  SIDEBAR_DEFAULT_VARIANTS,
  SIDEBAR_EASING,
  SIDEBAR_MOBILE_BREAKPOINT,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
  type SidebarCollapsibleMode,
  type SidebarSide,
  type SidebarState,
  type SidebarVariant,
} from "./sidebar";
import { provideSidebarContext } from "./sidebar-context";
import { createOpenChangeCompleteTracker } from "./open-change-complete";
import { createSidebarItemScroller } from "./sidebar-scroll";

const props = withDefaults(
  defineProps<{
    animationDuration?: number;
    class?: unknown;
    collapsible?: SidebarCollapsibleMode;
    contained?: boolean;
    defaultOpen?: boolean;
    defaultWidth?: number;
    maxWidth?: number;
    minWidth?: number;
    mobileBreakpoint?: number;
    modelValue?: boolean;
    open?: boolean;
    peekable?: boolean;
    resizable?: boolean;
    side?: SidebarSide;
    variant?: SidebarVariant;
  }>(),
  {
    animationDuration: SIDEBAR_ANIMATION_DURATION_MS,
    collapsible: SIDEBAR_DEFAULT_VARIANTS.collapsible,
    contained: false,
    defaultOpen: true,
    defaultWidth: 256,
    maxWidth: 480,
    minWidth: 200,
    mobileBreakpoint: SIDEBAR_MOBILE_BREAKPOINT,
    peekable: false,
    resizable: false,
    side: SIDEBAR_DEFAULT_VARIANTS.side,
    variant: SIDEBAR_DEFAULT_VARIANTS.variant,
  },
);

const emit = defineEmits<{
  openChange: [open: boolean];
  openChangeComplete: [open: boolean];
  "update:modelValue": [open: boolean];
  "update:open": [open: boolean];
  widthChange: [width: number];
}>();

const instance = getCurrentInstance();
const internalOpen = ref(props.defaultOpen);
const openMobile = ref(false);
const isMobile = ref(false);
const width = ref(props.defaultWidth);
const isResizing = ref(false);
const isPeeking = ref(false);
let mediaQuery: MediaQueryList | undefined;

const isPropProvided = (name: string) => {
  const vnodeProps = instance?.vnode.props ?? {};
  return Object.prototype.hasOwnProperty.call(vnodeProps, name);
};
const isOpenControlled = computed(() => isPropProvided("open"));
const isModelValueControlled = computed(() => isPropProvided("modelValue") || isPropProvided("model-value"));
const open = computed(() => {
  if (isOpenControlled.value) return props.open === true;
  if (isModelValueControlled.value) return props.modelValue === true;
  return internalOpen.value;
});
const state = computed<SidebarState>(() => {
  if (isPeeking.value) return "peeking";
  return open.value ? "expanded" : "collapsed";
});
const sidebarWidth = computed(() => (props.resizable ? `${width.value}px` : SIDEBAR_WIDTH));

const setOpen = (nextOpen: boolean) => {
  internalOpen.value = nextOpen;
  emit("update:open", nextOpen);
  emit("update:modelValue", nextOpen);
  emit("openChange", nextOpen);
};

const setOpenMobile = (nextOpen: boolean) => {
  openMobile.value = nextOpen;
  if (isMobile.value && (isOpenControlled.value || isModelValueControlled.value)) {
    setOpen(nextOpen);
  }
};

const setWidth = (nextWidth: number) => {
  const clamped = Math.min(props.maxWidth, Math.max(props.minWidth, nextWidth));
  width.value = clamped;
  emit("widthChange", clamped);
};

const toggleSidebar = () => {
  if (isMobile.value) {
    setOpenMobile(!openMobile.value);
    return;
  }

  isPeeking.value = false;
  setOpen(!open.value);
};

const startPeek = () => {
  if (props.peekable && !open.value && !isMobile.value) {
    isPeeking.value = true;
  }
};

const stopPeek = () => {
  isPeeking.value = false;
};

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const desktopCompletion = createOpenChangeCompleteTracker({
  duration: () => props.animationDuration,
  onComplete: (nextOpen) => emit("openChangeComplete", nextOpen),
  prefersReducedMotion,
});

const mobileCompletion = createOpenChangeCompleteTracker({
  duration: () => props.animationDuration,
  onComplete: (nextOpen) => emit("openChangeComplete", nextOpen),
  prefersReducedMotion,
});

const updateMobile = () => {
  const nextMobile = mediaQuery?.matches ?? false;
  if (nextMobile === isMobile.value) return;

  (nextMobile ? desktopCompletion : mobileCompletion).cancel();
  isMobile.value = nextMobile;
};

// Each tracker owns one layout: the desktop sidebar animates `width`, the mobile sidebar `transform`.
// A change while the other layout is active, or a breakpoint switch on its own, never completes.
watch(
  () => [open.value, isMobile.value] as const,
  ([nextOpen, nextMobile], [previousOpen, previousMobile]) => {
    if (previousMobile || nextMobile || nextOpen === previousOpen) return;
    desktopCompletion.start(nextOpen);
  },
);

watch(
  () => [openMobile.value, isMobile.value] as const,
  ([nextOpen, nextMobile], [previousOpen, previousMobile]) => {
    if (!previousMobile || !nextMobile || nextOpen === previousOpen) return;
    mobileCompletion.start(nextOpen);
  },
);

const handleOpenTransitionEnd = (event: TransitionEvent) => {
  const target = event.target as HTMLElement | null;
  if (!target || target.closest("[data-sidebar-wrapper]") !== event.currentTarget) return;
  if (target.dataset.sidebar !== "sidebar") return;
  if (event.propertyName !== (isMobile.value ? "transform" : "width")) return;

  (isMobile.value ? mobileCompletion : desktopCompletion).complete();
};

onMounted(() => {
  mediaQuery = window.matchMedia(`(max-width: ${props.mobileBreakpoint - 1}px)`);
  mediaQuery.addEventListener("change", updateMobile);
  updateMobile();
});

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener("change", updateMobile);
  desktopCompletion.cancel();
  mobileCompletion.cancel();
});

provideSidebarContext({
  ...createSidebarItemScroller(),
  state,
  open,
  setOpen,
  openMobile,
  setOpenMobile,
  isMobile,
  toggleSidebar,
  variant: computed(() => props.variant),
  side: computed(() => props.side),
  collapsible: computed(() => props.collapsible),
  width,
  resizable: computed(() => props.resizable),
  minWidth: computed(() => props.minWidth),
  maxWidth: computed(() => props.maxWidth),
  isResizing,
  setIsResizing: (nextResizing) => {
    isResizing.value = nextResizing;
  },
  setWidth,
  isPeeking,
  peekable: computed(() => props.peekable),
  startPeek,
  stopPeek,
  contained: computed(() => props.contained),
  animationDuration: computed(() => props.animationDuration),
});
</script>

<template>
  <div
    data-sidebar-wrapper
    :data-state="state"
    :data-side="props.side"
    @transitionend="handleOpenTransitionEnd"
    :class="[
      'phi-sidebar-provider',
      {
        'phi-sidebar-provider--contained': props.contained,
        'phi-sidebar-provider--full-height': !props.contained && !isMobile,
        'phi-sidebar-provider--resizing': isResizing,
        'phi-sidebar-provider--inset': props.variant === 'inset',
      },
      props.class,
    ]"
    :style="{
      '--sidebar-width': sidebarWidth,
      '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
      '--sidebar-animation-duration': `${props.animationDuration}ms`,
      '--sidebar-easing': SIDEBAR_EASING,
    }"
  >
    <slot />
  </div>
</template>

<style src="./sidebar.css"></style>
