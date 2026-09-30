<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, ref, watch } from "vue";
import { createSidebarId } from "./sidebar";
import { isCollapsibleContentShown, provideSidebarCollapseContext, useSidebarContext } from "./sidebar-context";
import { createOpenChangeCompleteTracker } from "./open-change-complete";

const props = withDefaults(
  defineProps<{
    autoScrollOnOpen?: boolean;
    defaultOpen?: boolean;
    open?: boolean;
  }>(),
  {
    autoScrollOnOpen: false,
    defaultOpen: false,
  },
);

const emit = defineEmits<{
  openChange: [open: boolean];
  openChangeComplete: [open: boolean];
  "update:open": [open: boolean];
}>();

const instance = getCurrentInstance();
const internalOpen = ref(props.defaultOpen);
const isOpenControlled = computed(() => {
  const vnodeProps = instance?.vnode.props ?? {};
  return Object.prototype.hasOwnProperty.call(vnodeProps, "open");
});
const isOpen = computed({
  get: () => (isOpenControlled.value ? props.open === true : internalOpen.value),
  set: (nextOpen) => {
    internalOpen.value = nextOpen;
    emit("update:open", nextOpen);
    emit("openChange", nextOpen);
  },
});
const contentId = createSidebarId();
const sidebar = useSidebarContext();
const isContentShown = computed(() => isCollapsibleContentShown(isOpen.value, sidebar));
const completion = createOpenChangeCompleteTracker({
  duration: () => sidebar.animationDuration.value,
  onComplete: (nextOpen) => emit("openChangeComplete", nextOpen),
  prefersReducedMotion: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
});

watch(
  isContentShown,
  (nextOpen, previousOpen) => {
    if (nextOpen === previousOpen) return;
    completion.start(nextOpen);
  },
  { flush: "post" },
);

onBeforeUnmount(() => {
  completion.cancel();
});

provideSidebarCollapseContext({
  contentId,
  isOpen,
  autoScrollOnOpen: computed(() => props.autoScrollOnOpen),
  completeOpenChange: () => {
    completion.complete();
  },
  toggle: () => {
    isOpen.value = !isOpen.value;
  },
});
</script>

<template>
  <div class="phi-sidebar-collapsible" :data-open="isOpen ? true : undefined">
    <slot />
  </div>
</template>
