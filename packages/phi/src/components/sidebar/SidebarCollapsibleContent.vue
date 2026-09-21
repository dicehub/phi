<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useSidebarCollapseContext, useSidebarContext } from "./sidebar-context";

const collapse = useSidebarCollapseContext();
const sidebar = useSidebarContext();
const content = ref<HTMLElement>();
const isVisible = computed(() => collapse.isOpen.value && sidebar.state.value !== "collapsed");

// Only this element's own row transition settles the collapse; nested or parent transitions do not.
const handleTransitionEnd = (event: TransitionEvent) => {
  if (event.target !== event.currentTarget) return;
  if (event.propertyName !== "grid-template-rows") return;

  collapse.completeOpenChange();
};

watch(isVisible, async (visible) => {
  if (!visible || !collapse.autoScrollOnOpen.value) return;
  await nextTick();
  window.setTimeout(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    content.value?.scrollIntoView({
      block: "nearest",
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, sidebar.animationDuration.value);
});
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
