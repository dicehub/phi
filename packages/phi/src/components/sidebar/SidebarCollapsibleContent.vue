<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { isCollapsibleContentShown, useSidebarCollapseContext, useSidebarContext } from "./sidebar-context";
import { scrollWithinSidebarViewport } from "./sidebar-scroll";

const collapse = useSidebarCollapseContext();
const sidebar = useSidebarContext();
const content = ref<HTMLElement>();
const isVisible = computed(() => isCollapsibleContentShown(collapse.isOpen.value, sidebar));
let scrollPending = false;

// Only this element's own row transition settles the collapse; nested or parent transitions do not.
const handleTransitionEnd = (event: TransitionEvent) => {
  if (event.target !== event.currentTarget) return;
  if (event.propertyName !== "grid-template-rows") return;

  collapse.completeOpenChange();
};

watch(
  [collapse.isOpen, isVisible, collapse.autoScrollOnOpen],
  ([open, visible, autoScroll], [wasOpen], onCleanup) => {
    if (!open || !autoScroll) scrollPending = false;
    else if (!wasOpen) scrollPending = true;
    if (!visible || !scrollPending) return;

    // Hiding the sidebar cancels this attempt. Expanding it does not schedule another.
    scrollPending = false;
    const timer = window.setTimeout(() => {
      if (content.value) scrollWithinSidebarViewport(content.value, { behavior: "smooth" });
    }, sidebar.animationDuration.value);
    onCleanup(() => window.clearTimeout(timer));
  },
  { flush: "post" },
);
</script>

<template>
  <div
    :id="collapse.contentId"
    ref="content"
    role="region"
    :aria-hidden="!isVisible"
    :inert="!isVisible ? true : undefined"
    :class="['phi-sidebar-collapsible-content', { 'phi-sidebar-collapsible-content--open': isVisible }]"
    @transitionend="handleTransitionEnd"
  >
    <div class="phi-sidebar-collapsible-content__inner">
      <slot />
    </div>
  </div>
</template>
