<script setup lang="ts">
import { computed } from "vue";
import { provideToolbarContext } from "./context";
import { TOOLBAR_DEFAULT_SIZE, resolveToolbarSize, type ToolbarSize } from "./toolbar";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    size?: ToolbarSize;
  }>(),
  {
    size: TOOLBAR_DEFAULT_SIZE,
  },
);

const resolvedSize = computed(() => resolveToolbarSize(props.size));
const focusableSelector =
  'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])';

provideToolbarContext({
  size: resolvedSize,
});

const getFocusableItems = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>(".phi-toolbar__item"))
    .map((item) => (item.matches(focusableSelector) ? item : item.querySelector<HTMLElement>(focusableSelector)))
    .filter((item): item is HTMLElement => Boolean(item && item.offsetParent !== null));

const shouldKeepTextCursor = (event: KeyboardEvent, target: Node) => {
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return false;
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return false;

  const selectionStart = target.selectionStart;
  const selectionEnd = target.selectionEnd;
  if (selectionStart === null || selectionEnd === null) return false;
  if (selectionStart !== selectionEnd) return true;

  return event.key === "ArrowLeft" ? selectionStart > 0 : selectionEnd < target.value.length;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) return;
  if (event.defaultPrevented && !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  if (!(event.currentTarget instanceof HTMLElement) || !(event.target instanceof Node)) return;

  const target = event.target;
  if (shouldKeepTextCursor(event, target)) return;

  const items = getFocusableItems(event.currentTarget);
  const currentIndex = items.findIndex((item) => item === target || item.contains(target));

  if (currentIndex === -1 || items.length < 2) return;

  const lastIndex = items.length - 1;
  const nextIndex =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? lastIndex
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? (currentIndex - 1 + items.length) % items.length
          : (currentIndex + 1) % items.length;

  event.preventDefault();
  items[nextIndex]?.focus();
};
</script>

<template>
  <div
    v-bind="$attrs"
    class="phi-toolbar"
    :class="[`phi-toolbar--${resolvedSize}`]"
    role="toolbar"
    aria-orientation="horizontal"
    data-phi-component="Toolbar"
    @keydown="handleKeydown"
  >
    <slot />
  </div>
</template>

<style src="./toolbar.css"></style>
