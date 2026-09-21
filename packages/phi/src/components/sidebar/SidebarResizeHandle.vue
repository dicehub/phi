<script setup lang="ts">
import { useSidebarContext } from "./sidebar-context";

const sidebar = useSidebarContext();
let startX = 0;
let startWidth = 0;
let wasCollapsed = false;

const stopResize = () => {
  sidebar.setIsResizing(false);
  document.removeEventListener("pointermove", onPointerMove);
  document.removeEventListener("pointerup", stopResize);
};

const onPointerMove = (event: PointerEvent) => {
  const delta = sidebar.side.value === "left" ? event.clientX - startX : startX - event.clientX;
  const rawWidth = startWidth + delta;

  if (wasCollapsed) {
    if (rawWidth >= sidebar.minWidth.value) {
      wasCollapsed = false;
      sidebar.setOpen(true);
      sidebar.setWidth(rawWidth);
    }
    return;
  }

  if (rawWidth < sidebar.minWidth.value) {
    sidebar.setOpen(false);
    wasCollapsed = true;
    return;
  }

  sidebar.setWidth(rawWidth);
};

const onPointerDown = (event: PointerEvent) => {
  event.preventDefault();
  sidebar.setIsResizing(true);
  startX = event.clientX;
  wasCollapsed = !sidebar.open.value;

  const wrapper = (event.currentTarget as HTMLElement).closest("[data-sidebar-wrapper]");
  const aside = wrapper?.querySelector<HTMLElement>("[data-sidebar='sidebar']");
  startWidth = aside?.getBoundingClientRect().width ?? 0;

  document.addEventListener("pointermove", onPointerMove);
  document.addEventListener("pointerup", stopResize);
};

const onKeydown = (event: KeyboardEvent) => {
  const grow = sidebar.side.value === "left" ? "ArrowRight" : "ArrowLeft";
  const shrink = sidebar.side.value === "left" ? "ArrowLeft" : "ArrowRight";
  const step = 10;

  if (event.key === grow) {
    event.preventDefault();
    if (!sidebar.open.value) {
      sidebar.setOpen(true);
      sidebar.setWidth(sidebar.minWidth.value);
    } else {
      sidebar.setWidth(Math.min(sidebar.width.value + step, sidebar.maxWidth.value));
    }
  } else if (event.key === shrink) {
    event.preventDefault();
    const nextWidth = sidebar.width.value - step;
    if (nextWidth < sidebar.minWidth.value) sidebar.setOpen(false);
    else sidebar.setWidth(nextWidth);
  } else if (event.key === "Home") {
    event.preventDefault();
    sidebar.setOpen(false);
  } else if (event.key === "End") {
    event.preventDefault();
    sidebar.setOpen(true);
    sidebar.setWidth(sidebar.maxWidth.value);
  }
};
</script>

<template>
  <button
    v-if="sidebar.resizable.value"
    type="button"
    aria-label="Resize sidebar"
    data-sidebar="resize-handle"
    class="phi-sidebar-resize-handle"
    @pointerdown="onPointerDown"
    @keydown="onKeydown"
  />
</template>
