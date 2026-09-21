<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import ToastItem from "./ToastItem.vue";
import type { PhiToastManager, ToastVariant } from "./toast";

const props = defineProps<{
  manager: PhiToastManager;
  variant: ToastVariant;
}>();

const toasts = computed(() => props.manager.toasts.value);
const viewportStyle = computed(() => ({
  zIndex: 1100 + props.manager.layer.value,
}));

const getToastStyle = (index: number) => {
  const stackIndex = Math.max(0, toasts.value.length - index - 1);
  const scale = Math.max(0, 1 - stackIndex * 0.1);
  const offset = -(stackIndex * 12 + (1 - scale) * 78);

  return {
    "--phi-toast-expanded-offset": `${stackIndex * -88}px`,
    "--phi-toast-index": String(stackIndex),
    "--phi-toast-offset": `${offset}px`,
    "--phi-toast-scale": String(scale),
  };
};

const isToastLimited = (index: number) => toasts.value.length - index - 1 >= 3;

let resumeInteractionTimer: ReturnType<typeof setTimeout> | undefined;
let interactionSyncTimer: ReturnType<typeof setInterval> | undefined;

const handleInteractionStart = () => {
  if (resumeInteractionTimer) {
    globalThis.clearTimeout(resumeInteractionTimer);
    resumeInteractionTimer = undefined;
  }

  props.manager.pauseAll();
};

const handleInteractionEnd = (event?: Event) => {
  const relatedTarget = event instanceof FocusEvent || event instanceof MouseEvent ? event.relatedTarget : null;

  if (relatedTarget instanceof Node && (event?.currentTarget as HTMLElement | undefined)?.contains(relatedTarget)) {
    return;
  }

  if (resumeInteractionTimer) globalThis.clearTimeout(resumeInteractionTimer);
  resumeInteractionTimer = globalThis.setTimeout(() => {
    props.manager.resumeAll();
    resumeInteractionTimer = undefined;
  }, 80);
};

const eventTargetsStack = (event: Event) => {
  const pointedElement =
    event instanceof MouseEvent ? document.elementFromPoint(event.clientX, event.clientY) : undefined;

  return Boolean(
    (event.target instanceof Element && event.target.closest(".phi-toast-viewport")) ||
      pointedElement?.closest(".phi-toast-viewport"),
  );
};

const handleDocumentInteractionStart = (event: Event) => {
  if (eventTargetsStack(event)) handleInteractionStart();
};

const handleDocumentInteractionMove = (event: Event) => {
  if (eventTargetsStack(event)) {
    handleInteractionStart();
  } else {
    handleInteractionEnd(event);
  }
};

const syncHoveredStackPause = () => {
  if (toasts.value.length === 0) return;

  if (
    document.querySelector(".phi-toast-viewport:hover, .phi-toast-list:hover, .phi-toast:hover") ||
    document.querySelector(".phi-toast-viewport :focus")
  ) {
    handleInteractionStart();
  }
};

onMounted(() => {
  document.addEventListener("focusin", handleDocumentInteractionStart, true);
  document.addEventListener("mouseover", handleDocumentInteractionStart, true);
  document.addEventListener("mousemove", handleDocumentInteractionMove, true);
  document.addEventListener("pointerover", handleDocumentInteractionStart, true);
  document.addEventListener("pointermove", handleDocumentInteractionMove, true);
  interactionSyncTimer = globalThis.setInterval(syncHoveredStackPause, 100);
});

onBeforeUnmount(() => {
  document.removeEventListener("focusin", handleDocumentInteractionStart, true);
  document.removeEventListener("mouseover", handleDocumentInteractionStart, true);
  document.removeEventListener("mousemove", handleDocumentInteractionMove, true);
  document.removeEventListener("pointerover", handleDocumentInteractionStart, true);
  document.removeEventListener("pointermove", handleDocumentInteractionMove, true);
  if (resumeInteractionTimer) globalThis.clearTimeout(resumeInteractionTimer);
  if (interactionSyncTimer) globalThis.clearInterval(interactionSyncTimer);
  props.manager.resumeAll();
});
</script>

<template>
  <div
    v-if="toasts.length > 0"
    class="phi-toast-viewport"
    aria-live="polite"
    aria-relevant="additions removals"
    data-phi-component="Toast"
    :style="viewportStyle"
  >
    <TransitionGroup
      class="phi-toast-list"
      name="phi-toast-transition"
      tag="ol"
      :style="{ '--phi-toast-count': String(toasts.length) }"
      @focusin="handleInteractionStart"
      @focusout="handleInteractionEnd"
      @mouseenter="handleInteractionStart"
      @mouseleave="handleInteractionEnd"
      @pointerenter="handleInteractionStart"
      @pointerleave="handleInteractionEnd"
      @mouseover="handleInteractionStart"
      @pointerover="handleInteractionStart"
    >
      <li
        v-for="(toast, index) in toasts"
        :key="toast.id"
        class="phi-toast-list__item"
        :aria-hidden="isToastLimited(index) ? 'true' : undefined"
        :data-limited="isToastLimited(index) ? '' : undefined"
        :data-state="toast.state"
        :inert="isToastLimited(index)"
        :style="getToastStyle(index)"
        @focusin="handleInteractionStart"
        @focusout="handleInteractionEnd"
        @mouseenter="handleInteractionStart"
        @mouseleave="handleInteractionEnd"
        @pointerenter="handleInteractionStart"
        @pointerleave="handleInteractionEnd"
        @mouseover="handleInteractionStart"
        @pointerover="handleInteractionStart"
      >
        <ToastItem
          :toast="toast"
          :fallback-variant="variant"
          @close="manager.dismiss(toast.id)"
          @interact-end="handleInteractionEnd"
          @interact-start="handleInteractionStart"
        />
      </li>
    </TransitionGroup>
  </div>
</template>
