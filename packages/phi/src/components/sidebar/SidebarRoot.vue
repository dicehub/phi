<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, watch } from "vue";
import { useSidebarContext } from "./sidebar-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    contentClass?: unknown;
    contentClassName?: unknown;
    fullScreenOnMobile?: boolean;
  }>(),
  {
    fullScreenOnMobile: false,
  },
);

const attrs = useAttrs();
const sidebar = useSidebarContext();
const mobileNode = ref<HTMLElement>();
const triggerNode = ref<HTMLElement | null>(null);
const shouldRestoreFocus = ref(false);
let isPointerInPeekZone = false;
let isFocusInPeekZone = false;

const railWidth = computed(() => {
  if (sidebar.open.value) {
    return sidebar.resizable.value ? `${sidebar.width.value}px` : "var(--sidebar-width)";
  }

  return sidebar.collapsible.value === "icon" ? "var(--sidebar-width-icon)" : "0px";
});

const contentWidth = computed(() => {
  const expandedWidth = sidebar.resizable.value ? `${sidebar.width.value}px` : "var(--sidebar-width)";
  const collapsedWidth = sidebar.collapsible.value === "icon" ? "var(--sidebar-width-icon)" : "0px";

  return sidebar.open.value || sidebar.isPeeking.value ? expandedWidth : collapsedWidth;
});

const focusFirstMobileItem = async () => {
  await nextTick();
  const focusable = mobileNode.value?.querySelector<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );
  (focusable ?? mobileNode.value)?.focus();
};

const closeMobile = (restoreFocus: boolean) => {
  shouldRestoreFocus.value = restoreFocus;
  sidebar.setOpenMobile(false);
};

const startPointerPeek = () => {
  isPointerInPeekZone = true;
  sidebar.startPeek();
};

const stopPointerPeek = () => {
  isPointerInPeekZone = false;
  if (!isFocusInPeekZone) sidebar.stopPeek();
};

const startFocusPeek = () => {
  isFocusInPeekZone = true;
  sidebar.startPeek();
};

const stopFocusPeek = (event: FocusEvent) => {
  const currentTarget = event.currentTarget;
  const relatedTarget = event.relatedTarget;

  if (
    currentTarget instanceof HTMLElement &&
    relatedTarget instanceof Node &&
    currentTarget.contains(relatedTarget)
  ) {
    return;
  }

  isFocusInPeekZone = false;
  if (!isPointerInPeekZone) sidebar.stopPeek();
};

const onDocumentKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && sidebar.isMobile.value && sidebar.openMobile.value) {
    closeMobile(true);
  }
};

watch(
  () => sidebar.openMobile.value,
  (isOpen) => {
    if (!sidebar.isMobile.value) return;

    if (isOpen) {
      triggerNode.value = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      shouldRestoreFocus.value = false;
      void focusFirstMobileItem();
      return;
    }

    if (shouldRestoreFocus.value && triggerNode.value) {
      triggerNode.value.focus();
      triggerNode.value = null;
      shouldRestoreFocus.value = false;
    }
  },
);

watch(
  () => sidebar.openMobile.value && sidebar.isMobile.value,
  (isOpen) => {
    if (isOpen) {
      document.addEventListener("keydown", onDocumentKeydown);
    } else {
      document.removeEventListener("keydown", onDocumentKeydown);
    }
  },
);

onBeforeUnmount(() => {
  document.removeEventListener("keydown", onDocumentKeydown);
});
</script>

<template>
  <aside
    v-if="sidebar.collapsible.value === 'none'"
    v-bind="attrs"
    data-state="expanded"
    :data-side="sidebar.side.value"
    :data-variant="sidebar.variant.value"
    data-sidebar="sidebar"
    :class="['phi-sidebar', 'phi-sidebar--static', attrs.class]"
  >
    <slot />
  </aside>

  <template v-else-if="sidebar.isMobile.value">
    <div
      data-sidebar-backdrop
      aria-hidden="true"
      :class="[
        'phi-sidebar-backdrop',
        {
          'phi-sidebar-backdrop--open': sidebar.openMobile.value && !props.fullScreenOnMobile,
          'phi-sidebar-backdrop--contained': sidebar.contained.value,
        },
      ]"
      @click="closeMobile(true)"
    />
    <nav
      ref="mobileNode"
      v-bind="attrs"
      tabindex="-1"
      aria-label="Navigation"
      :aria-hidden="!sidebar.openMobile.value"
      :inert="!sidebar.openMobile.value ? true : undefined"
      :data-state="sidebar.openMobile.value ? 'expanded' : 'collapsed'"
      :data-side="sidebar.side.value"
      :data-variant="sidebar.variant.value"
      :data-collapsible="sidebar.collapsible.value"
      data-sidebar="sidebar"
      data-mobile="true"
      :class="[
        'phi-sidebar',
        'phi-sidebar--mobile',
        `phi-sidebar--${sidebar.side.value}`,
        {
          'phi-sidebar--mobile-open': sidebar.openMobile.value,
          'phi-sidebar--mobile-full-screen': props.fullScreenOnMobile,
          'phi-sidebar--contained': sidebar.contained.value,
        },
        attrs.class,
      ]"
    >
      <slot />
    </nav>
  </template>

  <aside
    v-else
    v-bind="attrs"
    :data-state="sidebar.state.value"
    :data-side="sidebar.side.value"
    :data-variant="sidebar.variant.value"
    :data-collapsible="sidebar.collapsible.value"
    data-sidebar="sidebar"
    :style="{ width: railWidth }"
    :class="[
      'phi-sidebar',
      `phi-sidebar--${sidebar.side.value}`,
      `phi-sidebar--variant-${sidebar.variant.value}`,
      { 'phi-sidebar--resizing': sidebar.isResizing.value },
      attrs.class,
    ]"
  >
    <div
      data-sidebar="content-container"
      :style="{ width: contentWidth }"
      :class="[
        'phi-sidebar__content-container',
        {
          'phi-sidebar__content-container--overlay': !sidebar.open.value,
          'phi-sidebar__content-container--resizing': sidebar.isResizing.value,
        },
        props.contentClass,
        props.contentClassName,
      ]"
      @mouseenter="startPointerPeek"
      @mousemove="startPointerPeek"
      @mouseleave="stopPointerPeek"
      @focusin="startFocusPeek"
      @focusout="stopFocusPeek"
    >
      <slot />
    </div>
  </aside>
</template>

<style src="./sidebar-mobile-full-screen.css"></style>
